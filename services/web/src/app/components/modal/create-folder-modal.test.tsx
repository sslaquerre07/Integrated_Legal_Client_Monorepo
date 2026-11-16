import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateFolderModal from "./create-folder-modal";

jest.mock("$src/app/components/form/create-folder-form", () => ({
  __esModule: true,
  default: () => <div data-testid="create-folder-form">Folder form</div>,
}));

describe("CreateFolderModal", () => {
  it("renders a button to open the create-folder modal", () => {
    render(<CreateFolderModal />);

    expect(
      screen.getByRole("button", { name: "Create Folder" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("create-folder-form"),
    ).not.toBeInTheDocument();
  });

  it("opens the modal with its title and folder form", () => {
    render(<CreateFolderModal />);

    fireEvent.click(screen.getByRole("button", { name: "Create Folder" }));

    expect(
      screen.getByRole("heading", { name: "Create Folder" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("create-folder-form")).toBeInTheDocument();
  });
});
