"use client";

import { useGetFolderStructureQuery } from "@/store/nodesApi/nodesApiSlice";

export function FolderStructureDiv() {
  const { data, isLoading, isError } = useGetFolderStructureQuery({
    depth: 1,
    rootId: null,
  });

  // Print
  console.log(data);

  return (
    <div>
      <h1>Endpoint: /nodes/structure</h1>
      <br/>
      <div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}

export default function ReduxTesting() {
  return (
    <>
      <FolderStructureDiv />
    </>
  );
}
