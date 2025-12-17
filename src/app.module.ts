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

// 🟢 استورد الكيانات بشكل صريح من مجلد dist
// هذا أفضل لبيئة الإنتاج
@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');
        
        // 🟢 الخيار الأفضل: استخدام autoLoadEntities مع TypeOrmModule.forFeature
        const config: any = {
          autoLoadEntities: true, // ✅ هذا سيحمّل الكيانات تلقائياً من الوحدات
          synchronize: !isProduction,
          logging: !isProduction ? ['query', 'error'] : ['error'],
        };

        if (databaseUrl) {
          // Railway PostgreSQL
          const url = new URL(databaseUrl);
          return {
            type: 'postgres',
            host: url.hostname,
            port: parseInt(url.port),
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            ssl: { rejectUnauthorized: false },
            ...config,
          };
        }

        // Local SQLite
        return {
          type: 'sqlite',
          database: configService.get('SQLITE_DB_PATH', 'database.sqlite'),
          ...config,
        };
      },
      inject: [ConfigService],
    }),

    // 🟢 تأكد من تسجيل جميع الوحدات
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