import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelector } from "react-redux";
import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import CreateFileForm from "./create-file-form";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("$src/store/nodesApi/nodesApiSlice", () => ({
  useCreateFileMutation: jest.fn(),
}));

const mockUseSelector = useSelector as unknown as jest.Mock;
const mockUseCreateFileMutation = useCreateFileMutation as jest.Mock;

describe("CreateFileForm", () => {
  const createFile = jest.fn();

  beforeEach(() => {
    createFile.mockReset();
    mockUseSelector.mockReturnValue({ id: "current-folder-id" });
    mockUseCreateFileMutation.mockReturnValue([createFile]);
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a multiple-file input and submit button", () => {
    const { container } = render(<CreateFileForm />);
    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("multiple");
    expect(
      screen.getByRole("button", { name: "Submit" }),
    ).toBeInTheDocument();
  });

  it("uploads the selected files to the current folder", () => {
    const { container } = render(<CreateFileForm />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const files = [
      new File(["contract"], "contract.pdf", { type: "application/pdf" }),
      new File(["evidence"], "evidence.txt", { type: "text/plain" }),
    ];

    fireEvent.change(fileInput, { target: { files } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: "current-folder-id",
      files,
    });
  });

  it("uploads files without a parent when the root folder is selected", () => {
    mockUseSelector.mockReturnValue({ id: "" });
    const { container } = render(<CreateFileForm />);
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["readme"], "readme.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: "",
      files: [file],
    });
  });

  it("submits an empty file list when no files are selected", () => {
    render(<CreateFileForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(createFile).toHaveBeenCalledWith({
      parentId: "current-folder-id",
      files: [],
    });
  });
});
