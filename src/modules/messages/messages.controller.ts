import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get('notifications')
  notifications(@Req() req: any) { return this.service.listNotifications(Number(req.user.userId)); }

  @Patch('notifications/read-all')
  readAllNotifications(@Req() req: any) { return this.service.markAllNotificationsRead(Number(req.user.userId)); }

  @Patch('notifications/:id/read')
  readNotification(@Req() req: any, @Param('id') id: string) {
    return this.service.markNotificationRead(Number(id), Number(req.user.userId));
  }

  @Get('conversations')
  list(@Req() req: any) { return this.service.listConversations(Number(req.user.userId)); }

  @Post('conversations')
  create(@Req() req: any, @Body() dto: CreateConversationDto) {
    return this.service.createOrGet(Number(req.user.userId), Number(dto.otherUserId), dto.listingId);
  }

  @Get('conversations/:id')
  messages(@Req() req: any, @Param('id') id: string) {
    return this.service.listMessages(Number(id), Number(req.user.userId));
  }

  @Post('conversations/:id')
  send(@Req() req: any, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.service.send(Number(id), Number(req.user.userId), dto.body);
  }

  @Patch('conversations/:id/read')
  read(@Req() req: any, @Param('id') id: string) {
    return this.service.markRead(Number(id), Number(req.user.userId));
  }
              }
