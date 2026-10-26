"use client";

/*
 * Demo only: hardcoded data, nothing wired up.
 * Shows how lawyer documents could display their review status.
 */

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  EllipsisVertical,
  Eye,
  FileText,
  Folder,
  SearchIcon,
  Upload,
} from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
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
} from "@repo/ui/components/layout_components/layout";
import { cn } from "@repo/ui/lib/utils";

/* ------------------------------------------------------------------ */
/* The three states                                                    */
/* ------------------------------------------------------------------ */

type Status = "in_progress" | "in_review" | "approved";

const STATUS: Record<Status, { label: string; dot: string; text: string }> = {
  // Lawyer is still working on this version: nothing for the client to do
  in_progress: {
    label: "In progress",
    dot: "bg-zinc-400",
    text: "text-muted-foreground",
  },
  // New version uploaded: the client's turn (the only state that gets extra emphasis)
  in_review: {
    label: "Ready for your review",
    dot: "bg-orange-500 ring-[3px] ring-orange-500/25",
    text: "font-medium text-orange-600 dark:text-orange-400",
  },
  // Client approved this version
  approved: {
    label: "Approved by you",
    dot: "bg-emerald-500",
    text: "text-muted-foreground",
  },
};

function StatusDot({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2 shrink-0 rounded-full",
        STATUS[status].dot,
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Hardcoded data                                                      */
/* ------------------------------------------------------------------ */

const PROJECT = { client: "Betty Gaming", name: "Incorporation" };

/** Folders show the most urgent state inside them: review, then in progress, then approved. */
const LAWYER_FOLDERS: {
  id: string;
  name: string;
  status: Status;
  toReview?: number;
}[] = [
  { id: "f1", name: "Minute Book", status: "in_review", toReview: 1 },
  { id: "f2", name: "Share Issuances", status: "approved" },
  { id: "f3", name: "Closing Documents", status: "in_progress" },
];

/** `date` is when the file entered its current state (uploaded, approved, or started) */
const LAWYER_FILES: {
  id: string;
  name: string;
  status: Status;
  version: number;
  date: string;
}[] = [
  {
    id: "d1",
    name: "Shareholders' Agreement.pdf",
    status: "in_review",
    version: 2,
    date: "Jul 15",
  },
  {
    id: "d2",
    name: "Share Subscription Agreement.pdf",
    status: "in_review",
    version: 3,
    date: "Jul 14",
  },
  {
    id: "d3",
    name: "Director Consents.pdf",
    status: "in_progress",
    version: 2,
    date: "Jul 16",
  },
  {
    id: "d4",
    name: "Articles of Incorporation.pdf",
    status: "approved",
    version: 1,
    date: "Jul 12",
  },
  {
    id: "d5",
    name: "Organizational Resolutions.pdf",
    status: "approved",
    version: 2,
    date: "Jul 13",
  },
  {
    id: "d6",
    name: "Securities Register.pdf",
    status: "in_progress",
    version: 1,
    date: "Jul 16",
  },
];

/** Everything waiting on the client, including documents inside folders */
const TO_REVIEW =
  LAWYER_FILES.filter((file) => file.status === "in_review").length +
  LAWYER_FOLDERS.reduce((sum, folder) => sum + (folder.toReview ?? 0), 0);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LawyerDocsViewPage() {
  const router = useRouter();

  return (
    <div className="min-h-svh bg-background">
      {/* ---------- Top bar: back, project, search ---------- */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <Container>
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
                {PROJECT.client}
              </p>
              <h1 className="truncate text-base leading-tight font-semibold">
                {PROJECT.name}
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
        <Tabs defaultValue="lawyer" className="gap-6">
          <TabsList>
            <TabsTrigger value="lawyer">
              From your lawyer <ReviewCount n={TO_REVIEW} />
            </TabsTrigger>
            <TabsTrigger value="mine">
              Your uploads <Count n={0} />
            </TabsTrigger>
          </TabsList>

          {/* ---------- Lawyer documents, with status ---------- */}
          <TabsContent value="lawyer" className="flex flex-col gap-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="size-4 shrink-0" />
              Shared by your legal team. Documents with an orange dot need your
              approval.
            </p>

            <Column gap={8}>
              <GridSection title="Folders">
                {LAWYER_FOLDERS.map((folder) => (
                  <StatusFolderCard key={folder.id} {...folder} />
                ))}
              </GridSection>

              <GridSection title="Files">
                {LAWYER_FILES.map((file) => (
                  <StatusFileCard key={file.id} {...file} />
                ))}
              </GridSection>
            </Column>
          </TabsContent>

          {/* ---------- Client uploads: empty for this demo ---------- */}
          <TabsContent value="mine" className="flex flex-col gap-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="size-4 shrink-0" />
              Files you&apos;ve shared with your legal team.
            </p>
            <p className="text-sm text-muted-foreground">No files yet.</p>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards: same look as FolderCard / FileCard, plus a status line       */
/* ------------------------------------------------------------------ */

function StatusFolderCard({
  name,
  status,
  toReview,
}: {
  name: string;
  status: Status;
  toReview?: number;
}) {
  const note =
    status === "in_review"
      ? `${toReview ?? 0} to review`
      : status === "approved"
        ? "All approved"
        : "In progress";

  return (
    <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-xl bg-muted/50 py-1.5 pl-4 pr-1">
      <Folder className="size-5 shrink-0 fill-current text-muted-foreground" />
      {/* Name and status stacked, like the file cards, so long names don't get cut off */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={name}>
          {name}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 truncate text-xs",
            STATUS[status].text,
          )}
        >
          <StatusDot status={status} />
          {note}
        </p>
      </div>
      <MenuPlaceholder />
    </div>
  );
}

function StatusFileCard({
  name,
  status,
  version,
  date,
}: {
  name: string;
  status: Status;
  version: number;
  date: string;
}) {
  const s = STATUS[status];

  return (
    // Same shape as the folder card: icon, name + status, menu
    <div
      // Full details on hover, since the status line only has room for the essentials
      title={`${name}\n${s.label} · v${version} · ${date}`}
      className={cn(
        "flex min-h-14 min-w-0 items-center gap-3 rounded-xl bg-muted/50 py-1.5 pl-4 pr-1",
        status === "in_review" && "ring-1 ring-orange-500/50",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white",
          status === "in_progress" && "opacity-40", // not ready yet
        )}
      >
        <FileText className="size-3.5" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="flex items-center gap-1.5 truncate text-xs">
          <StatusDot status={status} />
          <span className={s.text}>{s.label}</span>
          <span className="text-muted-foreground">· v{version}</span>
        </p>
      </div>
      <MenuPlaceholder />
    </div>
  );
}

/** Looks like the card's ⋮ button, but does nothing yet. */
function MenuPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center text-muted-foreground"
    >
      <EllipsisVertical className="size-4" />
    </span>
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
  children: React.ReactNode;
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

/** Tab count that only appears when something is waiting on the client. */
function ReviewCount({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-1.5 text-xs font-medium text-orange-600 tabular-nums dark:text-orange-400">
      <StatusDot status="in_review" className="size-1.5 ring-0" />
      {n} to review
    </span>
  );
}
