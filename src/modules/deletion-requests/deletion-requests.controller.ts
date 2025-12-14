import { Controller, Get } from '@nestjs/common';
import { DeletionRequestsService } from './deletion-requests.service';

@Controller('deletion-requests')
export class DeletionRequestsController {
  constructor(private readonly deletionRequestsService: DeletionRequestsService) {}

  @Get()
  findAll() {
    return this.deletionRequestsService.findAll();
  }
}