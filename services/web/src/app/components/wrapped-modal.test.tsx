import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import WrappedModal from "./wrapped-modal";
import { Typography } from "@mui/material";

function renderModal() {
  return render(
    <WrappedModal
      title="Example modal"
      content={<Typography>Modal content</Typography>}
      trigger={(open) => (
        <button type="button" onClick={open}>
          Open modal
        </button>
      )}
    />,
  );
}

describe("WrappedModal", () => {

  it("opens with the title and content only after a click", () => {
  renderModal();
  const title = { name: "Example modal" };

  expect(screen.queryByRole("heading", title)).not.toBeInTheDocument();
  expect(screen.queryByText("Modal content")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

  expect(screen.getByRole("heading", title)).toBeInTheDocument();
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
