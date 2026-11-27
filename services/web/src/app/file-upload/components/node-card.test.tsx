import { fireEvent, screen, waitFor } from "@testing-library/react";
import NodeCard from "./node-card";
import { NodeDto } from "@repo/types";
import { makeStore } from "$src/store/store";
import {
  useDeleteNodeMutation,
  useRenameNodeMutation,
} from "$src/store/nodesApi/nodesApiSlice";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/test/fixtures/node-test-data";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { renderWithProviders } from "$src/test/utils/render";

// Keep the real API slice for the store, but replace the mutation hook so the
// test verifies the component's request without possibility of making a network call
jest.mock("$src/store/nodesApi/nodesApiSlice", () => {
  const actual = jest.requireActual("$src/store/nodesApi/nodesApiSlice");
  return {
    ...actual,
    useDeleteNodeMutation: jest.fn(),
    useRenameNodeMutation: jest.fn(),
  };
});

describe("NodeCard", () => {
  const deleteNodeMutation = jest.fn();
  const renameNodeMutation = jest.fn();

  beforeEach(() => {
    deleteNodeMutation.mockReset();
    renameNodeMutation.mockReset();
    renameNodeMutation.mockResolvedValue({
      data: { id: fileCardMockData.id },
    });
    // RTK Query hooks return the trigger function as the first tuple item.
    (useDeleteNodeMutation as jest.Mock).mockReturnValue([deleteNodeMutation]);
    (useRenameNodeMutation as jest.Mock).mockReturnValue([renameNodeMutation]);
  });

  const renderNodeCard = (node: NodeDto) => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    return {
      dispatchSpy,
      ...renderWithProviders(<NodeCard node={node} />, { store }),
    };
  };

  it("renders folder and file content with the appropriate icon", () => {
    const { rerender } = renderNodeCard(folderCardMockData);

    expect(screen.getByText("Test Folder")).toBeInTheDocument();
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();

    rerender(<NodeCard node={fileCardMockData} />);

    expect(screen.getByText("Test File")).toBeInTheDocument();
    expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
  });

  it("deletes the node when the delete button is clicked", () => {
    renderNodeCard(fileCardMockData);

    fireEvent.click(screen.getByRole("button", { name: "delete" }));

    expect(deleteNodeMutation).toHaveBeenCalledWith(fileCardMockData.id);
  });

  it("renames the node", async () => {
    renderNodeCard(fileCardMockData);

    fireEvent.click(screen.getByRole("button", { name: "rename" }));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Renamed File  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(renameNodeMutation).toHaveBeenCalledWith({
        id: fileCardMockData.id,
        name: "Renamed File",
      });
    });
  });

  it("opens the folder when its content is clicked", () => {
    const { dispatchSpy } = renderNodeCard(folderCardMockData);

    fireEvent.click(screen.getByText(folderCardMockData.name));

    expect(dispatchSpy).toHaveBeenCalledWith(openFolder(folderCardMockData.id));
  });
});
