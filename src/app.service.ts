// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): any {
    const dbType = this.dataSource.driver.options.type;
    const isConnected = this.dataSource.isInitialized;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    return {
      message: 'Mad3oom API is running!',
      status: 'ok',
      database: {
        type: dbType,
        connected: isConnected,
        using_railway_postgres: hasDatabaseUrl,
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  // دالة إضافية للتحقق من قاعدة البيانات
  async getDbInfo() {
    try {
      const dbType = this.dataSource.driver.options.type;
      const isConnected = this.dataSource.isInitialized;
      
      // حاول الحصول على إصدار قاعدة البيانات
      let dbVersion = 'unknown';
      if (isConnected) {
        if (dbType === 'postgres') {
          const result = await this.dataSource.query('SELECT version();');
          dbVersion = result[0]?.version || 'unknown';
        } else if (dbType === 'sqlite') {
          const result = await this.dataSource.query('SELECT sqlite_version();');
          dbVersion = result[0]?.['sqlite_version()'] || 'unknown';
        }
      }
      
      return {
        database_type: dbType,
        database_version: dbVersion,
        is_connected: isConnected,
        railway_postgres: !!process.env.DATABASE_URL,
        node_env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        database_type: 'unknown',
        is_connected: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // اختبار اتصال PostgreSQL
  async testPostgresConnection() {
    try {
      // اختبار اتصال PostgreSQL
      const result = await this.dataSource.query('SELECT 1 as test');
      return {
        success: true,
        message: 'PostgreSQL connection successful',
        test: result[0],
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'PostgreSQL connection failed',
        error: error.message,
        database_type: this.dataSource.driver.options.type,
      };
    }
  }
}