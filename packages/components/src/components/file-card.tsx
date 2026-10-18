"use client"

import {
  Download,
  EllipsisVertical,
  ExternalLink,
  File,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileText,
  Film,
  ImageIcon,
  Music,
  Pencil,
  Presentation,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@repo/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { cn } from "@repo/ui/lib/utils"

export type FileKind =
  | "pdf"
  | "doc"
  | "sheet"
  | "slides"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "other"

// Drive-style colour coding per file type
const FILE_KINDS: Record<FileKind, { icon: LucideIcon; bg: string; text: string }> = {
  pdf:     { icon: FileText,        bg: "bg-red-500",    text: "text-red-500" },
  doc:     { icon: FileText,        bg: "bg-blue-500",   text: "text-blue-500" },
  sheet:   { icon: FileSpreadsheet, bg: "bg-green-600",  text: "text-green-600" },
  slides:  { icon: Presentation,    bg: "bg-amber-500",  text: "text-amber-500" },
  image:   { icon: ImageIcon,       bg: "bg-rose-500",   text: "text-rose-500" },
  video:   { icon: Film,            bg: "bg-red-600",    text: "text-red-600" },
  audio:   { icon: Music,           bg: "bg-violet-500", text: "text-violet-500" },
  archive: { icon: FileArchive,     bg: "bg-zinc-500",   text: "text-zinc-500" },
  code:    { icon: FileCode,        bg: "bg-sky-600",    text: "text-sky-600" },
  other:   { icon: File,            bg: "bg-zinc-500",   text: "text-zinc-500" },
}

/** The small coloured square badge Drive shows next to file names. */
export function FileTypeIcon({ kind, className }: { kind: FileKind; className?: string }) {
  const { icon: Icon, bg } = FILE_KINDS[kind]
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-lg text-white",
        bg,
        className
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.25} />
    </span>
  )
}

interface FileCardProps {
  name: string
  kind?: FileKind
  /** Preview image (e.g. first page of a PDF). Falls back to a large icon. */
  thumbnailUrl?: string
  onOpen?: () => void
  onRename?: () => void
  onDownload?: () => void
  onDelete?: () => void
  className?: string
}

export function FileCard({
  name,
  kind = "other",
  thumbnailUrl,
  onOpen,
  onRename,
  onDownload,
  onDelete,
  className,
}: FileCardProps) {
  const { icon: Icon, text } = FILE_KINDS[kind]

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl bg-muted/50 px-2 pb-2 transition-colors hover:bg-muted",
        className
      )}
    >
      {/* Whole-card click target, under the menu button */}
      <button
        type="button"
        onClick={onOpen}
        title={name}
        aria-label={`Open ${name}`}
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/* Header: type badge, name, kebab menu */}
      <div className="flex h-12 items-center gap-3 pl-2">
        <FileTypeIcon kind={kind} />
        <span className="flex-1 truncate text-sm font-medium">{name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`More actions for ${name}`}
              className="relative z-10 size-8 rounded-full text-muted-foreground"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={onOpen}>
              <ExternalLink /> Open
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDownload}>
              <Download /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 /> Move to trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail */}
      <div className="aspect-5/4 overflow-hidden rounded-lg bg-background">
        {thumbnailUrl ? (
          // swap for next/image if you're on Next.js
          <img src={thumbnailUrl} alt="" className="size-full object-cover object-top" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon className={cn("size-16 opacity-60", text)} strokeWidth={1.25} />
          </div>
        )}
      </div>
    </div>
  )
}
