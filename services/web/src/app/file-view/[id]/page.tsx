"use client";

import { Stack, Typography } from "@mui/material";
import BackButton from "$src/app/components/back-button";
import { use } from "react";
import { useGetFileContentQuery } from "$src/store/nodesApi/nodesApiSlice";
import { getErrorMessage } from "$src/utils/general-helper";
import { messages } from "$src/i18n/messages";

type FileViewPageProps = {
  params: Promise<{ id: string }>;
};

export default function FileViewPage({ params }: FileViewPageProps) {
  const { id: fileId } = use(params);
  const { isError, error, isLoading } = useGetFileContentQuery({ id: fileId });

  const getStatusText = () => {
    if (isError)
      return `${messages.FileView.errorPrefix} ${getErrorMessage(error)}`;
    if (isLoading) return messages.FileView.loadingStatus;
    return messages.FileView.fileExists;
  };

  return (
    <Stack className="bg-company min-h-screen text-white p-8 flex flex-col gap-7">
      <BackButton />
      <Typography>
        {messages.FileView.placeholderPrefix} {fileId}
      </Typography>
      <Typography>{getStatusText()}</Typography>
    </Stack>
  );
}
