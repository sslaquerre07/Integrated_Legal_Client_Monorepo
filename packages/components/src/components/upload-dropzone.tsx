"use client"

import * as React from "react"
import { Check, Upload, X } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button } from "@repo/ui/components/ui/button"
import { cn } from "@repo/ui/lib/utils"

/** Same rules as <input accept>: ".pdf", "application/pdf", "image/*". */
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) =>
      rule.startsWith(".")
        ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith("/*")
          ? file.type.startsWith(rule.slice(0, -1))
          : file.type === rule
    )
}

interface UploadDropzoneProps {
  title: string
  description?: string
  /** Passed to the file picker and also enforced on drag & drop. */
  accept?: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  /** horizontal = slim row (checklists), vertical = tile that sits in a card grid */
  orientation?: "horizontal" | "vertical"
  /** Small label on the right, e.g. "Required" */
  badge?: string
  className?: string
}

export function UploadDropzone({
  title,
  description,
  accept,
  multiple,
  onFiles,
  orientation = "horizontal",
  badge,
  className,
}: UploadDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  function handle(list: FileList | null) {
    if (!list?.length) return
    const files = Array.from(list).filter((f) => matchesAccept(f, accept))
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }

  const vertical = orientation === "vertical"

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handle(e.dataTransfer.files)
        }}
        className={cn(
          "group flex w-full min-w-0 gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 text-left transition-colors",
          "hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          vertical ? "flex-col items-center justify-center p-6 text-center" : "items-center p-4",
          dragging && "border-primary bg-primary/10",
          className
        )}
      >
        {/* pointer-events-none stops dragleave flickering as you pass over children */}
        <span className="pointer-events-none flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Upload className="size-5" />
        </span>
        <span className={cn("pointer-events-none min-w-0", vertical ? "max-w-full" : "flex-1")}>
          <span className="block truncate text-sm font-medium">{title}</span>
          {description && (
            <span className="block truncate text-xs text-muted-foreground">{description}</span>
          )}
        </span>
        {badge && (
          <Badge variant="outline" className="pointer-events-none shrink-0">
            {badge}
          </Badge>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handle(e.target.files)
          e.target.value = "" // allow re-selecting the same file
        }}
      />
    </>
  )
}

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
