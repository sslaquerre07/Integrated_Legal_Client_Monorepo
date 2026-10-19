import { baseApi as api } from "./baseApi";
export const addTagTypes = ["Nodes"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      nodesControllerGetFolderStructure: build.query<
        NodesControllerGetFolderStructureApiResponse,
        NodesControllerGetFolderStructureApiArg
      >({
        query: (queryArg) => ({
          url: `/nodes/structure`,
          params: {
            depth: queryArg.depth,
            rootId: queryArg.rootId,
          },
        }),
        providesTags: ["Nodes"],
      }),
      nodesControllerGetFileContent: build.query<
        NodesControllerGetFileContentApiResponse,
        NodesControllerGetFileContentApiArg
      >({
        query: (queryArg) => ({ url: `/nodes/file/${queryArg.id}` }),
        providesTags: ["Nodes"],
      }),
      nodesControllerCreateFile: build.mutation<
        NodesControllerCreateFileApiResponse,
        NodesControllerCreateFileApiArg
      >({
        query: (queryArg) => ({
          url: `/nodes/files`,
          method: "POST",
          body: queryArg.uploadFilesDto,
        }),
        invalidatesTags: ["Nodes"],
      }),
      nodesControllerCreateFolder: build.mutation<
        NodesControllerCreateFolderApiResponse,
        NodesControllerCreateFolderApiArg
      >({
        query: (queryArg) => ({
          url: `/nodes/folders`,
          method: "POST",
          body: queryArg.createFolderDto,
        }),
        invalidatesTags: ["Nodes"],
      }),
      nodesControllerUpdateNode: build.mutation<
        NodesControllerUpdateNodeApiResponse,
        NodesControllerUpdateNodeApiArg
      >({
        query: (queryArg) => ({
          url: `/nodes/${queryArg.id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Nodes"],
      }),
      nodesControllerDeleteNodes: build.mutation<
        NodesControllerDeleteNodesApiResponse,
        NodesControllerDeleteNodesApiArg
      >({
        query: (queryArg) => ({
          url: `/nodes`,
          method: "DELETE",
          body: queryArg.deleteNodesDto,
        }),
        invalidatesTags: ["Nodes"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as nodesApi };
export type NodesControllerGetFolderStructureApiResponse =
  /** status 200  */ FolderStructureDto;
export type NodesControllerGetFolderStructureApiArg = {
  /** Maximum number of tree levels to return, starting at the root. */
  depth: number;
  /** Optional node ID to use as the root of the returned structure. */
  rootId?: string;
};
export type NodesControllerGetFileContentApiResponse = unknown;
export type NodesControllerGetFileContentApiArg = {
  /** UUID of the file node to retrieve. */
  id: string;
};
export type NodesControllerCreateFileApiResponse =
  /** status 201  */ UploadFilesResultDto;
export type NodesControllerCreateFileApiArg = {
  uploadFilesDto: UploadFilesDto;
};
export type NodesControllerCreateFolderApiResponse =
  /** status 201  */ ResponseNodeDto;
export type NodesControllerCreateFolderApiArg = {
  createFolderDto: CreateFolderDto;
};
export type NodesControllerUpdateNodeApiResponse =
  /** status 200  */ ResponseNodeDto;
export type NodesControllerUpdateNodeApiArg = {
  /** UUID of the node to update. */
  id: string;
};
export type NodesControllerDeleteNodesApiResponse =
  /** status 200  */ DeleteNodesResultDto;
export type NodesControllerDeleteNodesApiArg = {
  deleteNodesDto: DeleteNodesDto;
};
export type ResponseNodeDto = {
  id: string;
  name: string;
  isFolder: boolean;
  updatedAt: string;
  parentId?: string;
};
export type FolderTreeItemDto = {
  /** UUID of the node. */
  id: string;
  /** Child nodes. Empty when there are none or the depth limit was reached. */
  children: FolderTreeItemDto[];
};
export type FolderStructureDto = {
  /** Details of every node in `tree`, keyed by ID. */
  entities: {
    [key: string]: ResponseNodeDto;
  };
  /** The hierarchy, as IDs only. */
  tree: FolderTreeItemDto[];
};
export type BatchFailureDto = {
  /** The step that failed. */
  stage: "database" | "storage";
  /** What went wrong. */
  message: string;
};
export type UploadFilesResultDto = {
  /** Nodes created for the files that uploaded. */
  succeeded: ResponseNodeDto[];
  /** Files that failed, with the reason. */
  failed: BatchFailureDto[];
};
export type UploadFilesDto = {
  /** Files to upload, 10 MB max each. */
  files: Blob[];
  parentId?: string;
};
export type CreateFolderDto = {
  /** stuff */
  name: string;
  /** stuff */
  parentId?: string;
};
export type DeletedNodeDto = {
  /** UUID of the deleted node. */
  id: string;
};
export type DeleteNodesResultDto = {
  /** Nodes that were deleted. */
  succeeded: DeletedNodeDto[];
  /** Nodes that couldn't be deleted, with the reason. */
  failed: BatchFailureDto[];
};
export type DeleteNodesDto = {
  /** UUIDs of the files or empty folders to delete. */
  ids: string[];
};
export const {
  useNodesControllerGetFolderStructureQuery,
  useNodesControllerGetFileContentQuery,
  useNodesControllerCreateFileMutation,
  useNodesControllerCreateFolderMutation,
  useNodesControllerUpdateNodeMutation,
  useNodesControllerDeleteNodesMutation,
} = injectedRtkApi;
