import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  // Railway / Production → PostgreSQL
  if (
    databaseUrl &&
    (databaseUrl.startsWith('postgres://') ||
      databaseUrl.startsWith('postgresql://'))
  ) {
    return {
      type: 'postgres',
      url: databaseUrl,
      autoLoadEntities: true,

      // لا نستخدم synchronize في Production
      synchronize: false,

      ssl: isProduction
        ? {
            rejectUnauthorized: false,
          }
        : false,

      logging: !isProduction,
    };
  }

  // Local development → SQLite
  return {
    type: 'sqlite',
    database: 'mad3oom-dev.sqlite',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  };
}

export default getDatabaseConfig;
