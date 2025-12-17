import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'mad3oom-api',
      version: '1.0.0'
    };
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

  @Get('env')
  getEnv() {
    return {
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,
      database_url: process.env.DATABASE_URL ? 'set' : 'not set',
    };
  }
}