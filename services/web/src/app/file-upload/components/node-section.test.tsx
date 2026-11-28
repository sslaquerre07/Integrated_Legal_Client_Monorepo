import { fireEvent, screen } from "@testing-library/react";
import { makeStore } from "$src/store/store";
import { NodeDto } from "@repo/types";
import {
  rootFileMockData,
  rootFolderMockData,
} from "$src/test/fixtures/node-test-data";
import NodeSection from "./node-section";
import {
  openFolder,
  selectCurrentFolderId,
} from "$src/store/folderNav/folderNavSlice";
import { Typography } from "@mui/material";
import { renderWithProviders } from "$src/test/utils/render";
import { messages } from "$src/i18n/messages";

jest.mock(
  "$src/app/file-upload/components/node-card",
  () =>
    function NodeCardMock({ node }: { node: NodeDto }) {
      return <Typography data-testid="node-card">{node.name}</Typography>;
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

function renderSection(
  nodes: NodeDto[] = [],
  isFolderNodeSection = false,
  store = makeStore(),
) {
  return renderWithProviders(
    <NodeSection isFolderNodeSection={isFolderNodeSection} nodes={nodes} />,
    { store },
  );
}

function makeStoreInsideFolder() {
  const store = makeStore();
  store.dispatch(openFolder(rootFolderMockData.id));
  return store;
}

describe("NodeSection", () => {
  it("renders the correct number of child node cards in each section", () => {
    const { rerender } = renderSection(
      [rootFolderMockData, rootFileMockData],
      true,
    );

    expect(screen.getAllByTestId("node-card")).toHaveLength(2);

    rerender(<NodeSection nodes={[rootFileMockData]} />);

    expect(screen.getAllByTestId("node-card")).toHaveLength(1);
  });

  it("back button works in folder section", () => {
    const { store } = renderSection([], true, makeStoreInsideFolder());
    const backButtonLabel = messages.Components.backButton;

    fireEvent.click(screen.getByRole("button", { name: backButtonLabel }));

    expect(selectCurrentFolderId(store.getState())).toBeFalsy();
    expect(
      screen.queryByRole("button", { name: backButtonLabel }),
    ).not.toBeInTheDocument();
  });
});
