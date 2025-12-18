import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 🟢 استورد الكيانات بشكل صريح
import { User } from './modules/users/entities/user.entity';
import { Listing } from './modules/listings/entities/listing.entity';
import { VinRecord } from './modules/vin-records/entities/vin-record.entity';

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
    // في AppModule، استخدم هذا الكود النهائي:
TypeOrmModule.forRootAsync({
  useFactory: () => {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      // 🟢 للـ Railway
      let finalUrl = databaseUrl;
      if (!finalUrl.includes('sslmode=')) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${separator}sslmode=no-verify`;
      }
      
      return {
        type: 'postgres',
        url: finalUrl,
        ssl: { rejectUnauthorized: false },
        entities: [User, Listing, VinRecord],
        synchronize: false,
        logging: ['error', 'warn'],
      };
    }
    
    // 🟢 للتنمية المحلية
    return {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Listing, VinRecord],
      synchronize: true,
      logging: true,
    };
  },
}),
    
    // 🟢 استخدم forRoot بدلاً من forRootAsync للتجربة
    TypeOrmModule.forRoot({
      // للتنمية المحلية - استخدم SQLite
      type: 'sqlite',
      database: 'database.sqlite',
      // 🟢 استخدم الكيانات المستوردة
      entities: [User, Listing, VinRecord],
      synchronize: true,
      logging: true,
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