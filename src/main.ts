// src/main.ts
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // ✅ (مهم) Railway/Production: المنفذ من ENV
  const port = Number(configService.get<string>('PORT') ?? process.env.PORT ?? 4000);
  const host = String(configService.get<string>('HOST') ?? '0.0.0.0');

  // ✅ Static uploads
  // لو لاحقاً استخدمت Railway Volume: خلي uploads داخل مسار الـ mount (شرح تحت)
  const uploadsPath = join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });

  // ✅ CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, host);

  // في Railway الأفضل تطبع الرابط الحقيقي من Railway
  console.log(`🚀 Server running on ${host}:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
