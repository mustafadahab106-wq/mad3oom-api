import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

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

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
      // خليه false عشان ما يقفل لأسباب بسيطة وقت التشغيل
      abortOnError: false,
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

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
  } catch (error: any) {
    logger.error(`❌ Failed to start application: ${error?.message || error}`);
    process.exit(1);
  }
}

bootstrap();
