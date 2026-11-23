import { FolderStructureDto, NodeDto } from "@repo/types";
import { baseApi } from "./baseApi";

const nodesUrl = (path: string) => `nodes/${path}`;

// Based on nodes module
export const nodesApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getFolderStructure: builder.query<
        FolderStructureDto,
        { depth: number; rootId?: string }
      >({
        query: ({ depth, rootId }) => ({
          url: nodesUrl("structure"),
          params: { depth, rootId },
        }),
        providesTags: ["Folder"],
      }),
      getFileContent: builder.query<string, { id: string }>({
        query: ({ id }) => ({
          url: nodesUrl(`file/${id}`),
          responseHandler: async (response: Response) => {
            // Return regular json if anything is wrong
            if (!response.ok) {
              return response.json();
            }
            // Create blob file from response
            const blob = await response.blob();
            // Return URL (pointer) to the blob object in browser memory
            return URL.createObjectURL(blob);
          },
        }),
      }),
      createFile: builder.mutation<
        NodeDto,
        { parentId?: string; file: File }
      >({
        query: ({ parentId, file }) => {
          const formData = new FormData();
          if (parentId) formData.append("parentId", parentId);
          formData.append("file", file);

          return {
            url: nodesUrl("files/new-node"),
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Folder"],
      }),
      createFolder: builder.mutation<
        NodeDto,
        { name: string; parentId?: string }
      >({
        query: ({ name, parentId }) => {
          return {
            url: nodesUrl("folders"),
            method: "POST",
            body: { name, parentId },
          };
        },
        invalidatesTags: ["Folder"],
      }),
      renameNode: builder.mutation<NodeDto, { id: string; name: string }>({
        query: ({ id, name }) => {
          return {
            url: nodesUrl(id),
            method: "PATCH",
            body: { name },
          };
        },
        invalidatesTags: ["Folder"],
      }),
      deleteNode: builder.mutation<void, string>({
        query: (id) => {
          return {
            url: nodesUrl("files"),
            method: "DELETE",
            body: { id },
          };
        },
        invalidatesTags: ["Folder"],
      }),
    };
  },
});

export const {
  useGetFolderStructureQuery,
  useGetFileContentQuery,
  useCreateFileMutation,
  useCreateFolderMutation,
  useRenameNodeMutation,
  useDeleteNodeMutation,
} = nodesApiSlice;
