import ItemCard from "@/app/components/card/item-card";
// import { FileDetail } from "$src/app/constants/types/file-detail";
import AddFileCard from "@/app/components/card/add-file-card";
import CreateFolderButton from "../button/create-folder-button";
// import { useGetFolderStructureQuery } from "@/store/nodesApi/nodesApiSlice";
// import { getRootFolders } from "@/app/utils/note-util";
import { SECTION_NAME_1, SECTION_NAME_2 } from "$src/app/constants/page/file-upload/section-names";
import { NodeDto } from "@repo/types";

type SectionProps = {
  isFolderSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];  
};

// todo: conditionally render files and folders
// todo: so file section will display files on the same level.
// todo: folder sesction will display folders on the same level.
// todo: call newly created function

export default function Section({
  isFolderSection = false,
  nodes,
}: SectionProps) {
  const section_label = isFolderSection ? SECTION_NAME_1 : SECTION_NAME_2;

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white">
          {section_label}
        </span>
        <CreateFolderButton />
      </div>

      <div className="flex flex-wrap gap-4 py-4">
        {nodes.map((node) => (
          <ItemCard key={node.name} content={node.name} isFolder />
        )
        )}
      </div>

      {/* {folders && ( 
      //   <div className="flex flex-wrap gap-4 py-4">
      //     {is_first_section ? <AddFileCard /> : undefined}
      //     {folders.map((file) =>
      //       file.isFolder ? (
      //         <ItemCard key={file.name} content={file.name} isFolder />
      //       ) : undefined,
      //     )}
      //   </div>
      // )}*/}
    </>
  );
}
