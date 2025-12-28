import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function testDatabaseConnection(logger: Logger) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn('DATABASE_URL is not set (Postgres). App may fail if DB is required.');
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Client } = require('pg');

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    logger.log('✅ Database connection successful');
    await client.end();
    return true;
  } catch (error: any) {
    logger.error(`❌ Database connection failed: ${error?.message || error}`);
    return false;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Starting application...');
    logger.log(`NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);

    // اختياري: فحص اتصال قاعدة البيانات (مفيد جداً على Railway)
    await testDatabaseConnection(logger);

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
      abortOnError: false,
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // ✅ (5) Static serve للـ uploads
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

    // ✅ (4) Swagger بعد إنشاء app
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mad3oom API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, '0.0.0.0');

    // اطبع الراوتس فقط خارج production
    if (process.env.NODE_ENV !== 'production') {
      const server = app.getHttpAdapter().getInstance();
      const stack = server?._router?.stack || [];
      const routes = stack
        .filter((l: any) => l.route)
        .map((l: any) => {
          const methods = Object.keys(l.route.methods || {}).join(',').toUpperCase();
          return `${methods} ${l.route.path}`;
        });

      logger.log(`🧭 ROUTES (${routes.length}):`);
      routes.forEach((r: string) => logger.log(r));
    }

    logger.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    logger.log(`📚 Swagger is running on: http://0.0.0.0:${port}/docs`);
  } catch (error: any) {
    logger.error(`❌ Failed to start application: ${error?.message || error}`);
    process.exit(1);
  }
}

bootstrap();
