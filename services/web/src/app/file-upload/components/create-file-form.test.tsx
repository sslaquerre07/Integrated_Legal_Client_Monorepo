import { fireEvent, screen } from "@testing-library/react";
import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFileForm from "./create-file-form";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { makeStore } from "$src/store/store";
import { renderWithProviders } from "$src/test/utils/render";
import { messages } from "$src/i18n/messages";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFileMutation: jest.fn(),
}));

const mockUseCreateFileMutation = useCreateFileMutation as jest.Mock;

function getFileInput(container: HTMLElement) {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

function renderForm(folderId: string | null = null) {
  const store = makeStore();
  store.dispatch(openFolder(folderId));
  return renderWithProviders(<CreateFileForm />, { store });
}

describe("CreateFileForm", () => {
  const createFile = jest.fn();
  beforeEach(() => {
    mockUseCreateFileMutation.mockReturnValue([
      createFile,
      { isError: false, error: undefined },
    ]);
  });

  it("uploads more than one file to the correct folder", () => {
    const { container } = renderForm("current-folder-id");
    const files = [
      new File(["contract"], "contract.pdf", { type: "application/pdf" }),
      new File(["evidence"], "evidence.txt", { type: "text/plain" }),
    ];

    fireEvent.change(getFileInput(container), { target: { files } });
    fireEvent.click(
      screen.getByRole("button", {
        name: messages.FileUpload.createFileModal.form.submitButtonContent,
      }),
    );

    expect(createFile).toHaveBeenNthCalledWith(1, {
      parentId: "current-folder-id",
      file: files[0],
    });
    expect(createFile).toHaveBeenNthCalledWith(2, {
      parentId: "current-folder-id",
      file: files[1],
    });
    expect(createFile).toHaveBeenCalledTimes(2);
  });

  it("omits parentId when there is no current folder", () => {
    const { container } = renderForm();
    const files = [new File(["a"], "a.txt", { type: "text/plain" })];

    fireEvent.change(getFileInput(container), { target: { files } });
    fireEvent.click(
      screen.getByRole("button", {
        name: messages.FileUpload.createFileModal.form.submitButtonContent,
      }),
    );

    expect(createFile).toHaveBeenCalledWith({
      parentId: undefined,
      file: files[0],
    });
  });
});
