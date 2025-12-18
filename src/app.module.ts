import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ListingsModule } from './modules/listings/listings.module';
import { UsersModule } from './modules/users/users.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VinRecordsModule } from './modules/vin-records/vin-records.module';
import { DeletionRequestsModule } from './modules/deletion-requests/deletion-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');
        
        console.log('🔧 Environment:', isProduction ? 'Production' : 'Development');
        console.log('🔧 Database URL present:', !!databaseUrl);
        
        // 🟢 الحالة 1: التنمية المحلية - استخدم SQLite
        if (!isProduction && !databaseUrl) {
          console.log('🔧 Using SQLite for local development');
          return {
            type: 'sqlite',
            database: configService.get('DB_DATABASE', 'database.sqlite'),
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            logging: true,
          };
        }
        
        // 🟢 الحالة 2: Railway Production مع SSL
        if (databaseUrl && isProduction) {
          console.log('🔧 Using Railway PostgreSQL with SSL');
          let finalUrl = databaseUrl;
          
          // تأكد من وجود sslmode=require
          if (!finalUrl.includes('sslmode=')) {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${separator}sslmode=require`;
          }
          
          return {
            type: 'postgres',
            url: finalUrl,
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
            entities: ['dist/**/*.entity.js'],
            synchronize: false,
            logging: ['error', 'warn'],
          };
        }
        
        // 🟢 الحالة 3: PostgreSQL محلي بدون SSL
        console.log('🔧 Using local PostgreSQL without SSL');
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'mad3oom'),
          entities: ['dist/**/*.entity.js'],
          synchronize: !isProduction,
          logging: true,
          ssl: false, // ⚠️ مهم: false للتطوير المحلي
        };
      },
    }),

    AuthModule,
    UsersModule,
    ListingsModule,
    MediaModule,
    PaymentsModule,
    VinRecordsModule,
    DeletionRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}