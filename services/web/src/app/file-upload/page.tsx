"use client";

import NodeSection from "$src/app/file-upload/components/node-section";
import HorizontalDivider from "$src/app/components/horizontal-divider";
import { useGetFolderStructureQuery } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";
import { folderStructureArgs } from "$src/utils/node-helper";
import { Stack } from "@mui/material";
import { selectFilesAndFolders } from "$src/store/folderNav/selectors";
import { messages } from "$src/i18n/messages";
import { getErrorMessage } from "$src/utils/general-helper";

export default function FileUploadPage() {
  const currentFolderId = useSelector(selectCurrentFolderId);
  const { files, folders } = useSelector(selectFilesAndFolders);

  const { isLoading, isError, error } = useGetFolderStructureQuery(
    folderStructureArgs(currentFolderId),
  );

  if (isError)
    return (
      <Stack>{`${messages.FileUpload.errorPrefix} ${getErrorMessage(error)}`}</Stack>
    );
  if (isLoading) return <Stack>{messages.FileUpload.loadingStatus}</Stack>;

  return (
    <Stack className="bg-company min-h-screen text-white p-8 flex flex-col gap-7">
      <NodeSection isFolderNodeSection nodes={folders} />
      <HorizontalDivider />
      <NodeSection nodes={files} />
    </Stack>
  );
}
