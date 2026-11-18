import NodeCard from "$src/app/components/card/node-card";
import {
  SECTION_NAME_1,
  SECTION_NAME_2,
} from "$src/app/constants/page/file-upload/section-names";
import { NodeDto } from "@repo/types";
import CreateFolderModal from "$src/app/components/modal/create-folder-modal";
import ArrowBack from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import CreateFileModal from "../modal/create-file-modal";
import { getCurrentFolderId, goBack } from "$src/store/folderStructureSlice/FolderStructureSlice";

type NodeSectionProps = {
  isFolderNodeSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];
};

export default function NodeSection({
  isFolderNodeSection = false,
  nodes,
}: NodeSectionProps) {
  const section_label = isFolderNodeSection ? SECTION_NAME_1 : SECTION_NAME_2;
  const dispatch = useDispatch();
  const isRootFolder = (useSelector(getCurrentFolderId)) || false;

  /**
   * Navigates to the previous (parent) folder by popping from nodeHistory
   */
  function handleBack() {
    // Pop from nodeHistory
    dispatch(goBack());
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-5">
          {isFolderNodeSection && isRootFolder ? (
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
        {isFolderNodeSection ? (
          <div className="flex flex-row items-center gap-2">
            <CreateFolderModal />
            <CreateFileModal />
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-4 py-4">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </>
  );
}
