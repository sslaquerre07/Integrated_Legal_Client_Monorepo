import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NodeDto } from "@repo/types";
import { nodesApiSlice } from "../nodesApi/nodesApiSlice";
import {
  folderStructureArgs,
  parseFoldersAndFilesFromParentId,
} from "$src/utils/node-helper";
import { RootState } from "../store";

// storing just currentId is enough.
// all other data exists in nodesApiSlice
interface FolderNavState {
  currentId: string | null;
}

// NOTE: currentId has a null value only at the root folder
const initialState: FolderNavState = { currentId: null };

const folderNavSlice = createSlice({
  name: "folderNav",
  initialState,
  reducers: {
    openFolder: (state, action: PayloadAction<string | null>) => {
      state.currentId = action.payload;
    },
  },
  selectors: {
    selectCurrentId: (state) => state.currentId,
  },
});

export const { openFolder } = folderNavSlice.actions;
export const { selectCurrentId } = folderNavSlice.selectors;
export default folderNavSlice.reducer;

// a useful selector strategy courtesy of
// https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#selecting-users-data
// it ensures we work with one cache

const EMPTY_RECORD: Record<string, NodeDto> = {};

const selectFolderStructure = (state: RootState) =>
  nodesApiSlice.endpoints.getFolderStructure.select(
    folderStructureArgs(selectCurrentId(state)),
  )(state);

// Only export a subset of the selectors - ones needed outside this file

export const selectEntities = createSelector(
  selectFolderStructure,
  (folderStructure) => {
    if (folderStructure.data == null) {
      return EMPTY_RECORD;
    } else {
      return folderStructure.data!.entities;
    }
  },
);

export const selectCurrentNode = createSelector(
  [selectEntities, selectCurrentId],
  (entities, id) => (id ? entities[id] : undefined),
);

export const selectBackId = createSelector(
  selectCurrentNode,
  (currentNode) => currentNode?.parentId ?? null,
);

export const selectFilesAndFolders = createSelector(
  [selectEntities, selectCurrentId],
  (entities, id) => {
    return parseFoldersAndFilesFromParentId(entities, id ?? undefined);
  },
);
