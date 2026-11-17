import { FolderStructureDto } from "@repo/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nodesApiSlice } from "../nodesApi/nodesApiSlice";

interface folderStructureState extends FolderStructureDto {
    currentFolderId: string | null;
}

const initialState: folderStructureState = {
    tree: [],
    entities: {},
    currentFolderId: null,
};

const folderStructureSlice = createSlice({
    name: "folderStructure",
    initialState,
    reducers: {
        openFolder: (state, action: PayloadAction<string>) => {
            state.currentFolderId = action.payload;
        },

        goBack: (state) => {
            if (!state.currentFolderId) {
                return;
            }

            const currentFolder = state.entities[state.currentFolderId];
            state.currentFolderId = currentFolder?.parentId ?? null;
        },
    },

    extraReducers: (builder) => {
        builder.addMatcher(
            nodesApiSlice.endpoints.getFolderStructure.matchFulfilled,
            (state, action) => {
                state.tree = action.payload.tree;
                state.entities = action.payload.entities;
            },
        );
    },

    selectors: {
        getTree: (sliceState) => sliceState.tree,
        getEntities: (sliceState) => sliceState.entities,
        getNode: (sliceState, id: string) => sliceState.entities[id],
        getCurrentFolderId: (sliceState) => sliceState.currentFolderId,
    },
});

export const { openFolder, goBack } = folderStructureSlice.actions;

export const { getTree, getEntities, getNode, getCurrentFolderId } = folderStructureSlice.selectors;

export default folderStructureSlice.reducer;