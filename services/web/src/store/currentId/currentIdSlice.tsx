import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentIdState {
  value: string;
}

const initialState: CurrentIdState = {
  value: "",
};

const currentIdSlice = createSlice({
  name: "currentId",
  initialState,
  reducers: {
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentId,  } = currentIdSlice.actions;

export default currentIdSlice.reducer;