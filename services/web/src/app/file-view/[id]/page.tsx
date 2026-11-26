"use client";

import { Stack } from "@mui/material";
import BackButton from "$src/app/components/back-button";
import { use } from "react";
import { useGetFileContentQuery } from "$src/store/nodesApi/nodesApiSlice";
import { getErrorMessage } from "$src/utils/general-helper";

type FileViewPageProps = {
  params: Promise<{ id: string }>;
};

export default function FileViewPage({ params }: FileViewPageProps) {
  const { id: fileId } = use(params);
  const { isError, error, isLoading } = useGetFileContentQuery({ id: fileId });

  return (
    <Stack className="bg-company min-h-screen text-white p-8 flex flex-col gap-7">
      <BackButton />
      <p>Placeholder page for {fileId}</p>
      {isError ? (
        <p>An Error occured: {getErrorMessage(error)}</p>
      ) : isLoading ? (
        <p>Loading file status...</p>
      ) : <p>Your file exists!</p>}
    </Stack>
  );
}
