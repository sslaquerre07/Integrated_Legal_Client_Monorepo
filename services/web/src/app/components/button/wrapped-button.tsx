"use client";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";

type ButtonProps = {
  content: string;
  isFolder?: boolean;
  onClick?: () => void;
};

export default function WrappedButton({
  content,
  isFolder = false,
  onClick,
}: ButtonProps) {
  // "extra" functionality - in case we need a smaller folder button
  const icon = isFolder ? <FolderIcon /> : undefined;
  const onClickFunction = onClick || (() => console.log("clicked", content));
  return (
    <Button
      variant="contained"
      className="whitespace-nowrap rounded-lg bg-white/5 px-3 py-2 font-roboto-mono text-base font-bold text-white"
      disableElevation
      startIcon={icon}
      sx={{ textTransform: "none" }}
      onClick={onClickFunction}
    >
      {content}
    </Button>
  );
}