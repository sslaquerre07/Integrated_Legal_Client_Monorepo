import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { nodesApiSlice } from "../nodesApi/nodesApiSlice";
import {
  folderStructureArgs,
  parseFoldersAndFilesFromParentId,
} from "$src/utils/node-helper";
import { RootState } from "../store";

// Storing just currentFolderId is enough.
// All other data exists in nodesApiSlice.
interface FolderNavState {
  currentFolderId: string | null;
}

// NOTE: currentFolderId has a null value only at the root folder
const initialState: FolderNavState = { currentFolderId: null };

const folderNavSlice = createSlice({
  name: "folderNav",
  initialState,
  reducers: {
    openFolder: (state, action: PayloadAction<string | null>) => {
      state.currentFolderId = action.payload;
    },
  },
  selectors: {
    selectcurrentFolderId: (state) => state.currentFolderId,
  },
});

export const { openFolder } = folderNavSlice.actions;
export const { selectcurrentFolderId } = folderNavSlice.selectors;
export default folderNavSlice.reducer;

// a useful selector strategy courtesy of
// https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#selecting-users-data
// it ensures we work with one cache

const selectFolderStructure = createSelector(
  [selectcurrentFolderId, (state: RootState) => state],
  (currentFolderId, state) => {
    const args = folderStructureArgs(currentFolderId);
    return nodesApiSlice.endpoints.getFolderStructure.select(args)(state);
  },
);

// Only export a subset of the selectors - ones needed outside this file

export const selectEntities = createSelector(
  selectFolderStructure,
  (folderStructure) => {
    if (folderStructure.data == null) {
      return {};
    } else {
      return folderStructure.data.entities;
    }
  },
);

export const selectCurrentNode = createSelector(
  [selectEntities, selectcurrentFolderId],
  (entities, id) => (id ? entities[id] : undefined),
);

export const selectBackId = createSelector(
  selectCurrentNode,
  (currentNode) => currentNode?.parentId ?? null,
);

export const selectFilesAndFolders = createSelector(
  [selectEntities, selectcurrentFolderId],
  (entities, id) => {
    return parseFoldersAndFilesFromParentId(entities, id ?? undefined);
  },
);
