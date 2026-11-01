import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddFileCard from "./add-file-card";

describe("AddFileCard", () => {
    it("renders the Add Files button", () => {
        render(<AddFileCard />);
        expect(screen.getByRole("button", { name: "Add Files" })).toBeInTheDocument();
    });

    it("renders the add icon", () => {
        render(<AddFileCard />);
        expect(screen.getByTestId("AddIcon")).toBeInTheDocument();
    });
});