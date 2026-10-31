import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type FileCardProps = {
  name: string;
  type: string;
  date_uploaded: string;
};

export default function FileCard({
  name,
  type,
  date_uploaded,
}: FileCardProps) {
  const isApproved = type === "approved";
  const statusLabel = isApproved ? "Approved" : "Waiting for Approval";
  const statusColor = isApproved ? "text-highlighted" : "text-pending-yellow";

  return (
    <Card className="min-w-fit flex-1 rounded-lg bg-white/5 text-white">
      <CardActionArea
        className="flex h-full w-full items-center justify-between px-3 py-2"
        onClick={() => console.log("open", name)}
      >
        <Stack spacing={0.5} useFlexGap className="items-start">
          <Typography
            component="span"
            className="whitespace-nowrap font-roboto-mono text-xl font-semibold text-white"
          >
            {name}
          </Typography>
          <Typography
            component="span"
            className={`whitespace-nowrap font-roboto-mono font-semibold ${statusColor}`}
          >
            {statusLabel}
          </Typography>
          <Typography
            component="span"
            className="whitespace-nowrap font-roboto-mono font-semibold text-white"
          >
            {date_uploaded}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
