import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { NodeDto } from "@repo/types";
import FileUploadPage from "./page";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/app/constants/test-data/node-test-data";
import {
  selectCurrentId,
  selectFilesAndFolders,
} from "$src/store/folderNav/folderNavSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
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

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseGetFolderStructureQuery = useGetFolderStructureQuery as jest.Mock;

const mockFilesAndFolders = {
  folders: [folderCardMockData],
  files: [fileCardMockData],
};

function mockSelectors(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) => {
    if (selector === selectCurrentId) return currentFolderId;
    if (selector === selectFilesAndFolders) return mockFilesAndFolders;
    return undefined;
  });
}

describe("FileUploadPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectors(null);
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: false });
  });

  it("shows a loading state while the folder structure is loading", () => {
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: true });

    render(<FileUploadPage />);

    expect(screen.getByText("Loading..")).toBeInTheDocument();
    expect(screen.queryByTestId("folder-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-section")).not.toBeInTheDocument();
  });

  it("requests the root folder structure at depth two", () => {
    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith(
      { rootId: undefined, depth: 2 },
      { refetchOnMountOrArgChange: true },
    );
  });

  it("reads root nodes from the folder navigation slice", () => {
    render(<FileUploadPage />);

    expect(mockUseSelector).toHaveBeenCalledWith(selectCurrentId);
    expect(mockUseSelector).toHaveBeenCalledWith(selectFilesAndFolders);
  });

  it("renders folders and files in separate sections", () => {
    render(<FileUploadPage />);

    expect(screen.getByTestId("folder-section")).toHaveTextContent(
      folderCardMockData.name,
    );
    expect(screen.getByTestId("folder-section")).not.toHaveTextContent(
      fileCardMockData.name,
    );
    expect(screen.getByTestId("file-section")).toHaveTextContent(
      fileCardMockData.name,
    );
    expect(screen.getByTestId("file-section")).not.toHaveTextContent(
      folderCardMockData.name,
    );
    expect(screen.getByTestId("section-divider")).toBeInTheDocument();
  });

  it("requests children for the selected folder", () => {
    mockSelectors(folderCardMockData.id);

    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith(
      { rootId: folderCardMockData.id, depth: 2 },
      { refetchOnMountOrArgChange: true },
    );
    expect(mockUseSelector).toHaveBeenCalledWith(selectCurrentId);
    expect(mockUseSelector).toHaveBeenCalledWith(selectFilesAndFolders);
  });

  it("renders empty sections when the folder has no children", () => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector === selectCurrentId) return null;
      if (selector === selectFilesAndFolders) {
        return { folders: [], files: [] };
      }
      return undefined;
    });

    render(<FileUploadPage />);

    expect(screen.getByTestId("folder-section")).toHaveTextContent(/^Folders$/);
    expect(screen.getByTestId("file-section")).toHaveTextContent(/^Files$/);
  });
});
