// HARDCODED for demonstraation
"use client"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Scale,
  SearchIcon,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu"
import { Input } from "@repo/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group"
import { Column, Expanded, Row } from "@repo/ui/components/layout"
import { cn } from "@repo/ui/lib/utils"

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* Same shape as the API's ResponseNodeDto, so swapping in the RTK     */
/* Query hooks later is mostly a matter of replacing these arrays.     */
/* ------------------------------------------------------------------ */

type Side = "mine" | "lawyer"

type DocNode = {
  id: string
  name: string
  isFolder: boolean
  parentId: string | null
  updatedAt: string
  /** Demo only: file size in bytes */
  size?: number
  /** Demo only: blob URL for PDFs uploaded in this session.
   *  In the real app this is `${API_URL}/nodes/file/${id}`. */
  url?: string
}

const PROJECT = { client: "Betty Gaming", name: "Incorporation" }

const MY_DOCS: DocNode[] = [
  { id: "m-ids", name: "Shareholder IDs", isFolder: true, parentId: null, updatedAt: "2026-07-11T15:20:00Z" },
  { id: "m-1", name: "Passport - Betty Lin.pdf", isFolder: false, parentId: "m-ids", updatedAt: "2026-07-11T15:21:00Z", size: 1_284_000 },
  { id: "m-2", name: "Driver's Licence - Sam Ortiz.pdf", isFolder: false, parentId: "m-ids", updatedAt: "2026-07-11T15:24:00Z", size: 912_000 },
  { id: "m-3", name: "Business Details.pdf", isFolder: false, parentId: null, updatedAt: "2026-07-12T09:02:00Z", size: 248_000 },
  { id: "m-4", name: "Signed NDA.pdf", isFolder: false, parentId: null, updatedAt: "2026-07-12T10:45:00Z", size: 391_000 },
]

const LAWYER_DOCS: DocNode[] = [
  { id: "l-mb", name: "Minute Book", isFolder: true, parentId: null, updatedAt: "2026-07-12T16:00:00Z" },
  { id: "l-1", name: "Articles of Incorporation.pdf", isFolder: false, parentId: "l-mb", updatedAt: "2026-07-12T16:01:00Z", size: 530_000 },
  { id: "l-2", name: "By-law No. 1.pdf", isFolder: false, parentId: "l-mb", updatedAt: "2026-07-12T16:03:00Z", size: 1_020_000 },
  { id: "l-3", name: "Organizational Resolutions.pdf", isFolder: false, parentId: "l-mb", updatedAt: "2026-07-12T16:05:00Z", size: 410_000 },
  { id: "l-sh", name: "Share Issuances", isFolder: true, parentId: null, updatedAt: "2026-07-14T11:00:00Z" },
  { id: "l-4", name: "Securities Register.pdf", isFolder: false, parentId: "l-sh", updatedAt: "2026-07-14T11:02:00Z", size: 205_000 },
  { id: "l-5", name: "Share Certificate - Common 1.pdf", isFolder: false, parentId: "l-sh", updatedAt: "2026-07-14T11:04:00Z", size: 160_000 },
  { id: "l-6", name: "Shareholders' Agreement.pdf", isFolder: false, parentId: null, updatedAt: "2026-07-15T13:30:00Z", size: 2_340_000 },
  { id: "l-7", name: "Director Consents.pdf", isFolder: false, parentId: null, updatedAt: "2026-07-15T13:40:00Z", size: 188_000 },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })
const formatDate = (iso: string) => dateFormat.format(new Date(iso))

function formatSize(bytes?: number) {
  if (bytes == null) return null
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Direct children of a folder (or the top level): folders first, then A–Z. */
function childrenOf(docs: DocNode[], parentId: string | null) {
  return docs
    .filter((node) => node.parentId === parentId)
    .sort((a, b) => Number(b.isFolder) - Number(a.isFolder) || a.name.localeCompare(b.name))
}

/** The folders above a node, top-down, for the breadcrumb. */
function pathOf(docs: DocNode[], node: DocNode) {
  const path: DocNode[] = []
  let parentId = node.parentId
  while (parentId) {
    const parent = docs.find((n) => n.id === parentId)
    if (!parent) break
    path.unshift(parent)
    parentId = parent.parentId
  }
  return path
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FileUploadTwoColumnPage() {
  const router = useRouter()

  // Which side panel is showing; null = collapsed (click the active icon to toggle)
  const [panel, setPanel] = useState<Side | null>("mine")
  const [myDocs, setMyDocs] = useState(MY_DOCS)
  const [expanded, setExpanded] = useState(() => new Set(["m-ids", "l-mb"]))
  // Highlighted row in the tree (also decides where new folders/uploads go)
  const [selectedId, setSelectedId] = useState<string | null>("m-4")
  // Document shown in the viewer
  const [openDoc, setOpenDoc] = useState<{ side: Side; id: string } | null>({ side: "mine", id: "m-4" })

  const docsFor = (side: Side) => (side === "mine" ? myDocs : LAWYER_DOCS)
  const openNode = openDoc ? docsFor(openDoc.side).find((n) => n.id === openDoc.id) : undefined

  // New folders and uploads go into the selected folder, or the selected file's folder
  const selectedMine = myDocs.find((n) => n.id === selectedId)
  const targetFolderId = selectedMine
    ? selectedMine.isFolder
      ? selectedMine.id
      : selectedMine.parentId
    : null
  const targetFolder = myDocs.find((n) => n.id === targetFolderId)

  function togglePanel(side: Side) {
    setPanel((current) => (current === side ? null : side))
  }

  function expand(id: string | null) {
    if (id) setExpanded((prev) => new Set(prev).add(id))
  }

  function toggleFolder(node: DocNode) {
    setSelectedId(node.id)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(node.id)) next.delete(node.id)
      else next.add(node.id)
      return next
    })
  }

  function openFile(side: Side, node: DocNode) {
    setSelectedId(node.id)
    setOpenDoc({ side, id: node.id })
    // On phones the panel covers the document, so get it out of the way
    if (window.matchMedia("(max-width: 767px)").matches) setPanel(null)
  }

  function createFolder(name: string) {
    const folder: DocNode = {
      id: crypto.randomUUID(),
      name,
      isFolder: true,
      parentId: targetFolderId,
      updatedAt: new Date().toISOString(),
    }
    setMyDocs((prev) => [...prev, folder])
    expand(targetFolderId)
    setSelectedId(folder.id)
  }

  function uploadFiles(files: File[]) {
    const added = files.map(
      (file): DocNode => ({
        id: crypto.randomUUID(),
        name: file.name,
        isFolder: false,
        parentId: targetFolderId,
        updatedAt: new Date().toISOString(),
        size: file.size,
        url: URL.createObjectURL(file), // demo: lets the viewer show the real PDF
      }),
    )
    const [first] = added
    if (!first) return
    setMyDocs((prev) => [...prev, ...added])
    expand(targetFolderId)
    openFile("mine", first)
  }

  function deleteNode(node: DocNode) {
    if (node.url) URL.revokeObjectURL(node.url)
    setMyDocs((prev) => prev.filter((n) => n.id !== node.id))
    if (openDoc?.id === node.id) setOpenDoc(null)
    if (selectedId === node.id) setSelectedId(null)
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      {/* ---------- Top bar: back, project, search ---------- */}
      <header className="shrink-0 border-b">
        <Row gap={3} className="h-14 px-2 sm:px-3">
          <Button variant="ghost" size="icon" aria-label="Back" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          <Expanded>
            <p className="truncate text-xs text-muted-foreground">{PROJECT.client}</p>
            <h1 className="truncate text-sm font-semibold leading-tight">{PROJECT.name}</h1>
          </Expanded>
          <InputGroup className="hidden w-64 sm:flex">
            <InputGroupInput type="search" placeholder="Search projects" aria-label="Search projects" />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </Row>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* ---------- Icon rail ---------- */}
        <nav
          aria-label="Documents"
          className="flex w-14 shrink-0 flex-col items-center gap-1 border-r bg-muted/30 py-2"
        >
          <RailButton
            icon={FolderOpen}
            label="Your documents"
            active={panel === "mine"}
            onClick={() => togglePanel("mine")}
          />
          <RailButton
            icon={Scale}
            label="From your lawyer"
            active={panel === "lawyer"}
            onClick={() => togglePanel("lawyer")}
          />
        </nav>

        {/* ---------- Side panel (overlays the viewer on phones) ---------- */}
        {panel && (
          <aside
            aria-label={panel === "mine" ? "Your documents" : "From your lawyer"}
            className="absolute inset-y-0 left-14 z-20 flex w-72 max-w-[calc(100vw-3.5rem)] flex-col border-r bg-background shadow-xl md:static md:z-auto md:shadow-none"
          >
            {panel === "mine" ? (
              <SidePanel
                title="Your documents"
                subtitle={
                  <>Adding to {targetFolder ? `“${targetFolder.name}”` : "the top level"}</>
                }
                toolbar={
                  <>
                    <NewFolderDialog
                      targetName={targetFolder?.name ?? "the top level"}
                      onCreate={createFolder}
                    />
                    <UploadButton onFiles={uploadFiles} />
                  </>
                }
                docs={myDocs}
                expanded={expanded}
                selectedId={selectedId}
                openId={openDoc?.side === "mine" ? openDoc.id : null}
                onToggleFolder={toggleFolder}
                onOpenFile={(node) => openFile("mine", node)}
                onDelete={deleteNode}
              />
            ) : (
              <SidePanel
                title="From your lawyer"
                subtitle={
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3" /> View only
                  </span>
                }
                docs={LAWYER_DOCS}
                expanded={expanded}
                selectedId={selectedId}
                openId={openDoc?.side === "lawyer" ? openDoc.id : null}
                onToggleFolder={toggleFolder}
                onOpenFile={(node) => openFile("lawyer", node)}
              />
            )}
          </aside>
        )}

        {/* ---------- Document viewer ---------- */}
        <main className="relative min-w-0 flex-1">
          {panel && (
            <button
              type="button"
              aria-label="Close panel"
              className="absolute inset-0 z-10 bg-black/40 md:hidden"
              onClick={() => setPanel(null)}
            />
          )}
          <DocumentViewer
            node={openNode}
            path={openNode && openDoc ? pathOf(docsFor(openDoc.side), openNode) : []}
            editable={openDoc?.side === "mine"}
            onDelete={deleteNode}
            onShowPanel={panel ? undefined : () => setPanel("mine")}
          />
        </main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Icon rail                                                           */
/* ------------------------------------------------------------------ */

function RailButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-accent text-foreground",
      )}
    >
      {/* VS Code-style marker on the rail's edge */}
      {active && (
        <span aria-hidden="true" className="absolute inset-y-1.5 -left-2 w-0.5 rounded-full bg-primary" />
      )}
      <Icon className="size-5" />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Side panel + tree                                                   */
/* ------------------------------------------------------------------ */

type TreeProps = {
  docs: DocNode[]
  expanded: Set<string>
  selectedId: string | null
  openId: string | null
  onToggleFolder: (node: DocNode) => void
  onOpenFile: (node: DocNode) => void
  /** Only passed for your own documents; lawyer documents are view-only */
  onDelete?: (node: DocNode) => void
}

function SidePanel({
  title,
  subtitle,
  toolbar,
  ...tree
}: TreeProps & { title: string; subtitle: ReactNode; toolbar?: ReactNode }) {
  const hasDocs = tree.docs.some((node) => node.parentId === null)

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-1 border-b pl-4 pr-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {toolbar}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {hasDocs ? (
          <TreeLevel {...tree} parentId={null} depth={0} />
        ) : (
          <p className="px-2 py-8 text-center text-sm text-muted-foreground">No documents yet.</p>
        )}
      </div>
    </>
  )
}

function TreeLevel({ parentId, depth, ...tree }: TreeProps & { parentId: string | null; depth: number }) {
  const items = childrenOf(tree.docs, parentId)

  if (items.length === 0) {
    return (
      <p className="py-1 text-xs text-muted-foreground" style={{ paddingLeft: 30 + depth * 16 }}>
        Empty folder
      </p>
    )
  }

  return (
    <ul className="flex flex-col">
      {items.map((node) => (
        <TreeRow key={node.id} node={node} depth={depth} {...tree} />
      ))}
    </ul>
  )
}

function TreeRow({ node, depth, ...tree }: TreeProps & { node: DocNode; depth: number }) {
  const isExpanded = tree.expanded.has(node.id)
  const isSelected = tree.selectedId === node.id
  const isOpen = tree.openId === node.id
  const hasChildren = tree.docs.some((n) => n.parentId === node.id)

  return (
    <li>
      <div
        className={cn(
          "group flex h-8 items-center gap-1 rounded-md pr-1 text-sm transition-colors hover:bg-accent/60",
          isSelected && "bg-accent",
          isOpen && "font-medium",
        )}
      >
        <button
          type="button"
          aria-expanded={node.isFolder ? isExpanded : undefined}
          aria-current={isOpen ? "true" : undefined}
          onClick={() => (node.isFolder ? tree.onToggleFolder(node) : tree.onOpenFile(node))}
          title={node.name}
          style={{ paddingLeft: 8 + depth * 16 }}
          className="flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {node.isFolder ? (
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-90",
              )}
            />
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          {node.isFolder ? (
            isExpanded ? (
              <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Folder className="size-4 shrink-0 fill-current text-muted-foreground" />
            )
          ) : (
            <FileText className="size-4 shrink-0 text-red-500" />
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {tree.onDelete && (
          <RowMenu
            node={node}
            canDelete={!hasChildren}
            onOpen={() => tree.onOpenFile(node)}
            onDelete={() => tree.onDelete?.(node)}
          />
        )}
      </div>

      {node.isFolder && isExpanded && <TreeLevel {...tree} parentId={node.id} depth={depth + 1} />}
    </li>
  )
}

function RowMenu({
  node,
  canDelete,
  onOpen,
  onDelete,
}: {
  node: DocNode
  canDelete: boolean
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      {/* Base UI: the trigger is already a <button>, so style it rather than nesting one */}
      <DropdownMenuTrigger
        aria-label={`More actions for ${node.name}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-7 shrink-0 text-muted-foreground",
          // Desktop: only show on hover/focus. Phones have no hover, so always show.
          "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:data-popup-open:opacity-100",
        )}
      >
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {!node.isFolder && (
          <DropdownMenuItem onClick={onOpen}>
            <Eye /> Open
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" disabled={!canDelete} onClick={onDelete}>
          <Trash2 /> {canDelete ? "Delete" : "Delete (folder not empty)"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ------------------------------------------------------------------ */
/* Panel toolbar                                                       */
/* ------------------------------------------------------------------ */

function NewFolderDialog({
  targetName,
  onCreate,
}: {
  targetName: string
  onCreate: (name: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        title="New folder"
        aria-label="New folder"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
      >
        <FolderPlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const name = String(new FormData(e.currentTarget).get("name") ?? "").trim()
            if (!name) return
            onCreate(name)
            setOpen(false)
          }}
        >
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>It will be created in {targetName}.</DialogDescription>
          </DialogHeader>
          <Input name="name" required autoFocus placeholder="Untitled folder" aria-label="Folder name" />
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: "outline" })}>Cancel</DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** A label styled as an icon button: clicking it opens the file picker. */
function UploadButton({ onFiles }: { onFiles: (files: File[]) => void }) {
  return (
    <label
      title="Upload PDFs"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-8 cursor-pointer focus-within:ring-[3px] focus-within:ring-ring/50",
      )}
    >
      <Upload />
      <span className="sr-only">Upload PDFs</span>
      <input
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files))
          e.target.value = "" // allow picking the same file again
        }}
      />
    </label>
  )
}

/* ------------------------------------------------------------------ */
/* Document viewer                                                     */
/* ------------------------------------------------------------------ */

function DocumentViewer({
  node,
  path,
  editable,
  onDelete,
  onShowPanel,
}: {
  node: DocNode | undefined
  path: DocNode[]
  editable: boolean
  onDelete: (node: DocNode) => void
  /** Shown in the empty state when the side panel is collapsed */
  onShowPanel?: () => void
}) {
  if (!node) {
    return (
      <Column align="center" justify="center" gap={3} className="h-full p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FileText className="size-6 text-muted-foreground" />
        </span>
        <p className="font-medium">No document open</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Pick a document from the side panel to view it here.
        </p>
        {onShowPanel && (
          <Button variant="outline" size="sm" onClick={onShowPanel}>
            Show documents
          </Button>
        )}
      </Column>
    )
  }

  // Second line: folder path, date, size (kept to one line so the toolbar
  // lines up with the side panel header)
  const meta = [
    path.map((folder) => folder.name).join(" / "),
    `Updated ${formatDate(node.updatedAt)}`,
    formatSize(node.size),
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <Column className="h-full">
      <Row gap={2} className="h-14 shrink-0 border-b px-4">
        <Expanded>
          <Row gap={2}>
            <h2 className="truncate text-sm font-semibold" title={node.name}>
              {node.name}
            </h2>
            {!editable && (
              <Badge variant="secondary" className="shrink-0">
                View only
              </Badge>
            )}
          </Row>
          <p className="truncate text-xs text-muted-foreground">{meta}</p>
        </Expanded>
        <Row gap={1}>
          <ViewerLink href={node.url} download={node.name} icon={Download} label="Download" />
          <ViewerLink href={node.url} newTab icon={ExternalLink} label="Open in new tab" />
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              aria-label="Delete"
              onClick={() => onDelete(node)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 />
            </Button>
          )}
        </Row>
      </Row>

      <div className="min-h-0 flex-1 bg-muted/40">
        {node.url ? (
          // The browser's built-in PDF viewer: view only, with its own zoom/print/download
          <iframe key={node.id} src={node.url} title={node.name} className="size-full border-0" />
        ) : (
          <PreviewPlaceholder title={node.name} />
        )}
      </div>
    </Column>
  )
}

function ViewerLink({
  href,
  icon: Icon,
  label,
  download,
  newTab,
}: {
  href?: string
  icon: LucideIcon
  label: string
  download?: string
  newTab?: boolean
}) {
  return (
    <a
      href={href}
      download={download}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      title={label}
      aria-label={label}
      aria-disabled={!href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        !href && "pointer-events-none opacity-40",
      )}
    >
      <Icon />
    </a>
  )
}

/** Demo stand-in for sample documents that have no real PDF behind them. */
function PreviewPlaceholder({ title }: { title: string }) {
  const lines = ["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-10/12", "w-3/5"]
  return (
    <div className="flex size-full justify-center overflow-auto p-4 sm:p-10">
      <div className="h-fit w-full max-w-2xl rounded-sm bg-white p-8 text-zinc-900 shadow-md ring-1 ring-black/5 sm:p-12">
        <p className="text-[11px] uppercase tracking-widest text-zinc-400">Sample document</p>
        <h3 className="mt-2 text-xl font-semibold">{title.replace(/\.pdf$/i, "")}</h3>
        {[0, 1].map((block) => (
          <div key={block} className="mt-8 space-y-3">
            {lines.map((width, i) => (
              <div key={i} className={cn("h-2 rounded bg-zinc-200", width)} />
            ))}
          </div>
        ))}
        <p className="mt-12 text-xs text-zinc-400">
          Demo placeholder. Upload a real PDF from “Your documents” to see it here.
        </p>
      </div>
    </div>
  )
}
