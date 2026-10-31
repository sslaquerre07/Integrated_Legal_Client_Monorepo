import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FolderStructureDto, NodeDto, BatchActionResult } from "@repo/types";

const API = "http://localhost:3001";

// Based on nodes module
export const nodesApiSlice = createApi({
  reducerPath: "nodesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/nodes`,
  }),
  tagTypes: ["Folder"],
  endpoints: (builder) => {
    return {
      getFolderStructure: builder.query<
        FolderStructureDto,
        { depth: number; rootId?: string }
      >({
        query: ({ depth, rootId }) => ({
          url: `/structure`,
          params: { depth, rootId },
        }),
        providesTags: ["Folder"],
      }),
      getFileContent: builder.query<string, { id: string }>({
        query: ({ id }) => ({
          url: `/file/${id}`,
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
        BatchActionResult<NodeDto>,
        { parentId?: string; files: File[] }
      >({
        query: ({ parentId, files }) => {
          const formData = new FormData();
          // Append parentId field (if it exists)
          if (parentId) formData.append("parentId", parentId);

          // Append each file
          files.forEach((file) => {
            formData.append("files", file);
          });

          return {
            url: "/files",
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
            url: "/folders",
            method: "POST",
            body: { name, parentId },
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
} = nodesApiSlice;
