import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeletionRequest } from './deletion-request.entity';
import { DeletionRequestsService } from './deletion-requests.service';
import { DeletionRequestsController } from './deletion-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeletionRequest])],
  providers: [DeletionRequestsService],
  controllers: [DeletionRequestsController],
})
export class DeletionRequestsModule {}