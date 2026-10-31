import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Section from "./section";
import { FileDetail } from "$src/app/constants/types/file-detail";

const files: FileDetail[] = [
    { name: "Documents", isFolder: true, type: "folder", date_uploaded: "2026-01-01" },
    { name: "report.pdf", isFolder: false, type: "pdf", date_uploaded: "2026-02-15" },
];

describe("Section", () => {
    it("renders the section label", () => {
        render(<Section section_label="My Files" />);
        expect(screen.getByText("My Files")).toBeInTheDocument();
    });

    it("renders the button labels", () => {
        render(<Section section_label="My Files" button_labels={["Upload"]} />);
        expect(screen.getByText("Upload")).toBeInTheDocument();
    });

    it("renders the files", () => {
        render(<Section section_label="My Files" files={files} />);
        expect(screen.getByText("Documents")).toBeInTheDocument();
        expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });
});