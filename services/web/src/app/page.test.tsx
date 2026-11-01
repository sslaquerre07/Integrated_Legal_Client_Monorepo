import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

describe("Home", () => {
  it("renders a link to the file upload page", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: "Go to File Upload Page" })).toHaveAttribute(
      "href",
      "/file-upload",
    );
  });
});