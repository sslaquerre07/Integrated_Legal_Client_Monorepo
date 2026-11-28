import { screen } from "@testing-library/react";
import { FolderStructureDto, NodeDto } from "@repo/types";
import FileUploadPage from "./page";
import {
  nodesApiSlice,
  useGetFolderStructureQuery,
} from "$src/store/nodesApi/nodesApiSlice";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { makeStore } from "$src/store/store";
import { renderWithProviders } from "$src/test/utils/render";
import { folderStructureArgs } from "$src/utils/node-helper";
import {
  emptyFolderStructure,
  folderStructureMockData,
  rootFileMockData,
  rootFolderMockData,
} from "$src/test/fixtures/node-test-data";
import { messages } from "$src/i18n/messages";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  ...jest.requireActual("$src/store/nodesApi/nodesApiSlice"),
  useGetFolderStructureQuery: jest.fn(),
}));

jest.mock(
  "$src/app/file-upload/components/node-section",
  () =>
    function NodeSectionMock({
      isFolderNodeSection = false,
      nodes,
    }: {
      isFolderNodeSection?: boolean;
      nodes: NodeDto[];
    }) {
      return (
        <section
          data-testid={isFolderNodeSection ? "folder-section" : "file-section"}
        >
          <h2>{isFolderNodeSection ? "Folders" : "Files"}</h2>
          {nodes.map((node) => (
            <span key={node.id}>{node.name}</span>
          ))}
        </section>
      );
    },
);

jest.mock(
  "$src/app/components/horizontal-divider",
  () =>
    function HorizontalDividerMock() {
      return <hr data-testid="section-divider" />;
    },
);

const mockUseGetFolderStructureQuery = useGetFolderStructureQuery as jest.Mock;

async function renderPage({
  folderId = null,
  structure = emptyFolderStructure,
}: { folderId?: string | null; structure?: FolderStructureDto } = {}) {
  const store = makeStore();
  store.dispatch(openFolder(folderId));
  await store.dispatch(
    nodesApiSlice.util.upsertQueryData(
      "getFolderStructure",
      folderStructureArgs(folderId),
      structure,
    ),
  );
  return renderWithProviders(<FileUploadPage />, { store });
}

describe("FileUploadPage", () => {
  beforeEach(() => {
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: false });
  });

  it("shows a loading state while the folder structure is loading", async () => {
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: true });

    await renderPage();

    expect(
      screen.getByText(messages.FileUpload.loadingStatus),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("folder-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-section")).not.toBeInTheDocument();
  });

  it("shows an error state when the folder structure fails to load", async () => {
    mockUseGetFolderStructureQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: {
        status: "bad",
        error: "demo error",
      },
    });

    await renderPage();

    expect(
      screen.getByText(`${messages.FileUpload.errorPrefix} demo error`),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("folder-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-section")).not.toBeInTheDocument();
  });

  it("renders folders and files in separate sections", async () => {
    await renderPage({ structure: folderStructureMockData });

    expect(screen.getByTestId("folder-section")).toHaveTextContent(
      rootFolderMockData.name,
    );
    expect(screen.getByTestId("folder-section")).not.toHaveTextContent(
      rootFileMockData.name,
    );
    expect(screen.getByTestId("file-section")).toHaveTextContent(
      rootFileMockData.name,
    );
    expect(screen.getByTestId("file-section")).not.toHaveTextContent(
      rootFolderMockData.name,
    );
    expect(screen.getByTestId("section-divider")).toBeInTheDocument();
  });

  it("renders empty sections when the folder has no children", async () => {
    await renderPage();

    expect(screen.getByTestId("folder-section")).toHaveTextContent(/^Folders$/);
    expect(screen.getByTestId("file-section")).toHaveTextContent(/^Files$/);
  });
});
