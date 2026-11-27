import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRenameNodeMutation } from "$src/store/nodesApi/nodesApiSlice";
import RenameNodeForm from "./rename-node-form";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useRenameNodeMutation: jest.fn(),
}));

const mockUseRenameNodeMutation = useRenameNodeMutation as jest.Mock;

describe("RenameNodeForm", () => {
  const renameNode = jest.fn();

  beforeEach(() => {
    renameNode.mockReset();
    mockUseRenameNodeMutation.mockReturnValue([renameNode]);
  });

  it("does not rename the node when the new name is empty or whitespace", () => {
    render(<RenameNodeForm id="node-id" initialName="Original Name" />);

    for (const invalidName of ["", "   "]) {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: invalidName },
      });
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    }

    expect(renameNode).not.toHaveBeenCalled();
  });

  it("trims the new name and sends the node id", async () => {
    renameNode.mockResolvedValue({ data: { id: "node-id" } });
    render(<RenameNodeForm id="node-id" initialName="Original Name" />);
    const input = screen.getByRole("textbox");

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Renamed Node  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(renameNode).toHaveBeenCalledWith({
        id: "node-id",
        name: "Renamed Node",
      });
      expect(input).toHaveValue("");
    });
  });
});
