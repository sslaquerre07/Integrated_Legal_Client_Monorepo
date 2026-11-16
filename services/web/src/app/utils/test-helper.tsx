import { makeStore } from "@/store/store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

/**
 * Renders a React node with a fresh Redux store provider for component tests.
 *
 * @param ui - The React node to render.
 * @returns The Testing Library render result for the provider-wrapped node.
 */
export function renderWithProvider(ui: React.ReactNode) {
  const uiWithStore = <Provider store={makeStore()}>{ui}</Provider>;
  return render(uiWithStore);
}
