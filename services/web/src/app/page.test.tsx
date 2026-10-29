import { render, screen } from "@testing-library/react";
import FileUploadPage from "./file-upload/page";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("FileUpload Page", () => {
  it("renders the first section", () => {
    renderWithStore(<FileUploadPage />);

    expect(screen.getByText(/Your Uploaded Files/i)).toBeInTheDocument();
  });

  it("renders the second section", () => {
    renderWithStore(<FileUploadPage />);

    expect(
      screen.getByText(/Lawyer Documents and Drafts/i),
    ).toBeInTheDocument();
  });
});
