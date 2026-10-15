export default function DraftDocumentCard({
  name,
  type,
  date_uploaded,
}: {
  name: string;
  type: string;
  date_uploaded: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-lg bg-white/5 px-3 py-2">
      <div className="flex flex-col items-left gap-1">
        <span className="whitespace-nowrap font-roboto-mono font-semibold text-white text-xl ">
          {name}
        </span>
        <div>
          {type === "approved" ? (
            <span className="whitespace-nowrap font-roboto-mono  font-semibold text-highlighted">
              Approved
            </span>
          ) : (
            <span className="whitespace-nowrap font-roboto-mono  font-semibold text-pending-yellow">
              Waiting for Approval
            </span>
          )}
        </div>
        <span className="whitespace-nowrap font-roboto-mono  font-semibold text-white">
          {date_uploaded}
        </span>
      </div>
    </div>
  );
}
