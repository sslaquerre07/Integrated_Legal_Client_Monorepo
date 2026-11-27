import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "$src/store/store";
import { NodeDto } from "@repo/types";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/test/fixtures/node-test-data";
import NodeSection from "./node-section";
import {
  openFolder,
  selectCurrentFolderId,
} from "$src/store/folderNav/folderNavSlice";
import { Stack } from "@mui/material";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => {
  global.fetch = jest.fn() as unknown as typeof fetch;
  return jest.requireActual("$src/store/nodesApi/nodesApiSlice");
});

jest.mock(
  "$src/app/file-upload/components/node-card",
  () =>
    function NodeCardMock({ node }: { node: NodeDto }) {
      return <Stack data-testid="node-card">{node.name}</Stack>;
    },
);

jest.mock(
  "$src/app/file-upload/components/create-folder-form",
  () =>
    function CreateFolderFormMock() {
      return <button type="button">Create Folder</button>;
    },
);

jest.mock(
  "$src/app/file-upload/components/create-file-form",
  () =>
    function CreateFileFormMock() {
      return <button type="button">Create File</button>;
    },
);

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

function renderSection(
  nodes: NodeDto[] = [],
  isFolderNodeSection = false,
  store = makeStore(),
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <NodeSection isFolderNodeSection={isFolderNodeSection} nodes={nodes} />
      </Provider>,
    ),
  };
}

function makeStoreInsideFolder() {
  const store = makeStore();
  store.dispatch(openFolder(folderCardMockData.id));
  return store;
}

describe("NodeSection", () => {
  beforeEach(() => mockPush.mockClear());
  it("renders the correct number of child node cards in each section", () => {
    const { rerender, store } = renderSection(
      [folderCardMockData, fileCardMockData],
      true,
    );

    expect(screen.getAllByTestId("node-card")).toHaveLength(2);

    rerender(
      <Provider store={store}>
        <NodeSection nodes={[fileCardMockData]} />
      </Provider>,
    );

    expect(screen.getAllByTestId("node-card")).toHaveLength(1);
  });

  it("back button works in folder section", () => {
    const { store } = renderSection([], true, makeStoreInsideFolder());

    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(selectCurrentFolderId(store.getState())).toBeFalsy();
    expect(
      screen.queryByRole("button", { name: "back" }),
    ).not.toBeInTheDocument();
  });
});
