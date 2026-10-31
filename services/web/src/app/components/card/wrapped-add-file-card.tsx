import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import AddIcon from "@mui/icons-material/Add";

export default function AddFileCard() {
  return (
    <Card className="relative whitespace-nowrap rounded-lg bg-highlighted/10 text-highlighted">
      <CardActionArea
        className="flex h-full w-full min-w-56 items-center justify-start gap-3 py-4 pl-3 pr-20 font-roboto-mono text-xl font-bold"
        onClick={() => console.log("open add file modal")}
      >
        Add Files
      </CardActionArea>

      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-teal-400/5 text-"
      >
        <AddIcon fontSize="large" />
      </span>
    </Card>
  );
}