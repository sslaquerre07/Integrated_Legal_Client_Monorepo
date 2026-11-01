import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUploadPage from "./page";
import { SECTION_NAME_1, SECTION_NAME_2 } from "$src/app/constants/page/file-upload/section-names";


jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("FileUploadPage", () => {
    it("renders both sections", () => {
        render(<FileUploadPage />);
        expect(screen.getByText(SECTION_NAME_1)).toBeInTheDocument();
        expect(screen.getByText(SECTION_NAME_2)).toBeInTheDocument();
    });

    it("renders the Add Files card", () => {
        render(<FileUploadPage />);
        expect(screen.getByRole("button", { name: "Add Files" })).toBeInTheDocument();
    });
});