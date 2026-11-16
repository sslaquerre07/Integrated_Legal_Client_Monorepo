import { NodeDto } from "@repo/types";


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