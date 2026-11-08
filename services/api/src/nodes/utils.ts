import { NodeDto } from "@repo/types";
import { ItemNode } from "../entities/node.entity";

export function toNodeDto(entity: ItemNode): NodeDto {
  return <NodeDto>{
    id: entity.id,
    name: entity.name,
    isFolder: entity.isFolder,
    updatedAt: entity.updatedAt.toISOString(),
    parentId: entity.parent?.id,
  };
}
