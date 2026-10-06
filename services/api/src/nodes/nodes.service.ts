// app/api/nodes/nodes.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { NodesRepository } from './nodes.repository';

@Injectable()
export class NodesService {
  constructor(@Inject(NodesRepository) private readonly repository: NodesRepository) {}

  async getAllNodes() {
    // You can process or format your business data here if needed
    return await this.repository.findAll();
  }
}
