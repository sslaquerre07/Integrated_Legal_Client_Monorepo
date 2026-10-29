import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";

type ButtonProps = {
  content: string;
  isFolder: boolean;
};

export default function WrappedButton({ content, isFolder }: ButtonProps) {
  const icon = isFolder ? <FolderIcon /> : undefined;
  return (
    <Button
      variant="contained"
      className="whitespace-nowrap rounded-lg bg-white/5 px-3 py-2 font-roboto-mono text-base font-bold text-white"
      disableElevation
      startIcon={icon}
      sx={{ textTransform: "none" }}
    >
      {content}
    </Button>
  );
}
