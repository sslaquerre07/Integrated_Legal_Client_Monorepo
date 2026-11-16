import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateFolderModal from "./create-folder-modal";

jest.mock(
  "$src/app/components/form/create-folder-form",
  () =>
    function CreateFolderFormMock() {
      return <div data-testid="create-folder-form">Folder form</div>;
    },
);

describe("CreateFolderModal", () => {
  it("renders the Create Folder button", () => {
    render(<CreateFolderModal />);

    expect(screen.getByRole("button", { name: "Create Folder" })).toBeInTheDocument();
  });

  it("opens the create-folder modal", () => {
    render(<CreateFolderModal />);

    fireEvent.click(screen.getByRole("button", { name: "Create Folder" }));

    expect(screen.getByRole("heading", { name: "Create Folder" })).toBeInTheDocument();
  });
});
