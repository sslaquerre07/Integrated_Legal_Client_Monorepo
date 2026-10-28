import { Entity } from "$src/app/constants/types/entity";
import { TreeNode } from "$src/app/constants/types/tree-node";

export interface FileData {
  tree: TreeNode[];
  entities: Record<string, Entity>;
}
