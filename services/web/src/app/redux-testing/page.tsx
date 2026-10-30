"use client"

import { useGetFolderStructureQuery } from "@/store/nodesApi/nodesApiSlice";

export function DoStuff() {
  const { data, isLoading, isError } = useGetFolderStructureQuery({
    depth: 1,
    rootId: null,
  });

  console.log(data);
  return <div>{data?.toString()}</div>;
}

export default function ReduxTesting() {
  return (
    <>
      <div>
        Hello, World!
      </div>
      <DoStuff />
    </>
  );
}
