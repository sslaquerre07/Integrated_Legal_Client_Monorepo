export interface TreeNodeDto {
  id: string;
  children: object[];
}

export interface CreateNodeDto {
  name: string;
  isFolder: boolean;
  parentId?: string;
}

export interface NodeDto {
  id: string;
  name: string;
  isFolder: boolean;
  updatedAt: string;
  parentId?: string;
}

export interface FolderStructureDto {
  tree: TreeNodeDto[];
  entities: Record<string, NodeDto>;
};