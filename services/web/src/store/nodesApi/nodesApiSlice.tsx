import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API = "http://localhost:3001";

interface Folder {
  id: string;
  children: object[];
}

interface Entity {
  id: string;
  name: string;
  isFolder: boolean;
  updatedAt: string;
  parentId?: string;
}

type FolderStructure = {
  tree: Folder[];
  entities: {
    [id: string]: Entity;
  };
};

// Based on nodes module
export const nodesApiSlice = createApi({
  reducerPath: "nodesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/nodes`,
  }),
  endpoints: (builder) => {
    return {
      getFolderStructure: builder.query<
        FolderStructure,
        { depth: number; rootId: string | null }
      >({
        query: ({ depth }) =>
          `/structure?depth=${depth}`,
      }),
    };
  },
});

export const { useGetFolderStructureQuery } = nodesApiSlice;