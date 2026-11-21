import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { makeStore } from "$src/store/store";
import { NodeDto } from "@repo/types";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/app/constants/test-data/node-test-data";
import NodeSection from "./node-section";
import {
  openFolder,
  selectCurrentFolderId
} from "$src/store/folderNav/folderNavSlice";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => {
  global.fetch = jest.fn() as unknown as typeof fetch;
  return jest.requireActual("$src/store/nodesApi/nodesApiSlice");
});

jest.mock(
  "$src/app/file-upload/components/node-card",
  () =>
    function NodeCardMock({ node }: { node: NodeDto }) {
      return <div data-testid="node-card">{node.name}</div>;
    },
);

jest.mock(
  "$src/app/file-upload/components/create-folder-modal",
  () =>
    function CreateFolderModalMock() {
      return <button type="button">Create Folder</button>;
    },
);

jest.mock(
  "$src/app/file-upload/components/create-file-modal",
  () =>
    function CreateFileModalMock() {
      return <button type="button">Create File</button>;
    },
);

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
  it("renders the Files heading by default", () => {
    renderSection([fileCardMockData]);

    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.queryByText("Folders")).not.toBeInTheDocument();
  });

  it("renders the Folders heading for a folder section", () => {
    renderSection([folderCardMockData], true);

    expect(screen.getByText("Folders")).toBeInTheDocument();
    expect(screen.queryByText("Files")).not.toBeInTheDocument();
  });

  it("renders one node card for every node", () => {
    renderSection([folderCardMockData, fileCardMockData]);

    expect(screen.getAllByTestId("node-card")).toHaveLength(2);
    expect(screen.getByText(folderCardMockData.name)).toBeInTheDocument();
    expect(screen.getByText(fileCardMockData.name)).toBeInTheDocument();
  });

  it("renders no node cards when the node list is empty", () => {
    renderSection();

    expect(screen.queryByTestId("node-card")).not.toBeInTheDocument();
  });

  it("shows create controls only for folder sections", () => {
    const { rerender } = renderSection([], true);

    expect(
      screen.getByRole("button", { name: "Create Folder" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create File" }),
    ).toBeInTheDocument();

    rerender(
      <Provider store={makeStore()}>
        <NodeSection nodes={[]} />
      </Provider>,
    );

    expect(
      screen.queryByRole("button", { name: "Create Folder" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create File" }),
    ).not.toBeInTheDocument();
  });

  it("hides the back button at the root folder", () => {
    renderSection([], true);

    expect(
      screen.queryByRole("button", { name: "back" }),
    ).not.toBeInTheDocument();
  });

  it("shows the back button inside a folder", () => {
    renderSection([], true, makeStoreInsideFolder());

    expect(screen.getByRole("button", { name: "back" })).toBeInTheDocument();
  });

  it("never shows the back button in the files section", () => {
    renderSection([], false, makeStoreInsideFolder());

    expect(
      screen.queryByRole("button", { name: "back" }),
    ).not.toBeInTheDocument();
  });

  it("returns to the parent folder when back is clicked", () => {
    const { store } = renderSection([], true, makeStoreInsideFolder());

    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(selectCurrentFolderId(store.getState())).toBeFalsy();
    expect(
      screen.queryByRole("button", { name: "back" }),
    ).not.toBeInTheDocument();
  });
});
