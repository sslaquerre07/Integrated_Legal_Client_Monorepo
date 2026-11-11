import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface nodeHistoryState {
  history: Array<currentNodeState>;
}

interface currentNodeState {
  id: string;
  name: string;
  parentId: string;
}

const initialNodeState: currentNodeState = {
  id: "",
  name: "",
  parentId: "",
};

const initialState: nodeHistoryState = {
  history: [initialNodeState],
};

const nodeHistorySlice = createSlice({
  name: "nodeHistory",
  initialState,
  reducers: {
    pushCurrentNodeToHistory: (
      state,
      action: PayloadAction<currentNodeState>,
    ) => {
      // Push the new node to the stack
      state.history.push(action.payload);
    },

    popCurrentNodeFromHistory: (state) => {
      state.history.pop();
    },
  },

  selectors: {
    getCurrentNode: (sliceState) => sliceState.history.at(-1),
  },
});

export const {pushCurrentNodeToHistory, popCurrentNodeFromHistory} =
  nodeHistorySlice.actions;

export const {getCurrentNode} = nodeHistorySlice.selectors;

export default nodeHistorySlice.reducer;
