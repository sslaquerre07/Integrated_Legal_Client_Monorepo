"use client";

import NodeSection from "$src/app/file-upload/components/node-section";
import HorizontalDivider from "$src/app/components/horizontal-divider";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import {
  selectCurrentId,
  selectFilesAndFolders,
} from "$src/store/folderNav/folderNavSlice";

export default function FileUploadPage() {
  const currentFolderId = useSelector(selectCurrentId);
  const { files, folders } = useSelector(selectFilesAndFolders);

  const { isLoading, isError } = useGetFolderStructureQuery(
    { rootId: currentFolderId ?? undefined, depth: 2 },
    { refetchOnMountOrArgChange: true },
  );

  if (isLoading) {
    return <div>Loading..</div>;
  }

  if (isError) {
    return <div>An error occured trying to load this folder</div>;
  }

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <NodeSection isFolderNodeSection nodes={folders} />
        <HorizontalDivider />
        <NodeSection nodes={files} />
      </div>
    </main>
  );
}
