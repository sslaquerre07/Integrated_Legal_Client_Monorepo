"use client";

import Section from "$src/app/components/section/section";
import HorizontalDivider from "$src/app/components/divider/horizontal-divider";
import {parseFoldersAndFilesFromParentId} from "@/app/utils/node-helper";
import {useGetFolderStructureQuery} from "@/store/nodesApi/nodesApiSlice";
import {useSelector} from "react-redux";
import {getCurrentNode} from "@/store/nodeHistory/nodeHistorySlice";

export default function FileUploadPage() {
  const curr_id = useSelector(getCurrentNode)?.id;

  const {data, isLoading} = useGetFolderStructureQuery({
    rootId: curr_id || undefined,
    depth: 2,
  });

  if (isLoading || !data) {
    return <div>Loading..</div>;
  }

  const {files, folders} = parseFoldersAndFilesFromParentId(
    data!.entities,
    curr_id,
  );

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <Section isFolderSection nodes={folders} />

        <HorizontalDivider />

        <Section nodes={files} />
      </div>
    </main>
  );
}
