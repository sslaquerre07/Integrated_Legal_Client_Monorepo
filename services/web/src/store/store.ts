import {configureStore} from "@reduxjs/toolkit";
import nodeHistoryReducer from "./nodeHistory/nodeHistorySlice";
import {nodesApiSlice} from "./nodesApi/nodesApiSlice";

/**
 * Creates a Redux store with the node history and nodes API reducers.
 *
 * A new store is created on each call, which keeps state isolated between
 * tests and the main app.
 *
 * @returns A configured Redux store instance.
 */
export const makeStore = () => {
  return configureStore({
  reducer: {
    nodeHistory: nodeHistoryReducer,
    [nodesApiSlice.reducerPath]: nodesApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(nodesApiSlice.middleware);
  },
});
}

// Create store that this app will use
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
