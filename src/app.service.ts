import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello() {
    const type = this.dataSource.options.type;

    return {
      message: 'Mad3oom API is running!',
      status: 'ok',
      database:
        type === 'postgres'
          ? 'PostgreSQL connected'
          : 'SQLite connected',
      timestamp: new Date().toISOString(),
    };
  }
}
