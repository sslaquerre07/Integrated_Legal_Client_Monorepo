"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, FolderPlus, SearchIcon, Upload } from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Column,
  Container,
  Expanded,
  Grid,
  Row,
} from "@repo/ui/components/layout";
import { FileCard } from "@repo/ui/components/file-card";
import { FolderCard } from "@repo/ui/components/folder-card";
import {
  RequestedUploadCard,
  UploadDropzone,
} from "@repo/ui/components/upload-dropzone";
import {
  useNodesControllerGetFolderStructureQuery,
  type FolderStructureDto,
  type ResponseNodeDto,
} from "@/store/api/nodesApi.generated";

/* ------------------------------------------------------------------ */
/* Types (move these next to your Redux slice when you wire it up)     */
/* ------------------------------------------------------------------ */

type Project = { client: string; name: string };

type DocRequest = {
  id: string;
  title: string;
  description: string;
  accept?: string;
  /** Set once the client has uploaded something for this request */
  fileName?: string;
};

/** Everything the page can ask for. Each one becomes a dispatch later. */
type PageActions = {
  openFolder: (folder: ResponseNodeDto) => void;
  openFile: (file: ResponseNodeDto) => void;
  downloadFile: (file: ResponseNodeDto) => void;
  deleteFolder: (folder: ResponseNodeDto) => void;
  deleteFile: (file: ResponseNodeDto) => void;
  uploadFiles: (files: File[]) => void;
  createFolder: (name: string) => void;
  uploadRequested: (request: DocRequest, file: File) => void;
  viewRequested: (request: DocRequest) => void;
  removeRequested: (request: DocRequest) => void;
};

/* ------------------------------------------------------------------ */
/* Actions: all no-ops for now, replace with dispatch(...)             */
/* ------------------------------------------------------------------ */

const noop = () => {};

const NOOP_ACTIONS: PageActions = {
  openFolder: noop,
  openFile: noop,
  downloadFile: noop,
  deleteFolder: noop,
  deleteFile: noop,
  uploadFiles: noop,
  createFolder: noop,
  uploadRequested: noop,
  viewRequested: noop,
  removeRequested: noop,
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const formatDate = (iso: string) => dateFormat.format(new Date(iso));
/** Items directly inside `folderId`, or at the top level when there's none. */
function splitFolder(data: FolderStructureDto | undefined, folderId?: string) {
  const items = Object.values(data?.entities ?? {})
    .filter((node) => (node.parentId ?? null) === (folderId ?? null))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    folders: items.filter((node) => node.isFolder),
    files: items.filter((node) => !node.isFolder),
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FileUploadShadPage() {
  const { data, isLoading, isError } =
    useNodesControllerGetFolderStructureQuery({ depth: 1 });
  const { folders: myFolders, files: myFiles } = splitFolder(data);

  // Nodes don't record who uploaded them yet, so the lawyer tab stays empty for now
  const lawyerFolders: ResponseNodeDto[] = [];
  const lawyerFiles: ResponseNodeDto[] = [];

  const router = useRouter();

  // TODO(redux): swap each of these for a useSelector
  // const project = MOCK_PROJECT;
  // const requests = MOCK_REQUESTS;

  // TODO(redux): build this from useDispatch
  const actions = NOOP_ACTIONS;

  return (
    <div className="min-h-svh bg-background">
      {/* ---------- Top bar: back, breadcrumb, search ---------- */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <Container>
          {/* On phones the search wraps onto its own full-width row */}
          <Row
            wrap
            gap={3}
            className="gap-y-2 py-3 sm:h-16 sm:flex-nowrap sm:py-0"
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back"
              onClick={() => router.back()}
            >
              <ArrowLeft />
            </Button>

            <Expanded>
              <p className="truncate text-xs text-muted-foreground">
                Client Name
              </p>
              <h1 className="truncate text-base leading-tight font-semibold">
                Project Name
              </h1>
            </Expanded>

            <InputGroup className="w-full sm:w-72 sm:shrink-0">
              <InputGroupInput
                type="search"
                placeholder="Search projects"
                aria-label="Search projects"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </Row>
        </Container>
      </header>

      <Container as="main" className="py-8">
        <Column gap={10}>
          {/* ---------- Action items first ---------- */}
          <RequestedDocuments requests={[]} actions={actions} />

          {/* ---------- Shared files ---------- */}
          {/* Uncontrolled: Radix tracks the active tab, so the page holds no state */}
          <Tabs defaultValue="lawyer" className="gap-6">
            <TabsList>
              <TabsTrigger value="lawyer">
                From your lawyer{" "}
                <Count n={lawyerFolders.length + lawyerFiles.length} />
              </TabsTrigger>
              <TabsTrigger value="mine">
                Your uploads <Count n={myFolders.length + myFiles.length} />
              </TabsTrigger>
            </TabsList>

            {/* Lawyer: view + download only */}
            <TabsContent value="lawyer" className="flex flex-col gap-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="size-4 shrink-0" />
                Shared by your legal team. You can view and download these
                files.
              </p>
              <FileBrowser
                folders={lawyerFolders}
                files={lawyerFiles}
                actions={actions}
              />
            </TabsContent>

            {/* Client: full control */}
            <TabsContent value="mine" className="flex flex-col gap-6">
              <Row wrap gap={3} justify="between">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="size-4 shrink-0" />
                  Files you've shared with your legal team.
                </p>
                <Row gap={2}>
                  <NewFolderDialog onCreate={actions.createFolder} />
                  <UploadButton onFiles={actions.uploadFiles} />
                </Row>
              </Row>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : isError ? (
                <p className="text-sm text-destructive">
                  Couldn't load your files
                </p>
              ) : (
                <FileBrowser
                  folders={myFolders}
                  files={myFiles}
                  actions={actions}
                  editable
                >
                  <UploadDropzone
                    orientation="vertical"
                    multiple
                    title="Add files"
                    description="Drag & drop or click to browse"
                    onFiles={actions.uploadFiles}
                    className="min-h-40"
                  />
                </FileBrowser>
              )}
            </TabsContent>
          </Tabs>
        </Column>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function RequestedDocuments({
  requests,
  actions,
}: {
  requests: DocRequest[];
  actions: PageActions;
}) {
  if (requests.length === 0) return null;

  const doneCount = requests.filter((r) => r.fileName).length;
  const allDone = doneCount === requests.length;

  return (
    <Column as="section" gap={4}>
      <Row wrap gap={2} justify="between" align="end">
        <Column gap={1}>
          <h2 className="text-lg font-semibold">Requested from you</h2>
          <p className="text-sm text-muted-foreground">
            Your lawyer needs these documents to move forward.
          </p>
        </Column>
        <Badge
          variant={allDone ? "default" : "secondary"}
          className="tabular-nums"
        >
          {doneCount} of {requests.length} done
        </Badge>
      </Row>

      <Grid cols={{ md: 2 }} gap={3}>
        {requests.map((request) => (
          <RequestedUploadCard
            key={request.id}
            title={request.title}
            description={request.description}
            accept={request.accept}
            fileName={request.fileName}
            onUpload={(file) => actions.uploadRequested(request, file)}
            onView={
              request.fileName
                ? () => actions.viewRequested(request)
                : undefined
            }
            onRemove={() => actions.removeRequested(request)}
          />
        ))}
      </Grid>
    </Column>
  );
}

/** Folders then files, Drive-style. `editable` adds Delete to the menus. */
function FileBrowser({
  folders,
  files,
  actions,
  editable = false,
  children,
}: {
  folders: ResponseNodeDto[];
  files: ResponseNodeDto[];
  actions: PageActions;
  editable?: boolean;
  /** Extra tiles after the files, e.g. an upload dropzone */
  children?: ReactNode;
}) {
  return (
    <Column gap={8}>
      {folders.length > 0 && (
        <GridSection title="Folders">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              name={folder.name}
              onOpen={() => actions.openFolder(folder)}
              onDelete={
                editable ? () => actions.deleteFolder(folder) : undefined
              }
            />
          ))}
        </GridSection>
      )}

      {files.length === 0 && !children ? (
        <p className="text-sm text-muted-foreground">No files yet.</p>
      ) : (
        <GridSection title="Files">
          {files.map((file) => (
            <FileCard
              key={file.id}
              name={file.name}
              meta={formatDate(file.updatedAt)}
              onOpen={() => actions.openFile(file)}
              onDownload={() => actions.downloadFile(file)}
              onDelete={editable ? () => actions.deleteFile(file) : undefined}
            />
          ))}
          {children}
        </GridSection>
      )}
    </Column>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function GridSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Column as="section" gap={3}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Grid cols={{ sm: 2, lg: 3, xl: 4 }} gap={3}>
        {children}
      </Grid>
    </Column>
  );
}

function Count({ n }: { n: number }) {
  return (
    <Badge
      variant="secondary"
      className="h-5 min-w-5 rounded-full px-1.5 tabular-nums"
    >
      {n}
    </Badge>
  );
}

/** A label styled as a button: clicking it opens the file picker, no ref needed. */
function UploadButton({ onFiles }: { onFiles: (files: File[]) => void }) {
  return (
    <label
      className={buttonVariants({
        size: "sm",
        // labels can't take focus, so show the ring when the hidden input has it
        className:
          "cursor-pointer focus-within:ring-[3px] focus-within:ring-ring/50",
      })}
    >
      <Upload /> Upload
      <input
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </label>
  );
}

/**
 * Uncontrolled dialog: DialogTrigger / DialogClose open and close it, so no state here.
 * Create doesn't close it yet. When you wire Redux, either pass `open` / `onOpenChange`
 * from your store, or wrap the Create button in <DialogClose asChild>.
 */
function NewFolderDialog({ onCreate }: { onCreate: (name: string) => void }) {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <FolderPlus /> New folder
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const name = String(
              new FormData(e.currentTarget).get("name") ?? "",
            ).trim();
            if (name) onCreate(name);
          }}
        >
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              Group related documents before sharing them with your lawyer.
            </DialogDescription>
          </DialogHeader>
          <Input
            name="name"
            required
            autoFocus
            placeholder="Untitled folder"
            aria-label="Folder name"
          />
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: "outline" })}>
              Cancel
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
