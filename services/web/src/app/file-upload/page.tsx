"use client";

import NodeSection from "$src/app/file-upload/components/node-section";
import HorizontalDivider from "$src/app/components/horizontal-divider";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";
import { folderStructureArgs } from "$src/utils/node-helper";
import { Stack } from "@mui/material";
import { selectFilesAndFolders } from "$src/store/folderNav/selectors";

export default function FileUploadPage() {
  const currentFolderId = useSelector(selectCurrentFolderId);
  const { files, folders } = useSelector(selectFilesAndFolders);

  const { isLoading, isError } = useGetFolderStructureQuery(
    folderStructureArgs(currentFolderId),
  );

  if (isLoading) {
    return <Stack>Loading..</Stack>;
  }

  if (isError) {
    return <Stack>An error occured trying to load this folder</Stack>;
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
