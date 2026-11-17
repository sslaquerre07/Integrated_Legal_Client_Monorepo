import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { NodeDto } from "@repo/types";
import FileUploadPage from "./page";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import {
  folderStructureMockData,
  rootFolderMockData,
} from "$src/app/constants/test-data/node-test-data";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useGetFolderStructureQuery: jest.fn(),
}));

jest.mock(
  "$src/app/components/section/section",
  () =>
    function SectionMock({
      isFolderSection = false,
      nodes,
    }: {
      isFolderSection?: boolean;
      nodes: NodeDto[];
    }) {
      return (
        <section
          data-testid={isFolderSection ? "folder-section" : "file-section"}
        >
          <h2>{isFolderSection ? "Folders" : "Files"}</h2>
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
const mockUseGetFolderStructureQuery =
  useGetFolderStructureQuery as jest.Mock;

describe("FileUploadPage", () => {
  beforeEach(() => {
    mockUseSelector.mockReturnValue(undefined);
    mockUseGetFolderStructureQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
  });

  it("shows a loading state while the folder structure is loading", () => {
    render(<FileUploadPage />);

    expect(screen.getByText("Loading..")).toBeInTheDocument();
    expect(screen.queryByTestId("folder-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-section")).not.toBeInTheDocument();
  });

  it("shows a loading state when the query has no data", () => {
    mockUseGetFolderStructureQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<FileUploadPage />);

    expect(screen.getByText("Loading..")).toBeInTheDocument();
  });

  it("requests the root folder structure at depth two", () => {
    mockUseGetFolderStructureQuery.mockReturnValue({
      data: folderStructureMockData,
      isLoading: false,
    });

    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith({
      rootId: undefined,
      depth: 2,
    });
  });

  it("renders root folders and files in separate sections", () => {
    mockUseGetFolderStructureQuery.mockReturnValue({
      data: folderStructureMockData,
      isLoading: false,
    });

    render(<FileUploadPage />);

    expect(screen.getByTestId("folder-section")).toHaveTextContent(
      "FoldersDocuments",
    );
    expect(screen.getByTestId("file-section")).toHaveTextContent(
      "Filesreadme.pdf",
    );
    expect(screen.queryByText("Contracts")).not.toBeInTheDocument();
    expect(screen.queryByText("contract.pdf")).not.toBeInTheDocument();
    expect(screen.queryByText("unrelated.pdf")).not.toBeInTheDocument();
    expect(screen.getByTestId("section-divider")).toBeInTheDocument();
  });

  it("requests and renders children for the selected folder", () => {
    mockUseSelector.mockReturnValue({ id: rootFolderMockData.id });
    mockUseGetFolderStructureQuery.mockReturnValue({
      data: folderStructureMockData,
      isLoading: false,
    });

    render(<FileUploadPage />);

    expect(mockUseGetFolderStructureQuery).toHaveBeenCalledWith({
      rootId: rootFolderMockData.id,
      depth: 2,
    });
    expect(screen.getByTestId("folder-section")).toHaveTextContent(
      "FoldersContracts",
    );
    expect(screen.getByTestId("file-section")).toHaveTextContent(
      "Filescontract.pdf",
    );
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
    expect(screen.queryByText("readme.pdf")).not.toBeInTheDocument();
  });
});
