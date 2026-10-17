// app/api/nodes/nodes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNodeDto, ResponseNodeDto } from '../dtos/nodes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemNode } from '../entities/node.entity';

@Injectable()
export class NodesService {
  constructor(@InjectRepository(ItemNode) private readonly repository: Repository<ItemNode>) {}

  // Private helper functions
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
  private normalizeTree(nodes: any[]) {
    const tree: any[] = [];
    const structuralMap = new Map<string, any>();
    const entities: Record<string, any> = {};

    nodes.forEach((node) => {
      entities[node.id] = new ResponseNodeDto(node.id, node.name, node.is_folder, node.updated_at, node.parent_id);
      structuralMap.set(node.id, { id: node.id, children: [] });
    });
    nodes.forEach((node) => {
      const structuralNode = structuralMap.get(node.id);
      if(node.parent_id && structuralMap.has(node.parent_id)) {
        structuralMap.get(node.parent_id).children.push(structuralNode);
      } else if (!node.parent_id) {
        tree.push(structuralNode);
      }
    })

    return { tree, entities };
  }

  async getNodeById(id: string) {
    return await this.findNodeOrThrow(id);
  }

  async getFolderStructure(depth: number = 3, rootId?: string) {
    const query = `
      WITH RECURSIVE node_tree AS (
        SELECT id, name, is_folder, parent_id, updated_at, 1 AS level
        FROM nodes
        WHERE ($2::uuid IS NULL AND parent_id IS NULL)
           OR id = $2::uuid

        UNION ALL

        SELECT n.id, n.name, n.is_folder, n.parent_id, n.updated_at, nt.level + 1
        FROM nodes n
        INNER JOIN node_tree nt ON n.parent_id = nt.id
        WHERE nt.level < $1
      )
      SELECT * FROM node_tree ORDER BY level, name;
    `;
    const nodes = await this.repository.query(query, [depth, rootId ?? null]);
    return this.normalizeTree(nodes);
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
