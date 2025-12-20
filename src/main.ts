import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function testDatabaseConnection() {
  const { Client } = require('pg');
  const databaseUrl = process.env.DATABASE_URL;
  console.log("✅ LOADED APP MODULE: 2025-12-20 listings-enabled");

  if (!databaseUrl) {
    console.log('ℹ️ No DATABASE_URL, using SQLite');
    return true;
  }
  
  // أضف sslmode=no-verify للاختبار
  const testUrl = databaseUrl.includes('?') 
    ? `${databaseUrl}&sslmode=no-verify`
    : `${databaseUrl}?sslmode=no-verify`;
  
  const client = new Client({
    connectionString: testUrl,
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful');
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting application...');
    
    // 🟢 اختبر اتصال قاعدة البيانات أولاً
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Database connection test failed, but continuing anyway...');
    }
    
    // 🟢 تحقق من إعدادات SSL
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      console.log('🔗 SSL Configuration:');
      console.log('- URL:', databaseUrl.includes('sslmode=') ? 'Has sslmode' : 'No sslmode');
      console.log('- Railway:', databaseUrl.includes('railway.app') ? 'Yes' : 'No');
      
      // تحذير إذا لم يكن هناك sslmode
      if (!databaseUrl.includes('sslmode=')) {
        console.log('⚠️  WARNING: DATABASE_URL missing sslmode parameter');
        console.log('💡 Add ?sslmode=no-verify to the end of DATABASE_URL');
      }
    }
    
    const app = await NestFactory.create(AppModule, {
     logger: ['error', 'warn', 'log', 'debug'],

      abortOnError: true,
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    
    await app.listen(port, '0.0.0.0');
    const server = app.getHttpAdapter().getInstance();
const stack = server?._router?.stack || [];
const routes = stack
  .filter((l) => l.route)
  .map((l) => {
    const methods = Object.keys(l.route.methods || {}).join(',').toUpperCase();
    return `${methods} ${l.route.path}`;
  });

console.log('🧭 ROUTES:', routes);

    logger.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    logger.log(`🏥 Health check: http://0.0.0.0:${port}/health`);
    logger.log(`📡 Ping: http://0.0.0.0:${port}/ping`);
    
  } catch (error) {
    logger.error('❌ Failed to start application:', error.message);
    
    if (error.message.includes('self-signed certificate')) {
      console.log('\n🔧 SSL CERTIFICATE FIX:');
      console.log('1. Add ?sslmode=no-verify to DATABASE_URL');
      console.log('2. Or use rejectUnauthorized: false in TypeORM config');
      console.log('3. Example:');
      console.log('   DATABASE_URL=postgresql://...?sslmode=no-verify');
    }
    
    process.exit(1);
  }
}

bootstrap();