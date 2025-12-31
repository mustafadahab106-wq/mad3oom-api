// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { Response } from 'express';

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

  // 🔴 هذه endpoint للصحة يجب أن تعيد 200 دائماً حتى لو فشل الاتصال بقاعدة البيانات
  @Get('health')
  async healthCheck(@Res() res: Response) {
    try {
      // حاول الاتصال بقاعدة البيانات
      await this.dataSource.query('SELECT 1');
      
      const dbInfo = await this.appService.getDbInfo();
      
      return res.status(200).json({ 
        status: 'ok', 
        database: 'connected',
        ...dbInfo,
        service: 'mad3oom-api',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // حتى لو فشل الاتصال بقاعدة البيانات، أعد 200 للتطبيق
      return res.status(200).json({ 
        status: 'ok', 
        database: 'disconnected',
        error: error.message,
        service: 'mad3oom-api',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 🔴 أضف هذه endpoint البسيطة للـ health check
  @Get(['', '/', '/ping', '/status'])
  simpleHealthCheck(@Res() res: Response) {
    return res.status(200).json({
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
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