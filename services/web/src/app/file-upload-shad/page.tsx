"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, SearchIcon, Upload } from "lucide-react";
import NewFolderDialog from "@repo/ui/components/modals/new-folder-dialog";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";

import { FileBrowser } from "@/components/page_sections/file-browser";
import { UploadDropzone } from "@repo/ui/components/cards/upload-dropzone";

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
  Row,
} from "@repo/ui/components/layout_components/layout";

import {
  useNodesControllerCreateFolderMutation,
  useNodesControllerGetFolderStructureQuery,
  type FolderStructureDto,
  type ResponseNodeDto,
} from "@/store/api/nodesApi.generated";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** Everything the page can ask for. Each one becomes a dispatch later. */
export type PageActions = {
  openFolder: (folder: ResponseNodeDto) => void;
  openFile: (file: ResponseNodeDto) => void;
  downloadFile: (file: ResponseNodeDto) => void;
  deleteFolder: (folder: ResponseNodeDto) => void;
  deleteFile: (file: ResponseNodeDto) => void;
  uploadFiles: (files: File[]) => void;
  createFolder: (name: string) => Promise<void>;
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
  createFolder: async () => {},
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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

export default function FileUploadShadPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { folder: folderId } = use(searchParams); // undefined at the top level

  const [createFolder] = useNodesControllerCreateFolderMutation();

  const actions: PageActions = {
    ...NOOP_ACTIONS,
    openFolder: (folder) => router.push(`?folder=${folder.id}`),
    createFolder: async (name) => {
      await createFolder({
        createFolderDto: { name, parentId: folderId },
      }).unwrap();
    },
  };

  const { currentData, isFetching, isError } =
    useNodesControllerGetFolderStructureQuery({
      depth: 2,
      rootId: folderId,
    });
  const isFirstLoad = !currentData && isFetching;
  const { folders: myFolders, files: myFiles } = splitFolder(
    currentData,
    folderId,
  );

  // Nodes don't record who uploaded them yet, so the lawyer tab stays empty for now
  const lawyerFolders: ResponseNodeDto[] = [];
  const lawyerFiles: ResponseNodeDto[] = [];

  const router = useRouter();

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
          {/* ---------- Shared files ---------- */}
          {/* Uncontrolled: Radix tracks the active tab, so the page holds no state */}
          <Tabs defaultValue="mine" className="gap-6">
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
                  Files you&apos;ve shared with your legal team.
                </p>
                <Row gap={2}>
                  <NewFolderDialog onCreate={actions.createFolder} />
                  <UploadButton onFiles={actions.uploadFiles} />
                </Row>
              </Row>

              {isFirstLoad ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : isError ? (
                <p className="text-sm text-destructive">
                  Couldn&apos;t load your files
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
/* Sections                                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

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
