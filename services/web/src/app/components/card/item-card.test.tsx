import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemCard from "./item-card";

describe("ItemCard", () => {
    it("renders the content", () => {
        render(<ItemCard content="Documents" isFolder={false} />);
        expect(screen.getByText("Documents")).toBeInTheDocument();
    });

    it("renders the delete button", () => {
        render(<ItemCard content="Documents" isFolder={false} />);
        expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument();
    });

    it("renders the folder icon when isFolder is true", () => {
        render(<ItemCard content="Documents" isFolder />);
        expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
    });

    it("does not render the folder icon when isFolder is false", () => {
        render(<ItemCard content="Documents" isFolder={false} />);
        expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
    });
});