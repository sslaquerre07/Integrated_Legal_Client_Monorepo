import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFileForm from "./create-file-form";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFileMutation: jest.fn(),
}));

jest.mock("$src/store/folderNav/folderNavSlice", () => ({
  selectCurrentFolderId: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFileMutation = useCreateFileMutation as jest.Mock;

function mockCurrentFolderId(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) =>
    selector === selectCurrentFolderId ? currentFolderId : undefined,
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

  it("uploads more than one file to the correct folder", () => {
    const { container } = render(<CreateFileForm />);
    const files = [
      new File(["contract"], "contract.pdf", { type: "application/pdf" }),
      new File(["evidence"], "evidence.txt", { type: "text/plain" }),
    ];

    fireEvent.change(getFileInput(container), { target: { files } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenNthCalledWith(1, {
      parentId: "current-folder-id",
      file: files[0],
    });
    expect(createFile).toHaveBeenNthCalledWith(2, {
      parentId: "current-folder-id",
      file: files[1],
    });
  });

  it("omits parentId when there is no current folder", () => {
    mockCurrentFolderId(null);
    const { container } = render(<CreateFileForm />);
    const files = [new File(["a"], "a.txt", { type: "text/plain" })];

    fireEvent.change(getFileInput(container), { target: { files } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: undefined,
      file: files[0],
    });
  });
});