export default function AddFileCard() {
  return (
    <div className="flex flex-1 items-center justify-between rounded-lg bg-highlighted/10 px-3 py-2">
      <div className="flex flex-1 items-center gap-3">
        <span className="min-w-0 whitespace-nowrap font-roboto-mono font-semibold text-highlighted">
          Upload Additional Files
        </span>
      </div>

      {/* Close Button */}
      <button className="h-12 w-12 rounded-r-lg bg-teal-400/5 text-3xl text-highlighted">
        +
      </button>
    </div>
  );
}
