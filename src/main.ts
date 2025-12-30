import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function testDatabaseConnection(logger: Logger) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn('DATABASE_URL is not set. Using SQLite for local development.');
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Client } = require('pg');
    
    // تعديل الرابط لإضافة sslmode إذا لم يكن موجوداً
    let connectionString = databaseUrl;
    if (!connectionString.includes('sslmode=')) {
      connectionString += '?sslmode=require';
    }
    
    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    logger.log('✅ PostgreSQL connection successful on Railway');
    await client.end();
    return true;
  } catch (error: any) {
    logger.error(`❌ PostgreSQL connection failed: ${error?.message || error}`);
    logger.error('Tip: Railway requires sslmode=require in DATABASE_URL');
    return false;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Starting Mad3oom API on Railway...');
    logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'production'}`);
    logger.log(`PORT: ${process.env.PORT || '8080'}`);
    
    // تحقق من اتصال PostgreSQL
    await testDatabaseConnection(logger);
    
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });

    // تمكين CORS
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Static files
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

    // Swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mad3oom API')
      .setDescription('Car Auction Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 8080;
    await app.listen(port, '0.0.0.0');

    logger.log(`✅ Mad3oom API is running on Railway: http://0.0.0.0:${port}`);
    logger.log(`📚 API Documentation: http://0.0.0.0:${port}/docs`);
    logger.log(`🏥 Health Check: http://0.0.0.0:${port}/health`);
    logger.log(`ℹ️  Database Info: http://0.0.0.0:${port}/db-info`);
    
  } catch (error: any) {
    logger.error(`❌ Failed to start application: ${error?.message || error}`);
    logger.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap();