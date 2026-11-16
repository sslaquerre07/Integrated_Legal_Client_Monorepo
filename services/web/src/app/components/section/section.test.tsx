import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { makeStore } from "$src/store/store";
import {
  getCurrentNode,
  pushCurrentNodeToHistory,
} from "$src/store/nodeHistory/nodeHistorySlice";
import { NodeDto } from "@repo/types";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/app/constants/test-data/node-test-data";
import Section from "./section";

// Mock child components so these tests focus on Section's layout and navigation
// decisions rather than duplicating the children’s own behavior tests.
jest.mock(
  "$src/app/components/card/item-card",
  () =>
    function ItemCardMock({ node }: { node: NodeDto }) {
      return <div data-testid="item-card">{node.name}</div>;
    },
);

jest.mock(
  "$src/app/components/modal/create-folder-modal",
  () =>
    function CreateFolderModalMock() {
      return <button type="button">Create Folder</button>;
    },
);

jest.mock(
  "$src/app/components/modal/create-file-modal",
  () =>
    function CreateFileModalMock() {
      return <button type="button">Create File</button>;
    },
);

function renderSection(
  nodes: NodeDto[] = [],
  isFolderSection = false,
) {
  const store = makeStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <Section isFolderSection={isFolderSection} nodes={nodes} />
      </Provider>,
    ),
  };
}

describe("Section", () => {
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

  it("renders one item card for every node", () => {
    renderSection([folderCardMockData, fileCardMockData]);

    expect(screen.getAllByTestId("item-card")).toHaveLength(2);
    expect(screen.getByText(folderCardMockData.name)).toBeInTheDocument();
    expect(screen.getByText(fileCardMockData.name)).toBeInTheDocument();
  });

  it("renders no item cards when the node list is empty", () => {
    renderSection();

    expect(screen.queryByTestId("item-card")).not.toBeInTheDocument();
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
        <Section nodes={[]} />
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

  it("pops the current folder from history when back is clicked", () => {
    const store = makeStore();
    store.dispatch(
      pushCurrentNodeToHistory({
        id: folderCardMockData.id,
        name: folderCardMockData.name,
        parentId: "",
      }),
    );

    render(
      <Provider store={store}>
        <Section isFolderSection nodes={[]} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(getCurrentNode(store.getState())).toEqual({
      id: "",
      name: "",
      parentId: "",
    });
  });
});