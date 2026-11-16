import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateFileModal from "./create-file-modal";

jest.mock("$src/app/components/form/create-file-form", () => ({
  __esModule: true,
  default: () => <div data-testid="create-file-form">File form</div>,
}));

describe("CreateFileModal", () => {
  it("renders a button to open the create-file modal", () => {
    render(<CreateFileModal />);

    expect(
      screen.getByRole("button", { name: "Create File" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("create-file-form")).not.toBeInTheDocument();
  });

  it("opens the modal with its title and file form", () => {
    render(<CreateFileModal />);

    fireEvent.click(screen.getByRole("button", { name: "Create File" }));

    expect(screen.getByRole("heading", { name: "Create File" })).toBeInTheDocument();
    expect(screen.getByTestId("create-file-form")).toBeInTheDocument();
  });
});
