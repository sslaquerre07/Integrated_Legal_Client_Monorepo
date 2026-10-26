import { ReactNode } from "react";
import { Column } from "@repo/ui/components/layout_components/layout";
import { FolderCard } from "@repo/ui/components/cards/folder-card";
import { FileCard } from "@repo/ui/components/cards/file-card";
import GridSection from "@repo/ui/components/layout_components/grid-section";
import { formatDate } from "@repo/utils";
import { ResponseNodeDto } from "@/store/api/nodesApi.generated";
import { PageActions } from "@/app/file-upload-shad/page";


/** Folders then files, Drive-style. `editable` adds Delete to the menus. */
export function FileBrowser({
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
