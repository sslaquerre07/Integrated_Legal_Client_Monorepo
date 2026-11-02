import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice/userSlice";
import lawyerFileReducer from "./lawyerFile/laywerFileSlice";
import { nodesApiSlice } from "./nodesApi/nodesApiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    lawyerFile: lawyerFileReducer,
    [nodesApiSlice.reducerPath]: nodesApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(nodesApiSlice.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
