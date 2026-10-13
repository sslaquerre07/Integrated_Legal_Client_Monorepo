export default function FolderCard() {
    return (
        <div className="flex flex-1 items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <div className="flex flex-1 items-center gap-3">
            {/* Folder Icon */}
            <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="white"
            strokeWidth="3"
            viewBox="0 0 30 24"
            >
            {/* Vector Path -AI generated */}
            <path d="M2 5h10l3 3h13v13H2z" />
            </svg>

            <span className="min-w-0 whitespace-nowrap font-roboto-mono text-[clamp(10px,4.5cqw,20px)] font-semibold text-white">
            Client Made Folder
            </span>
            
        </div>

        {/* Close Button */}
        <button className="h-12 w-12 rounded-r-lg bg-teal-400/5 text-3xl text-white">
            ×
        </button>
        </div>
    );
}