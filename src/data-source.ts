// src/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // 🟢 إعدادات SSL لـ Railway
  ssl: process.env.DATABASE_URL?.includes('railway.app') 
    ? { 
        rejectUnauthorized: false,
        ca: process.env.SSL_CERT || undefined,
      }
    : false,
  extra: process.env.DATABASE_URL?.includes('railway.app')
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {},
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
});