import { fireEvent, screen, waitFor } from "@testing-library/react";
import NodeCard from "./node-card";
import { NodeDto } from "@repo/types";
import { makeStore } from "$src/store/store";
import {
  useDeleteNodeMutation,
  useRenameNodeMutation,
} from "$src/store/nodesApi/nodesApiSlice";
import {
  rootFileMockData,
  rootFolderMockData,
} from "$src/test/fixtures/node-test-data";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { renderWithProviders } from "$src/test/utils/render";
import { messages } from "$src/i18n/messages";

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
      data: { id: rootFileMockData.id },
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
    const { rerender } = renderNodeCard(rootFolderMockData);

    expect(screen.getByText(rootFolderMockData.name)).toBeInTheDocument();
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();

    rerender(<NodeCard node={rootFileMockData} />);

    expect(screen.getByText(rootFileMockData.name)).toBeInTheDocument();
    expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
  });

  it("deletes the node when the delete button is clicked", () => {
    renderNodeCard(rootFileMockData);

    fireEvent.click(
      screen.getByRole("button", { name: messages.FileUpload.nodeCard.delete }),
    );

    expect(deleteNodeMutation).toHaveBeenCalledWith(rootFileMockData.id);
  });

  it("renames the node", async () => {
    renderNodeCard(rootFileMockData);

    fireEvent.click(
      screen.getByRole("button", { name: messages.FileUpload.nodeCard.rename }),
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Renamed File  " },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: messages.FileUpload.renameNodeModal.form.submitButtonContent,
      }),
    );

    await waitFor(() => {
      expect(renameNodeMutation).toHaveBeenCalledWith({
        id: rootFileMockData.id,
        name: "Renamed File",
      });
    });
  });

  it("opens the folder when its content is clicked", () => {
    const { dispatchSpy } = renderNodeCard(rootFolderMockData);

    fireEvent.click(screen.getByText(rootFolderMockData.name));

    expect(dispatchSpy).toHaveBeenCalledWith(openFolder(rootFolderMockData.id));
  });
});
