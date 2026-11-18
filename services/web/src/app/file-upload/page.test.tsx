import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { NodeDto } from "@repo/types";
import FileUploadPage from "./page";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import {
  getCurrentFolderId,
  getEntities,
} from "$src/store/folderStructureSlice/FolderStructureSlice";
import { parseFoldersAndFilesFromParentId } from "$src/utils/node-helper";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/app/constants/test-data/node-test-data";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useGetFolderStructureQuery: jest.fn(),
}));

jest.mock("$src/store/folderStructureSlice/FolderStructureSlice", () => ({
  getCurrentFolderId: jest.fn(),
  getEntities: jest.fn(),
}));

jest.mock("$src/utils/node-helper", () => ({
  parseFoldersAndFilesFromParentId: jest.fn(),
}));

jest.mock(
  "$src/app/components/section/node-section",
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
  "$src/app/components/divider/horizontal-divider",
  () =>
    function HorizontalDividerMock() {
      return <hr data-testid="section-divider" />;
    },
);

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseGetFolderStructureQuery = useGetFolderStructureQuery as jest.Mock;
const mockParseFoldersAndFiles = parseFoldersAndFilesFromParentId as jest.Mock;

const mockEntities = {
  [folderCardMockData.id]: folderCardMockData,
  [fileCardMockData.id]: fileCardMockData,
};

function mockSelectors(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) => {
    if (selector === getCurrentFolderId) return currentFolderId;
    if (selector === getEntities) return mockEntities;
    return undefined;
  });
}

describe("FileUploadPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectors(null);
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: false });
    mockParseFoldersAndFiles.mockReturnValue({
      folders: [folderCardMockData],
      files: [fileCardMockData],
    });
  });

  it("shows a loading state while the folder structure is loading", () => {
    mockUseGetFolderStructureQuery.mockReturnValue({ isLoading: true });

    render(<FileUploadPage />);

    expect(screen.getByText("Loading..")).toBeInTheDocument();
    expect(screen.queryByTestId("folder-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-section")).not.toBeInTheDocument();
    expect(mockParseFoldersAndFiles).not.toHaveBeenCalled();
  });

  it("requests the root folder structure at depth two", () => {
    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith(
      { rootId: undefined, depth: 2 },
      { refetchOnMountOrArgChange: true },
    );
  });

  it("parses root nodes from the store entities", () => {
    render(<FileUploadPage />);

    expect(mockParseFoldersAndFiles).toHaveBeenCalledWith(
      mockEntities,
      undefined,
    );
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

  it("requests and parses children for the selected folder", () => {
    mockSelectors(folderCardMockData.id);

    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith(
      { rootId: folderCardMockData.id, depth: 2 },
      { refetchOnMountOrArgChange: true },
    );
    expect(mockParseFoldersAndFiles).toHaveBeenCalledWith(
      mockEntities,
      folderCardMockData.id,
    );
  });

  it("renders empty sections when the folder has no children", () => {
    mockParseFoldersAndFiles.mockReturnValue({ folders: [], files: [] });

    render(<FileUploadPage />);

    expect(screen.getByTestId("folder-section")).toHaveTextContent(/^Folders$/);
    expect(screen.getByTestId("file-section")).toHaveTextContent(/^Files$/);
  });
});