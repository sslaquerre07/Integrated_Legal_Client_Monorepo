# Redux Store

This frontend uses Redux Toolkit to manage shared UI state and keep application data predictable across components.

## Current store structure

### Root-level files

These live at the store root and represent app-wide Redux setup:

- `store.ts`: creates the root Redux store and combines all slices
- `storeProvider.tsx`: wraps the app in the Redux `Provider`
- `README.md`: developer documentation for the store structure and usage

### Slice files

Each slice folder contains the state and reducer logic for one domain of the application.

Current slices:

- `userSlice/`
  - Purpose: Example Slice for repo setup

## What each slice should include

A slice should encapsulate the state and behaviors for one clear domain. In practice, that usually means:

- local state shape
- reducer logic
- action creators
- selectors used by components
- typing for that domain

## Redux DevTools

Install the Redux DevTools browser extension (useful for development):

- Redux DevTools Extension: https://github.com/reduxjs/redux-devtools
- Chrome: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/

### Useful references

- Redux Toolkit: https://redux-toolkit.js.org/
- Redux: https://redux.js.org/
- Redux DevTools: https://redux.js.org/usage/configuring-your-store#using-the-redux-devtools-extension
