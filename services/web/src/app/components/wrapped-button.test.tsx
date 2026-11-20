import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WrappedButton from "./wrapped-button";

describe("WrappedButton", () => {
    it("renders the content", () => {
        render(<WrappedButton content="Upload" isFolder={false} />);
        expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    });

    it("renders the folder icon when isFolder is true", () => {
        render(<WrappedButton content="Upload" isFolder />);
        expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
    });

    it("does not render the folder icon when isFolder is false", () => {
        render(<WrappedButton content="Upload" isFolder={false} />);
        expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
    });
});