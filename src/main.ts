import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting application...');
    
    // تسجيل معلومات مفيدة
    console.log('=================================');
    console.log('ENV Variables:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- PORT:', process.env.PORT);
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('=================================');
    
    // 🟢 إذا كان هناك DATABASE_URL في التطوير، احذر
    if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
      console.log('⚠️  WARNING: Using DATABASE_URL in development mode');
      console.log('⚠️  This will try to connect to Railway with SSL');
      console.log('⚠️  For local dev, remove DATABASE_URL from .env file');
    }
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      abortOnError: false,
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    const port = process.env.PORT || 4000;
    
    await app.listen(port);
    
    logger.log(`✅ Application is running on: http://localhost:${port}`);
    logger.log(`🏥 Health check: http://localhost:${port}/health`);
    logger.log(`📡 Ping: http://localhost:${port}/ping`);
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error.message);
    
    if (error.message.includes('SSL connections')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. For local development, remove DATABASE_URL from .env');
      console.log('2. Or change NODE_ENV to "development"');
      console.log('3. Or use SQLite by setting DB_TYPE=sqlite');
    }
    
    process.exit(1);
  }
}

bootstrap();