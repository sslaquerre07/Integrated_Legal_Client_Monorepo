import { createSelector } from "@reduxjs/toolkit";

import { nodesApiSlice } from "../nodesApi/nodesApiSlice";
import {
  folderStructureArgs,
  parseFoldersAndFilesFromParentId,
} from "$src/utils/node-helper";
import { RootState } from "../store";
import { selectCurrentFolderId } from "./folderNavSlice";

// Below is a useful selector strategy courtesy of
// https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#selecting-users-data
// This ensures we work with one cache

const selectFolderStructure = createSelector(
  [selectCurrentFolderId, (state: RootState) => state],
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
  [selectEntities, selectCurrentFolderId],
  (entities, id) => (id ? entities[id] : undefined),
);

export const selectBackId = createSelector(
  selectCurrentNode,
  (currentNode) => currentNode?.parentId ?? null,
);

export const selectFilesAndFolders = createSelector(
  [selectEntities, selectCurrentFolderId],
  (entities, id) => {
    return parseFoldersAndFilesFromParentId(entities, id ?? undefined);
  },
);
