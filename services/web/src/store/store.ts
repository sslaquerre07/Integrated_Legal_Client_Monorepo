import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./nodesApi/baseApi";
import folderNavReducer from "./folderNav/folderNavSlice";

export const makeStore = () =>
  configureStore({
  reducer: {
    folderNav: folderNavReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(baseApi.middleware);
  },
});


// Create store that this app will use
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
