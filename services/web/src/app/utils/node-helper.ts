import { NodeDto } from "@repo/types";

/**
 * Calculates the total price including tax.
 * 
 * @param entities - The Record of entities with type NodeDTO
 * @param parentId - The `currentId` slice value. If null, it's root folder.
 * @returns An object containing `file` and folder `lists`
 */
export function parseFoldersAndFilesFromParentId(
  entities: Record<string, NodeDto>,
  parentId?: string,
): { folders: NodeDto[]; files: NodeDto[] } {
  parentId = parentId || undefined;
  // Filter entities
  const folders = Object.values(entities).filter((entity) => {
    const isFolder = entity.isFolder;
    const validParentId = entity.parentId == parentId;
    return isFolder && validParentId;
  });

  const files = Object.values(entities).filter((entity) => {
    const isFolder = entity.isFolder;
    const validParentId = entity.parentId == parentId;
    return !isFolder && validParentId;
  });

  return { files, folders };
}