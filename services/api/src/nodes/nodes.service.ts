// app/api/nodes/nodes.service.ts
import { Injectable } from '@nestjs/common';
import { CreateNodeDto } from './nodes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemNode } from '../entities/node.entity';

@Injectable()
export class NodesService {
  constructor(@InjectRepository(ItemNode) private readonly repository: Repository<ItemNode>) {}

  async getAllNodes() {
    // You can process or format your business data here if needed
    return await this.repository.find();
  }

  async getNodeById(id: string) {
    const node = await this.repository.findOne({ where: { id } });
    if (!node) {
      throw new Error('Node not found');
    }
    return node;
  }

  async createNode(nodeDto: CreateNodeDto) {
    const node = this.repository.create(nodeDto);
    if (nodeDto.parentId) {
      const parentNode = await this.repository.findOne({ where: { id: nodeDto.parentId } });
      if (!parentNode) {
        throw new Error('Parent node not found');
      }
      node.parent = parentNode;
    }

    return await this.repository.save(node);
  }
}
