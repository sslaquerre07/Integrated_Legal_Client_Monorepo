import ItemCard from "@/app/components/card/item-card";
import {
  SECTION_NAME_1,
  SECTION_NAME_2,
} from "$src/app/constants/page/file-upload/section-names";
import { NodeDto } from "@repo/types";
import CreateFolderModal from "../modal/create-folder-modal";

type SectionProps = {
  isFolderSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];
};

// todo: so file section will display files on the same level.
// todo: folder sesction will display folders on the same level.

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
        <CreateFolderModal />

      </div>

      <div className="flex flex-wrap gap-4 py-4">
        {nodes.map((node) => (
          <ItemCard
            key={node.name}
            id={node.id}
            content={node.name}
            isFolder={node.isFolder}
          />
        ))}
      </div>
    </>
  );
}
