import { Check } from "lucide-react"

interface RequestedUploadCardProps {
  title: string
  description?: string
  accept?: string
  /** Name of the uploaded file. When set, the card shows its "done" state. */
  fileName?: string
  onUpload: (file: File) => void
  onView?: () => void
  onRemove?: () => void
  className?: string
}

/** A single document your lawyer has asked for: a dropzone until it's uploaded, then a ✓ row. */
export function RequestedUploadCard({
  title,
  description,
  accept,
  fileName,
  onUpload,
  onView,
  onRemove,
  className,
}: RequestedUploadCardProps) {
  if (!fileName) {
    return (
      <UploadDropzone
        title={title}
        description={description}
        accept={accept}
        onFiles={([file]) => file && onUpload(file)}
        badge="Required"
        className={className}
      />
    )
  }

  return (
    <div
      className={cn(
        // border-2 keeps the height identical to the dashed state
        "flex min-w-0 items-center gap-3 rounded-xl border-2 border-transparent bg-muted/50 p-4",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <Check className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {onView ? (
          <button
            type="button"
            onClick={onView}
            className="block max-w-full truncate text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {fileName}
          </button>
        ) : (
          <p className="truncate text-xs text-muted-foreground">{fileName}</p>
        )}
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Remove ${fileName}`}
          onClick={onRemove}
          className="size-8 shrink-0 rounded-full text-muted-foreground"
        >
          <X />
        </Button>
      )}
    </div>
  )
}
