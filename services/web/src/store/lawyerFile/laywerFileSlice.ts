// State

import { createSlice } from "@reduxjs/toolkit";
import { StatementSync } from "node:sqlite";

interface LaywerFileState {
  name: string;
  type: "draft" | "document";
  status: "approved" | "pending";
  date_uploaded: string;
  date_modified: string;
}

// Initial State

const initialState: LaywerFileState = {
  name: "File",
  type: "draft",
  status: "pending",
  date_uploaded: "10/15/2026",
  date_modified: "10/15/2026",
};

// Reducers
const lawyerFileSlice = createSlice({
  name: "lawyerFile",
  initialState: initialState,
  reducers: {
    rename: (state) => {
      let curr = state.name;
      if (curr == initialState.name) {
        state.name = "File Name Alternative";
      } else {
        state.name = initialState.name;
      }
    },
  },
});

export const { rename } = lawyerFileSlice.actions;

export default lawyerFileSlice.reducer;
