// app/api/nodes/nodes.service.ts
import { NodesRepository } from './nodes.repository';

export class NodesService {
  private repository: NodesRepository;

  constructor() {
    this.repository = new NodesRepository();
  }

  async getAllNodes() {
    // You can process or format your business data here if needed
    return await this.repository.findAll();
  }
}
