import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import { getCurrentFolderId } from "$src/store/folderStructureSlice/FolderStructureSlice";
import CreateFolderForm from "./create-folder-form";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFolderMutation: jest.fn(),
}));

jest.mock("$src/store/folderStructureSlice/FolderStructureSlice", () => ({
  getCurrentFolderId: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFolderMutation = useCreateFolderMutation as jest.Mock;

function mockCurrentFolderId(currentFolderId: string | null) {
  mockUseSelector.mockImplementation((selector) =>
    selector === getCurrentFolderId ? currentFolderId : undefined,
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

  it("renders the folder name field, helper text, and submit button", () => {
    render(<CreateFolderForm />);

    expect(screen.getByText("Folder Name")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the name of the folder you want to create."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "folder-name");
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("reads the current folder id from the folder structure slice", () => {
    render(<CreateFolderForm />);

    expect(mockUseSelector).toHaveBeenCalledWith(getCurrentFolderId);
  });

  it("does not create a folder when the name is blank", () => {
    render(<CreateFolderForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFolder).not.toHaveBeenCalled();
  });

  it("does not create a folder when the name contains only whitespace", () => {
    render(<CreateFolderForm />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFolder).not.toHaveBeenCalled();
  });

  it("trims the name and includes the current folder as the parent", async () => {
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

  it.each([
    ["an empty string", ""],
    ["null", null],
  ])(
    "creates a root folder without a parent id when the current folder id is %s",
    async (_, currentFolderId) => {
      mockCurrentFolderId(currentFolderId);
      render(<CreateFolderForm />);

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Root Folder" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(createFolder).toHaveBeenCalledTimes(1);
      });
      expect(createFolder.mock.calls[0][0]).toStrictEqual({
        name: "Root Folder",
        parentId: undefined,
      });
    },
  );
});