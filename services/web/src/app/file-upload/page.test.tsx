import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUploadPage from "./page";
import {
    SECTION_NAME,
    SECTION_NAME2,
} from "$src/app/constants/hardcoded/hardcoded-section-data";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("FileUploadPage", () => {
    it("renders both sections", () => {
        render(<FileUploadPage />);
        expect(screen.getByText(SECTION_NAME)).toBeInTheDocument();
        expect(screen.getByText(SECTION_NAME2)).toBeInTheDocument();
    });

    it("renders the Add Files card", () => {
        render(<FileUploadPage />);
        expect(screen.getByRole("button", { name: "Add Files" })).toBeInTheDocument();
    });
});