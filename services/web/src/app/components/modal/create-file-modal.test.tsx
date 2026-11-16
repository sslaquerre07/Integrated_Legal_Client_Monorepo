import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateFileModal from "./create-file-modal";

jest.mock(
  "$src/app/components/form/create-file-form",
  () => 
    function CreateFileFormMock() {
      return <div data-testid="create-file-form">File form</div>
    },
);

describe("CreateFileModal", () => {
  it("renders the Create File button", () => {
    render(<CreateFileModal />);

    expect(screen.getByRole("button", { name: "Create File" })).toBeInTheDocument();
  });

  it("opens the create-file modal", () => {
    render(<CreateFileModal />);

    fireEvent.click(screen.getByRole("button", { name: "Create File" }));

    expect(screen.getByRole("heading", { name: "Create File" })).toBeInTheDocument();
  });
});
