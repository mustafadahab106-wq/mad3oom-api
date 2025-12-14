import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeletionRequest } from './deletion-request.entity';

@Injectable()
export class DeletionRequestsService {
  constructor(
    @InjectRepository(DeletionRequest)
    private deletionRequestRepository: Repository<DeletionRequest>,
  ) {}

  async findAll() {
    return this.deletionRequestRepository.find();
  }
}