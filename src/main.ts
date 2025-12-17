import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Starting application...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      bufferLogs: true,
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // CORS
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = process.env.PORT || 4000;
    const host = '0.0.0.0';
    
    await app.listen(port, host);
    
    logger.log(`🚀 Application is running on: http://${host}:${port}`);
    logger.log(`📊 Health check: http://${host}:${port}/api/health`);
    logger.log(`🏓 Ping: http://${host}:${port}/api/ping`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();