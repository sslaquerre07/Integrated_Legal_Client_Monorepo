import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFolderForm from "./create-folder-form";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFolderMutation: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFolderMutation =
  useCreateFolderMutation as jest.Mock;

describe("CreateFolderForm", () => {
  const createFolder = jest.fn();

  beforeEach(() => {
    createFolder.mockReset();
    mockUseSelector.mockReturnValue({ id: "current-folder-id" });
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
    createFolder.mockResolvedValue({ data: { id: "new-folder-id" } });
    render(<CreateFolderForm />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "  New Folder  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith({
        name: "New Folder",
        parentId: "current-folder-id",
      });
      expect(input).toHaveValue("");
    });
  });

  it("creates a root folder without a parent id", async () => {
    mockUseSelector.mockReturnValue(undefined);
    createFolder.mockResolvedValue({ data: { id: "root-folder-id" } });
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
