import { configureStore } from "@reduxjs/toolkit";
import { nodesApiSlice } from "./nodesApi/nodesApiSlice";
import folderNavReducer from "./folderNav/folderNavSlice";

export const makeStore = () =>
  configureStore({
  reducer: {
    folderNav: folderNavReducer,
    [nodesApiSlice.reducerPath]: nodesApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(nodesApiSlice.middleware);
  },
});


// Create store that this app will use
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
