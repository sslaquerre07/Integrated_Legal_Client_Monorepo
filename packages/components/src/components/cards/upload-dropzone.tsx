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