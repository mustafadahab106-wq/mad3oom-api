// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    const isProd = configService.get('NODE_ENV') === 'production';
    
    // إذا كان هناك DATABASE_URL (Railway) استخدم PostgreSQL
    if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
      return {
        type: 'postgres',
        url: databaseUrl,
        autoLoadEntities: true,
        synchronize: !isProd,
        ssl: isProd ? { rejectUnauthorized: false } : false,
        logging: true,
      };
    }
    
    // وإلا استخدم SQLite محلياً
    return {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  },
  inject: [ConfigService],
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
