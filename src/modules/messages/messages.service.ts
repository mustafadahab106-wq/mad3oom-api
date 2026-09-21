import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation) private readonly conversations: Repository<Conversation>,
    @InjectRepository(Message) private readonly messages: Repository<Message>,
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
      }
