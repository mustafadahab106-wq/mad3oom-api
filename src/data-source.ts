import { DataSource } from 'typeorm';

// يُستخدم هذا الملف فقط من أدوات TypeORM CLI (مثلاً: توليد Migration جديد من جهاز فيه Node)
// السيرفر نفسه وقت التشغيل يستخدم الإعداد الموجود بـ src/app.module.ts، مو هذا الملف.
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
