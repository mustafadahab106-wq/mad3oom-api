import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Notification } from './entities/notification.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation) private readonly conversations: Repository<Conversation>,
    @InjectRepository(Message) private readonly messages: Repository<Message>,
    @InjectRepository(Notification) private readonly notifications: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  private async requireMember(conversationId: number, userId: number) {
    const conversation = await this.conversations.findOne({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('Not a member of this conversation');
    }
    return conversation;
  }

  async createOrGet(userId: number, otherUserId: number, listingId?: number) {
    if (userId === otherUserId) throw new BadRequestException('Cannot message yourself');
    const a = Math.min(userId, otherUserId);
    const b = Math.max(userId, otherUserId);
    const existing = await this.conversations.findOne({
      where: { user1Id: a, user2Id: b, listingId: listingId ?? null },
    });
    if (existing) return existing;
    return this.conversations.save(this.conversations.create({ user1Id: a, user2Id: b, listingId: listingId ?? null }));
  }

  async listConversations(userId: number) {
    const list = await this.conversations
      .createQueryBuilder('c')
      .where('c."user1Id" = :userId OR c."user2Id" = :userId', { userId })
      .orderBy('c."updatedAt"', 'DESC')
      .getMany();

    return Promise.all(
      list.map(async (c) => {
        const otherId = c.user1Id === userId ? c.user2Id : c.user1Id;
        let otherName = `#${otherId}`;
        try {
          const other = await this.usersService.findOne(otherId);
          otherName = other?.name || other?.email || otherName;
        } catch {
          // المستخدم الآخر ممكن يكون انحذف — نكمل بالاسم الافتراضي
        }
        return { ...c, otherUserId: otherId, otherUserName: otherName };
      }),
    );
  }

  async listMessages(conversationId: number, userId: number) {
    await this.requireMember(conversationId, userId);
    return this.messages.find({ where: { conversationId }, order: { createdAt: 'ASC' } });
  }

  async send(conversationId: number, userId: number, body: string) {
    const conversation = await this.requireMember(conversationId, userId);
    const text = body.trim();
    if (!text) throw new BadRequestException('Message is required');
    const message = await this.messages.save(this.messages.create({ conversationId, senderId: userId, body: text, readAt: null }));
    conversation.updatedAt = new Date();
    await this.conversations.save(conversation);

    // إشعار تلقائي للطرف الآخر بالمحادثة
    const recipientId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
    let senderName = 'مستخدم';
    try {
      const sender = await this.usersService.findOne(userId);
      senderName = sender?.name || sender?.email || senderName;
    } catch {
      // نكمل بالاسم الافتراضي لو تعذر جلب المرسل
    }
    await this.notifications.save(
      this.notifications.create({
        userId: recipientId,
        type: 'message',
        title: senderName,
        body: text.slice(0, 200),
        conversationId,
        messageId: message.id,
        readAt: null,
      }),
    );

    return message;
  }

  async markRead(conversationId: number, userId: number) {
    await this.requireMember(conversationId, userId);
    await this.messages
      .createQueryBuilder()
      .update(Message)
      .set({ readAt: new Date() })
      .where('"conversationId" = :conversationId', { conversationId })
      .andWhere('"senderId" != :userId', { userId })
      .andWhere('"readAt" IS NULL')
      .execute();
    return { ok: true };
  }

  // ---------- الإشعارات ----------
  async listNotifications(userId: number) {
    return this.notifications.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 50 });
  }

  async markNotificationRead(id: number, userId: number) {
    const notification = await this.notifications.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('Not your notification');
    notification.readAt = new Date();
    return this.notifications.save(notification);
  }

  async markAllNotificationsRead(userId: number) {
    await this.notifications
      .createQueryBuilder()
      .update(Notification)
      .set({ readAt: new Date() })
      .where('"userId" = :userId', { userId })
      .andWhere('"readAt" IS NULL')
      .execute();
    return { ok: true };
  }
}
