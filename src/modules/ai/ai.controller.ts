import { Body, Controller, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { CompleteListingDto } from './dto/complete-listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // مساعد الزوار — مفتوح بدون تسجيل دخول
  @Post('chat')
  chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto);
  }

  // صوت المساعد — مفتوح، يرجّع ملف صوت MP3
  @Post('speak')
  async speak(@Body('text') text: string, @Res() res: Response) {
    const audio = await this.aiService.speak(text || '');
    res.set({ 'Content-Type': 'audio/mpeg', 'Content-Length': audio.length });
    res.send(audio);
  }

  // مساعد إكمال الإعلان بالصور — للبائعين المسجّلين فقط
  @Post('complete-listing')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 4))
  completeListing(@UploadedFiles() files: any[], @Body() dto: CompleteListingDto) {
    return this.aiService.completeListing(dto, files || []);
  }
}
