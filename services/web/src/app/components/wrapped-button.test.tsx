import { render, screen } from "@testing-library/react";
import WrappedButton from "./wrapped-button";

describe("WrappedButton", () => {
  it("renders the content with the right details", () => {
    render(<WrappedButton content="Upload" isFolder={false} />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    expect(screen.queryByTestId("FolderIcon")).not.toBeInTheDocument();
  });

  it("renders the folder icon when isFolder is true", () => {
    render(<WrappedButton content="Upload" isFolder />);
    expect(screen.getByTestId("FolderIcon")).toBeInTheDocument();
  });
});
