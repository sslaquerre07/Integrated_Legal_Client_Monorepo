import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "$src/store/store";

type Options = { store?: ReturnType<typeof makeStore> };

export function renderWithProviders(
  ui: ReactElement,
  { store = makeStore() }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}