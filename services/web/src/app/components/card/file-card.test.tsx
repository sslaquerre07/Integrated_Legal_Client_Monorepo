import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileCard from "./file-card";

describe("FileCard", () => {
    it("renders the name and date", () => {
        render(<FileCard name="report.pdf" type="approved" date_uploaded="2026-02-15" />);
        expect(screen.getByText("report.pdf")).toBeInTheDocument();
        expect(screen.getByText("2026-02-15")).toBeInTheDocument();
    });

    it("shows Approved when type is approved", () => {
        render(<FileCard name="report.pdf" type="approved" date_uploaded="2026-02-15" />);
        expect(screen.getByText("Approved")).toBeInTheDocument();
    });

    it("shows Waiting for Approval when type is not approved", () => {
        render(<FileCard name="report.pdf" type="pending" date_uploaded="2026-02-15" />);
        expect(screen.getByText("Waiting for Approval")).toBeInTheDocument();
    });
});