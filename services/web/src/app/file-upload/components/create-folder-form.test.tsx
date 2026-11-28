import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFolderForm from "./create-folder-form";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { makeStore } from "$src/store/store";
import { renderWithProviders } from "$src/test/utils/render";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFolderMutation: jest.fn(),
}));

const mockUseCreateFolderMutation = useCreateFolderMutation as jest.Mock;

function renderForm(folderId: string | null = null) {
  const store = makeStore();
  store.dispatch(openFolder(folderId));
  return renderWithProviders(<CreateFolderForm />, { store });
}

describe("CreateFolderForm", () => {
  const createFolder = jest.fn();

  beforeEach(() => {
    createFolder.mockResolvedValue({ data: { id: "new-folder-id" } });
    mockUseCreateFolderMutation.mockReturnValue([createFolder]);
  });

  it("creates a folder in the current folder", async () => {
    renderForm("current-folder-id");
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
    renderForm();
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
