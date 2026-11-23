import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFolderForm from "./create-folder-form";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFolderMutation: jest.fn(),
}));

jest.mock("$src/store/folderNav/folderNavSlice", () => ({
  selectCurrentFolderId: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFolderMutation = useCreateFolderMutation as jest.Mock;

function mockCurrentFolderId(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) =>
    selector === selectCurrentFolderId ? currentFolderId : undefined,
  );
}

describe("CreateFolderForm", () => {
  const createFolder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    createFolder.mockResolvedValue({ data: { id: "new-folder-id" } });
    mockCurrentFolderId("current-folder-id");
    mockUseCreateFolderMutation.mockReturnValue([createFolder]);
  });

  it("creates a folder in the current folder", async () => {
    render(<CreateFolderForm />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "  New Folder  " } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith({
        name: "New Folder",
        parentId: "current-folder-id",
      });
      expect(input).toHaveValue("");
    });
  });

  it("creates a folder without a parent id in the root folder", async () => {
    mockCurrentFolderId(null);
    render(<CreateFolderForm />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Root Folder" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith({
        name: "Root Folder",
        parentId: undefined,
      });
    });
  });
});
