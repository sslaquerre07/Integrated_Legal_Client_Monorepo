import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FolderStructureDto } from "@repo/types";

const API = "http://localhost:3001";

// Based on nodes module
export const nodesApiSlice = createApi({
  reducerPath: "nodesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/nodes`,
  }),
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
    };
  },
});

export const { useGetFolderStructureQuery, useGetFileContentQuery } =
  nodesApiSlice;
