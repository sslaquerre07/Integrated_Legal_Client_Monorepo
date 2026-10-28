export interface Entity {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
  updatedAt: string;
}
