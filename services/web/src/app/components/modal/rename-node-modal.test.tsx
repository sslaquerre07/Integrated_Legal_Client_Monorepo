import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RenameNodeModal from "./rename-node-modal";

jest.mock("$src/app/components/form/rename-node-form", () => ({
  __esModule: true,
  default: () => <div data-testid="rename-node-form">Rename form</div>,
}));

describe("RenameNodeModal", () => {
  it("renders a rename trigger", () => {
    render(<RenameNodeModal id="node-id" name="Original Name" />);

    expect(
      screen.getByRole("button", { name: "rename" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("rename-node-form")).not.toBeInTheDocument();
  });

  it("opens the modal with the node name and rename form", () => {
    render(<RenameNodeModal id="node-id" name="Original Name" />);

    fireEvent.click(screen.getByRole("button", { name: "rename" }));

    expect(
      screen.getByRole("heading", { name: "Renaming - Original Name" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("rename-node-form")).toBeInTheDocument();
  });
});
