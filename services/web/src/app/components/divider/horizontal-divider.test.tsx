import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HorizontalDivider from "./horizontal-divider";
describe("HorizontalDivider", () => {
    it("renders a divider", () => {
        const { container } = render(<HorizontalDivider />);
        expect(container.firstChild).toBeInTheDocument();
    });
});