import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FolderStructureDto } from "@repo/types"

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
        { depth: number; rootId: string | null }
      >({
        query: ({ depth }) =>
          `/structure?depth=${depth}`,
      }),
    };
  },
});

export const { useGetFolderStructureQuery } = nodesApiSlice;