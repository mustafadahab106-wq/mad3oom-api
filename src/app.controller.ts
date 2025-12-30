// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    try {
      // اختبر اتصال قاعدة البيانات
      await this.dataSource.query('SELECT 1');
      
      // احصل على معلومات قاعدة البيانات
      const dbInfo = await this.appService.getDbInfo();
      
      return { 
        status: 'ok', 
        database: 'connected',
        ...dbInfo,
        service: 'mad3oom-api',
        version: '1.0.0'
      };
    } catch (error) {
      return { 
        status: 'error', 
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('ping')
  ping() {
    return { 
      ok: true, 
      service: 'mad3oom-api', 
      time: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get('db-info')
  async getDbInfo() {
    return this.appService.getDbInfo();
  }

  @Get('postgres-test')
  async testPostgres() {
    return this.appService.testPostgresConnection();
  }
}