import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRenameNodeMutation } from "$src/store/nodesApi/nodesApiSlice";
import RenameNodeForm from "./rename-node-form";

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useRenameNodeMutation: jest.fn(),
}));

const mockUseRenameNodeMutation = useRenameNodeMutation as jest.Mock;

function TestRenameNodeForm({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return RenameNodeForm(id, name);
}

describe("RenameNodeForm", () => {
  const renameNode = jest.fn();

  beforeEach(() => {
    renameNode.mockReset();
    mockUseRenameNodeMutation.mockReturnValue([renameNode]);
  });

  it("renders the initial name, helper text, and submit button", () => {
    render(<TestRenameNodeForm id="node-id" name="Original Name" />);

    expect(screen.getByText("New Name")).toBeInTheDocument();
    expect(screen.getByText("Enter the new name.")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("Original Name");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "id",
      "new-node-name",
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("does not rename the node when the new name is blank", () => {
    render(<TestRenameNodeForm id="node-id" name="Original Name" />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(renameNode).not.toHaveBeenCalled();
  });

  it("does not rename the node when the new name contains only whitespace", () => {
    render(<TestRenameNodeForm id="node-id" name="Original Name" />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(renameNode).not.toHaveBeenCalled();
  });

  it("trims the new name and sends the node id", async () => {
    renameNode.mockResolvedValue({ data: { id: "node-id" } });
    render(<TestRenameNodeForm id="node-id" name="Original Name" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Renamed Node  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(renameNode).toHaveBeenCalledWith({
        id: "node-id",
        name: "Renamed Node",
      });
    });
  });

  it("clears the input after the rename succeeds", async () => {
    renameNode.mockResolvedValue({ data: { id: "node-id" } });
    render(<TestRenameNodeForm id="node-id" name="Original Name" />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Renamed Node" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});
