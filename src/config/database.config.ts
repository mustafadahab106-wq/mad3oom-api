import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'mad3oom-dev.sqlite',
  synchronize: true,
  autoLoadEntities: true,
};

export default databaseConfig;
