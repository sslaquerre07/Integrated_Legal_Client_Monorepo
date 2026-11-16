import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateFolderButton from "./create-folder-button";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFolderMutation: jest.fn(),
}));

const mockUseCreateFolderMutation =
  useCreateFolderMutation as jest.Mock;

describe("CreateFolderButton", () => {
  const createFolder = jest.fn();

  beforeEach(() => {
    createFolder.mockReset();
    mockUseCreateFolderMutation.mockReturnValue([createFolder]);
  });

  it("renders a folder name input and create button", () => {
    render(<CreateFolderButton />);

    expect(
      screen.getByPlaceholderText("Folder name"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create folder" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
  });

  it("does not create a folder when the name is blank", () => {
    render(<CreateFolderButton />);

    fireEvent.click(screen.getByRole("button", { name: "Create folder" }));

    expect(createFolder).not.toHaveBeenCalled();
  });

  it("does not create a folder when the name contains only whitespace", () => {
    render(<CreateFolderButton />);
    fireEvent.change(screen.getByPlaceholderText("Folder name"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create folder" }));

    expect(createFolder).not.toHaveBeenCalled();
  });

  it("trims the name, creates the folder, and clears the input", async () => {
    createFolder.mockResolvedValue({ data: { id: "new-folder-id" } });
    render(<CreateFolderButton />);
    const input = screen.getByPlaceholderText("Folder name");

    fireEvent.change(input, {
      target: { value: "  New Folder  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create folder" }));

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith({ name: "New Folder" });
      expect(input).toHaveValue("");
    });
  });
});