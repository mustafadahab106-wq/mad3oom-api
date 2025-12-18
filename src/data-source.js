// src/config/database.config.ts
export const databaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (databaseUrl) {
    // تأكد من وجود sslmode
    let finalUrl = databaseUrl;
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
      logging: ['error'],
      maxQueryExecutionTime: 1000,
    };
  }
  
  return {
    type: 'sqlite',
    database: process.env.SQLITE_DB_PATH || 'database.sqlite',
    entities: ['dist/**/*.entity.js'],
    synchronize: !isProduction,
    logging: true,
  };
};

// ثم في AppModule
TypeOrmModule.forRoot(databaseConfig()),// src/config/database.config.ts
export const databaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (databaseUrl) {
    // تأكد من وجود sslmode
    let finalUrl = databaseUrl;
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
      logging: ['error'],
      maxQueryExecutionTime: 1000,
    };
  }
  
  return {
    type: 'sqlite',
    database: process.env.SQLITE_DB_PATH || 'database.sqlite',
    entities: ['dist/**/*.entity.js'],
    synchronize: !isProduction,
    logging: true,
  };
};

// ثم في AppModule
TypeOrmModule.forRoot(databaseConfig()),