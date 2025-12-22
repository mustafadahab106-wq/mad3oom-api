// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      // Railway يحقن env من Variables، لكن وجود .env محلياً مفيد للتطوير
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
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
