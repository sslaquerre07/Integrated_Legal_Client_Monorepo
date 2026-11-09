import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentIdState {
  current_id: string;
}

const initialState: CurrentIdState = {
  current_id: "",
};

const currentIdSlice = createSlice({
  name: "currentId",
  initialState,
  reducers: {
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.current_id = action.payload;
    },
  },
});

export const { setCurrentId } = currentIdSlice.actions;

export default currentIdSlice.reducer;