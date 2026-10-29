import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

type ItemCardProps = {
  content: string;
  isFolder: boolean;
};

export default function WrappedItemCard({ content, isFolder }: ItemCardProps) {
  const icon = isFolder ? <FolderIcon fontSize="large" /> : undefined;

  return (
    <Card className="relative whitespace-nowrap rounded-lg bg-white/5 text-white">
      <CardActionArea
        className="flex h-full w-full items-center justify-start gap-3 py-4 pl-3 pr-20 font-roboto-mono text-xl font-bold"
        onClick={() => console.log("open", content)}
      >
        {icon}
        {content}
      </CardActionArea>

      <IconButton
        aria-label="delete"
        size="large"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-lg bg-teal-400/5 text-white"
        onClick={() => console.log("delete", content)}
      >
        <CloseIcon />
      </IconButton>
    </Card>
  );
}
