import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemCard from "./item-card";
import { NodeDto } from "@repo/types";
import { makeStore } from "$src/store/store";
import { Provider } from "react-redux";
import { useDeleteNodesMutation } from "$src/store/nodesApi/nodesApiSlice";
import { openFolder } from "$src/store/folderStructureSlice/FolderStructureSlice";
import {
  fileCardMockData,
  folderCardMockData,
} from "$src/app/constants/test-data/node-test-data";

// Keep the real API slice for the store, but replace the mutation hook so the
// test verifies the component's request without possibility of making a network call
jest.mock("$src/store/nodesApi/nodesApiSlice", () => {
  global.fetch = jest.fn() as unknown as typeof fetch;
  const actual = jest.requireActual("$src/store/nodesApi/nodesApiSlice");
  return { ...actual, useDeleteNodesMutation: jest.fn() };
});

describe("ItemCard", () => {
  const deleteNodesMutation = jest.fn();

  beforeEach(() => {
    deleteNodesMutation.mockReset();
    // RTK Query hooks return the trigger function as the first tuple item.
    (useDeleteNodesMutation as jest.Mock).mockReturnValue([
      deleteNodesMutation,
    ]);
  });

  const renderItemCard = (node: NodeDto) => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    return {
      store,
      dispatchSpy,
      ...render(
        <Provider store={store}>
          <ItemCard node={node} />
        </Provider>,
      ),
    };
  };

  it("renders the content", () => {
    renderItemCard(fileCardMockData);
    expect(screen.getByText("Test File")).toBeInTheDocument();
  });

  it("deletes the node when the delete button is clicked", () => {
    renderItemCard(fileCardMockData);

    fireEvent.click(screen.getByRole("button", { name: "delete" }));

    expect(deleteNodesMutation).toHaveBeenCalledWith({
      ids: [fileCardMockData.id],
    });
  });

  it("renders the folder icon when isFolder is true", () => {
    renderItemCard(folderCardMockData);
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
  });

  it("does not render the folder icon when isFolder is false", () => {
    renderItemCard(fileCardMockData);
    expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
  });

  it("opens the folder when its content is clicked", () => {
    const { dispatchSpy } = renderItemCard(folderCardMockData);

    fireEvent.click(screen.getByText(folderCardMockData.name));

    expect(dispatchSpy).toHaveBeenCalledWith(openFolder(folderCardMockData.id));
  });

  it("does not open anything when a file's content is clicked", () => {
    const { dispatchSpy } = renderItemCard(fileCardMockData);

    fireEvent.click(screen.getByText(fileCardMockData.name));

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: openFolder.type }),
    );
  });
});