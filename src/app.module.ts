import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { VinRecordsModule } from './modules/vin-records/vin-records.module';
import { DeletionRequestsModule } from './modules/deletion-requests/deletion-requests.module';
import { FieldInventoryModule } from './modules/field-inventory/field-inventory.module';
import { AiModule } from './modules/ai/ai.module';

import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Unified database configuration
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),

    // Application modules
    AuthModule,
    UsersModule,
    ListingsModule,
    MediaModule,
    PaymentsModule,
    VinRecordsModule,
    DeletionRequestsModule,
    FieldInventoryModule,
    AiModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
