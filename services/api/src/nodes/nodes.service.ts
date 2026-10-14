// app/api/nodes/nodes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNodeDto } from './nodes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemNode } from '../entities/node.entity';

@Injectable()
export class NodesService {
  constructor(@InjectRepository(ItemNode) private readonly repository: Repository<ItemNode>) {}

  private async findNodeOrThrow(
    id: string,
    message = 'Node not found',
  ): Promise<ItemNode> {
    const node = await this.repository.findOneBy({ id });

    if (!node) {
      throw new NotFoundException(message);
    }

    return node;
  }

  async getAllNodes() {
    // You can process or format your business data here if needed
    return await this.repository.find();
  }

  async getNodeById(id: string) {
    return this.findNodeOrThrow(id);
  }

  async createNode(nodeDto: CreateNodeDto) {
    const node = this.repository.create(nodeDto);
    if (nodeDto.parentId) {
      const parentNode = await this.findNodeOrThrow(nodeDto.parentId, 'Parent node not found');
      node.parent = parentNode;
    }

    return await this.repository.save(node);
  }

  // Only updates name for now, but can be extended to update other fields
  async updateNode(id: string, nodeDto: Partial<CreateNodeDto>) {
    const node = await this.findNodeOrThrow(id, 'Node not found');

    if (nodeDto.name) {
      node.name = nodeDto.name;
    }
    return await this.repository.save(node);
  }

  async deleteNode(id: string) {
    const node = await this.findNodeOrThrow(id, 'Node not found');
    await this.repository.remove(node);
  }
}
