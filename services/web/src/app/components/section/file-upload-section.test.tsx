import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUploadSection from "./file-upload-section";
import { FileDetail } from "$src/app/constants/types/file-detail";

const files: FileDetail[] = [
    { name: "Documents", isFolder: true, type: "folder", date_uploaded: "2026-01-01" },
    { name: "report.pdf", isFolder: false, type: "pdf", date_uploaded: "2026-02-15" },
];

describe("FileUploadSection", () => {
    it("renders the section label", () => {
        render(<FileUploadSection section_label="My Files" />);
        expect(screen.getByText("My Files")).toBeInTheDocument();
    });

    it("renders the button labels", () => {
        render(<FileUploadSection section_label="My Files" button_labels={["Upload"]} />);
        expect(screen.getByText("Upload")).toBeInTheDocument();
    });

    it("renders the files", () => {
        render(<FileUploadSection section_label="My Files" files={files} />);
        expect(screen.getByText("Documents")).toBeInTheDocument();
        expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });
});