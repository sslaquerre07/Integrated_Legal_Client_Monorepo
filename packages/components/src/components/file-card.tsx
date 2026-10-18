"use client";

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
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { cn } from "@repo/ui/lib/utils";

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
  | "other";

// Drive-style colour coding per file type
const FILE_KINDS: Record<
  FileKind,
  { icon: LucideIcon; bg: string; text: string }
> = {
  pdf: { icon: FileText, bg: "bg-red-500", text: "text-red-500" },
  doc: { icon: FileText, bg: "bg-blue-500", text: "text-blue-500" },
  sheet: { icon: FileSpreadsheet, bg: "bg-green-600", text: "text-green-600" },
  slides: { icon: Presentation, bg: "bg-amber-500", text: "text-amber-500" },
  image: { icon: ImageIcon, bg: "bg-rose-500", text: "text-rose-500" },
  video: { icon: Film, bg: "bg-red-600", text: "text-red-600" },
  audio: { icon: Music, bg: "bg-violet-500", text: "text-violet-500" },
  archive: { icon: FileArchive, bg: "bg-zinc-500", text: "text-zinc-500" },
  code: { icon: FileCode, bg: "bg-sky-600", text: "text-sky-600" },
  other: { icon: File, bg: "bg-zinc-500", text: "text-zinc-500" },
};

const EXTENSIONS: Partial<Record<FileKind, string[]>> = {
  pdf: ["pdf"],
  doc: ["doc", "docx", "odt", "rtf", "txt", "pages"],
  sheet: ["xls", "xlsx", "csv", "ods", "numbers"],
  slides: ["ppt", "pptx", "odp", "key"],
  image: ["png", "jpg", "jpeg", "gif", "webp", "heic", "svg"],
  video: ["mp4", "mov", "webm", "avi"],
  audio: ["mp3", "wav", "m4a", "ogg"],
  archive: ["zip", "rar", "7z", "tar", "gz"],
  code: ["js", "ts", "tsx", "json", "html", "css", "py"],
};

/** Guess a FileKind from a file name, e.g. "Bylaws.pdf" → "pdf". */
export function getFileKind(fileName: string): FileKind {
  return "pdf";
}

/** The small coloured square badge Drive shows next to file names. */
export function FileTypeIcon({
  kind,
  className,
}: {
  kind: FileKind;
  className?: string;
}) {
  const { icon: Icon, bg } = FILE_KINDS[kind];
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-lg text-white",
        bg,
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.25} />
    </span>
  );
}

interface FileCardProps {
  name: string;
  kind?: FileKind;
  /** Secondary line under the name, e.g. a date or "Shared by Jane". */
  meta?: string;
  /** Preview image (e.g. first page of a PDF). Falls back to a large icon. */
  thumbnailUrl?: string;
  /** Each action only appears in the menu when its handler is passed,
   *  so a read-only file just gets onOpen + onDownload. */
  onOpen?: () => void;
  onDownload?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function FileCard({
  name,
  kind = "other",
  meta,
  thumbnailUrl,
  onOpen,
  onDownload,
  onRename,
  onDelete,
  className,
}: FileCardProps) {
  const { icon: Icon, text } = FILE_KINDS[kind];
  const hasMenu = Boolean(onOpen || onDownload || onRename || onDelete);
  const hasSafeActions = Boolean(onOpen || onDownload || onRename);

  return (
    <div
      className={cn(
        "group relative flex min-w-0 flex-col rounded-xl bg-muted/50 px-2 pb-2 transition-colors hover:bg-muted",
        className,
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

      {/* Header: type badge, name (+ meta), kebab menu */}
      <div className="flex min-h-12 items-center gap-3 py-1.5 pl-2">
        <FileTypeIcon kind={kind} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          {meta && (
            <p className="truncate text-xs text-muted-foreground">{meta}</p>
          )}
        </div>

        {hasMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`More actions for ${name}`}
                className="relative z-10 size-8 shrink-0 rounded-full text-muted-foreground"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {onOpen && (
                <DropdownMenuItem onSelect={onOpen}>
                  <ExternalLink /> Open
                </DropdownMenuItem>
              )}
              {onDownload && (
                <DropdownMenuItem onSelect={onDownload}>
                  <Download /> Download
                </DropdownMenuItem>
              )}
              {onRename && (
                <DropdownMenuItem onSelect={onRename}>
                  <Pencil /> Rename
                </DropdownMenuItem>
              )}
              {onDelete && hasSafeActions && <DropdownMenuSeparator />}
              {onDelete && (
                <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Thumbnail (shorter on phones so a list of files doesn't scroll forever) */}
      <div className="aspect-2/1 overflow-hidden rounded-lg bg-background sm:aspect-5/4">
        {thumbnailUrl ? (
          // swap for next/image if you're on Next.js
          <img
            src={thumbnailUrl}
            alt=""
            className="size-full object-cover object-top"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon
              className={cn("size-16 opacity-60", text)}
              strokeWidth={1.25}
            />
          </div>
        )}
      </div>
    </div>
  );
}
