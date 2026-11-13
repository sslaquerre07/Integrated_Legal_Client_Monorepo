import ItemCard from "@/app/components/card/item-card";
import {
  SECTION_NAME_1,
  SECTION_NAME_2,
} from "$src/app/constants/page/file-upload/section-names";
import { NodeDto } from "@repo/types";
import CreateFolderModal from "../modal/create-folder-modal";
import ArrowBack from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { popCurrentNodeFromHistory } from "@/store/nodeHistory/nodeHistorySlice";
import CreateFileModal from "../modal/create-file-modal";

type SectionProps = {
  isFolderSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];
};

export default function Section({
  isFolderSection = false,
  nodes,
}: SectionProps) {
  const section_label = isFolderSection ? SECTION_NAME_1 : SECTION_NAME_2;
  const dispatch = useDispatch();

  /**
   * Navigates to the previous (parent) folder by popping from nodeHistory
   */
  function handleBack() {
    // Pop from nodeHistory
    dispatch(popCurrentNodeFromHistory());
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-5">
          {isFolderSection ? (
            <IconButton
              aria-label="back"
              size="large"
              className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
              onClick={handleBack}
            >
              <ArrowBack />
            </IconButton>
          ) : null}
          <span className="whitespace-nowrap text-2xl font-semibold text-white">
            {section_label}
          </span>
        </div>
        <CreateFolderModal />
        <CreateFileModal />
      </div>

      <div className="flex flex-wrap gap-4 py-4">
        {nodes.map((node) => (
          <ItemCard key={node.id} node={node} />
        ))}
      </div>
    </>
  );
}
