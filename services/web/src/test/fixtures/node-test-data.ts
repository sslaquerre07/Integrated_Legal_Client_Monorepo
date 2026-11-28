import { FolderStructureDto, NodeDto } from "@repo/types";

export const fileCardMockData: NodeDto = {
  id: "test-id",
  isFolder: false,
  name: "Test File",
  updatedAt: "2026-11-16T15:56:19Z",
};

export const folderCardMockData: NodeDto = {
  id: "folder-id",
  isFolder: true,
  name: "Test Folder",
  updatedAt: "2026-11-16T15:56:19Z",
};

export const rootFolderMockData: NodeDto = {
  id: "folder-id",
  isFolder: true,
  name: "Documents",
  updatedAt: "2026-11-16T15:56:19Z",
};

export const rootFileMockData: NodeDto = {
  id: "file-id",
  isFolder: false,
  name: "readme.pdf",
  updatedAt: "2026-11-16T15:56:19Z",
};

export const childFolderMockData: NodeDto = {
  id: "child-folder-id",
  isFolder: true,
  name: "Contracts",
  parentId: rootFolderMockData.id,
  updatedAt: "2026-11-16T15:56:19Z",
};

export const childFileMockData: NodeDto = {
  id: "child-file-id",
  isFolder: false,
  name: "contract.pdf",
  parentId: rootFolderMockData.id,
  updatedAt: "2026-11-16T15:56:19Z",
};

export const unrelatedFileMockData: NodeDto = {
  id: "unrelated-file-id",
  isFolder: false,
  name: "unrelated.pdf",
  parentId: "another-folder-id",
  updatedAt: "2026-11-16T15:56:19Z",
};
export const otherFolderMockData: NodeDto = {
  id: "another-folder-id",
  isFolder: true,
  name: "Archive",
  updatedAt: "2026-11-16T15:56:19Z",
};

export const folderStructureMockData: FolderStructureDto = {
  tree: [
    {
      id: rootFolderMockData.id,
      children: [
        { id: childFolderMockData.id, children: [] },
        { id: childFileMockData.id, children: [] },
      ],
    },
    { id: rootFileMockData.id, children: [] },
    {
      id: otherFolderMockData.id,
      children: [{ id: unrelatedFileMockData.id, children: [] }],
    },
  ],
  entities: {
    [rootFolderMockData.id]: rootFolderMockData,
    [rootFileMockData.id]: rootFileMockData,
    [childFolderMockData.id]: childFolderMockData,
    [childFileMockData.id]: childFileMockData,
    [otherFolderMockData.id]: otherFolderMockData,
    [unrelatedFileMockData.id]: unrelatedFileMockData,
  },
};

export const emptyFolderStructure: FolderStructureDto = {
  tree: [],
  entities: {},
};
