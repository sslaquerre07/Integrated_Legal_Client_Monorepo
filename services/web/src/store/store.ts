import { configureStore } from "@reduxjs/toolkit";
import currentIdReducer from "./currentId/currentIdSlice";
import { nodesApiSlice } from "./nodesApi/nodesApiSlice";

export const store = configureStore({
  reducer: {
    currentId: currentIdReducer,
    [nodesApiSlice.reducerPath]: nodesApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(nodesApiSlice.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
