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
import { Expanded } from "./layout";

// pdf: { icon: FileText, bg: "bg-red-500", text: "text-red-500" },

/** The small coloured square badge Drive shows next to file names. */
export function FileTypeIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-lg text-white",
        "bg-red-500",
        className,
      )}
    >
      <FileText className="size-3.5" strokeWidth={2.25} />
    </span>
  );
}

interface FileCardProps {
  name: string;
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
  meta,
  thumbnailUrl,
  onOpen,
  onDownload,
  onRename,
  onDelete,
  className,
}: FileCardProps) {
  const hasMenu = Boolean(onOpen || onDownload || onRename || onDelete);
  const hasSafeActions = Boolean(onOpen || onDownload || onRename);

  // TODO: Temporary thumbnail block
  thumbnailUrl = "";

  return (
    <div
      className={cn(
        "group relative flex min-w-0 flex-col min-h-12 rounded-xl bg-muted/50 px-2 pb-2 transition-colors hover:bg-muted",
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
      <Expanded className="flex min-h-12 items-center gap-x-3 pl-2">
        <FileTypeIcon />
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
      </Expanded>

      {/* Thumbnail (shorter on phones so a list of files doesn't scroll forever) */}
      {thumbnailUrl ? (
        <div className="aspect-2/1 overflow-hidden rounded-lg bg-background sm:aspect-5/4">
          // swap for next/image if you're on Next.js
          <img
            src={thumbnailUrl}
            alt=""
            className="size-full object-cover object-top"
          />
          +
        </div>
      ) : (
        <>{/* Nothing if no thumbnail */}</>
      )}
    </div>
  );
}
