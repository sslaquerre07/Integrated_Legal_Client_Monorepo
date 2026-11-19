import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFileForm from "./create-file-form";
import { selectCurrentId } from "$src/store/folderNav/folderNavSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFileMutation: jest.fn(),
}));

jest.mock("$src/store/folderNav/folderNavSlice", () => ({
  selectCurrentId: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFileMutation = useCreateFileMutation as jest.Mock;

function mockCurrentFolderId(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) =>
    selector === selectCurrentId ? currentFolderId : undefined,
  );
}

function getFileInput(container: HTMLElement) {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("CreateFileForm", () => {
  const createFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentFolderId("current-folder-id");
    mockUseCreateFileMutation.mockReturnValue([createFile]);
  });

  it("renders a multiple-file input and submit button", () => {
    const { container } = render(<CreateFileForm />);
    const fileInput = getFileInput(container);

    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("multiple");
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("reads the current folder id from the folder structure slice", () => {
    render(<CreateFileForm />);

    expect(mockUseSelector).toHaveBeenCalledWith(selectCurrentId);
  });

  it("uploads the selected files to the current folder", () => {
    const { container } = render(<CreateFileForm />);
    const files = [
      new File(["contract"], "contract.pdf", { type: "application/pdf" }),
      new File(["evidence"], "evidence.txt", { type: "text/plain" }),
    ];

    fireEvent.change(getFileInput(container), { target: { files } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: "current-folder-id",
      files,
    });
  });

  it.each([
    ["an empty string", ""],
    ["null", null],
  ])(
    "uploads files without a parent when the current folder id is %s",
    (_, currentFolderId) => {
      mockCurrentFolderId(currentFolderId);
      const { container } = render(<CreateFileForm />);
      const file = new File(["readme"], "readme.txt", { type: "text/plain" });

      fireEvent.change(getFileInput(container), { target: { files: [file] } });
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));

      expect(createFile).toHaveBeenCalledTimes(1);
      expect(createFile.mock.calls[0][0]).toStrictEqual({
        parentId: undefined,
        files: [file],
      });
    },
  );

  it("submits an empty file list when no files are selected", () => {
    render(<CreateFileForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: "current-folder-id",
      files: [],
    });
  });
});
