"use client";

import Section from "$src/app/file-upload/components/node-section";
import HorizontalDivider from "$src/app/components/horizontal-divider";
import { parseFoldersAndFilesFromParentId } from "$src/utils/node-helper";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import { getCurrentFolderId, getEntities } from "$src/store/folderStructureSlice/FolderStructureSlice";

export default function FileUploadPage() {

  const currentFolderId = useSelector(getCurrentFolderId);
  const entities = useSelector(getEntities);

  const { isLoading } = useGetFolderStructureQuery(
    { rootId: currentFolderId ?? undefined, depth: 2 },
    { refetchOnMountOrArgChange: true },
  );

  if (isLoading) {
    return <div>Loading..</div>;
  }

  const { files, folders } = parseFoldersAndFilesFromParentId(
    entities,
    currentFolderId || undefined,
  );

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <Section isFolderNodeSection nodes={folders} />

        <HorizontalDivider />

        <Section nodes={files} />
      </div>
    </main>
  );
}
