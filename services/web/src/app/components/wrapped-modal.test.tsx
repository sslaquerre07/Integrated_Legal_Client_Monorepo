import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WrappedModal from "./wrapped-modal";
import { Stack } from "@mui/material";

function renderModal() {
  return render(
    <WrappedModal
      title="Example modal"
      content={<Stack>Modal content</Stack>}
      trigger={(open) => (
        <button type="button" onClick={open}>
          Open modal
        </button>
      )}
    />,
  );
}

describe("WrappedModal", () => {
  it("renders the trigger and keeps the modal closed initially", () => {
    renderModal();

    expect(
      screen.getByRole("button", { name: "Open modal" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Example modal" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("opens with the configured title and content", () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    expect(
      screen.getByRole("heading", { name: "Example modal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("closes when the backdrop is clicked", async () => {
    renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    const backdrop = document.querySelector(".MuiBackdrop-root");
    fireEvent.click(backdrop as Element);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Example modal" }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });
  });
});
