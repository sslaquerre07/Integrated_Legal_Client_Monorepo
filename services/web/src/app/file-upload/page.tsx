"use client";

import Section from "$src/app/components/section/section";
import HorizontalDivider from "$src/app/components/divider/horizontal-divider";
import { parseFoldersAndFilesFromParentId } from "@/app/utils/node-helper";
import { useGetFolderStructureQuery } from "@/store/nodesApi/nodesApiSlice";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { setCurrentId } from '$src/store'

export default function FileUploadPage() {
  const curr_id = useSelector((state: RootState) => state.currentId.value);

  // Logging data
  console.log(curr_id);

  const { data, isLoading } = useGetFolderStructureQuery({
    rootId: curr_id || undefined,
    depth: 2,
  });

  // const folders, files = parseFoldersAndFilesFromParentId();
  if (isLoading) {
    return <div>Loading..</div>;
  }

  const { files, folders } = parseFoldersAndFilesFromParentId(data!.entities);

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <Section isFolderSection nodes={folders} />

        <HorizontalDivider />

        <Section nodes={files} />

        {/* <Section section_label={SECTION_NAME_2} files={FILES2} /> */}
      </div>
    </main>
  );
}
