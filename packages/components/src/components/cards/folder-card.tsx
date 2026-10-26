"use client";

import {
  EllipsisVertical,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { cn } from "@repo/ui/lib/utils";

interface FolderCardProps {
  name: string;
  /** Each action only appears in the menu when its handler is passed,
   *  so a read-only folder just gets onOpen. */
  onOpen?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function FolderCard({
  name,
  onOpen,
  onRename,
  onDelete,
  className,
}: FolderCardProps) {
  const hasMenu = Boolean(onOpen || onRename || onDelete);
  const hasSafeActions = Boolean(onOpen || onRename);

  return (
    <div
      className={cn(
        "group relative flex h-12 min-w-0 items-center gap-3 rounded-xl bg-muted/50 pl-4 pr-1 transition-colors hover:bg-muted",
        className,
      )}
    >
      {/* Whole-card click target. It sits under the menu button, so the
          menu never accidentally opens the folder (no stopPropagation needed). */}
      <button
        type="button"
        onClick={onOpen}
        title={name}
        aria-label={`Open folder ${name}`}
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/* fill-current turns lucide's outline folder into a solid one, like Drive */}
      <Folder className="size-5 shrink-0 fill-current text-muted-foreground" />

      <span className="flex-1 truncate text-sm font-medium">{name}</span>

      {hasMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`More actions for ${name}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative z-10 size-8 shrink-0 rounded-full text-muted-foreground",
            )}
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {onOpen && (
              <DropdownMenuItem onClick={onOpen}>
                <FolderOpen /> Open
              </DropdownMenuItem>
            )}
            {onRename && (
              <DropdownMenuItem onClick={onRename}>
                <Pencil /> Rename
              </DropdownMenuItem>
            )}
            {onDelete && hasSafeActions && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
