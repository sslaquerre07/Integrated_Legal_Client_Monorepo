import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
    selectCurrentFolderId: (state) => state.currentFolderId,
  },
});

export const { openFolder } = folderNavSlice.actions;
export const { selectCurrentFolderId } = folderNavSlice.selectors;
export default folderNavSlice.reducer;
