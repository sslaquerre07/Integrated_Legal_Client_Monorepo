import NodeCard from "$src/app/file-upload/components/node-card";
import { NodeDto } from "@repo/types";
import CreateFolderModal from "$src/app/file-upload/components/create-folder-modal";
import ArrowBack from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import CreateFileModal from "./create-file-modal";
import { messages } from "$src/i18n/messages";

import {
  openFolder,
  selectCurrentFolderId,
} from "$src/store/folderNav/folderNavSlice";
import { selectBackId } from "$src/store/folderNav/selectors";

type NodeSectionProps = {
  isFolderNodeSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];
};

function BackButton() {
  const dispatch = useDispatch();
  const backId = useSelector(selectBackId);

  const handleGoBack = () => {
    dispatch(openFolder(backId));
  };

  return (
    <IconButton
      aria-label="back"
      size="medium"
      className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
      onClick={handleGoBack}
    >
      <ArrowBack />
    </IconButton>
  );
}

function NodeSectionHeader({
  isFolderNodeSection,
}: {
  isFolderNodeSection: boolean;
}) {
  const section_label = isFolderNodeSection
    ? messages.FileUpload.sections.folders
    : messages.FileUpload.sections.files;
  const isAtRootFolder = useSelector(selectCurrentFolderId) ? false : true;
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-5">
        {isFolderNodeSection && !isAtRootFolder ? <BackButton /> : null}
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
  );
}

function NodeSectionBody({ nodes }: { nodes: NodeDto[] }) {
  return (
    <div className="flex flex-wrap gap-4 py-4">
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}

export default function NodeSection({
  isFolderNodeSection = false,
  nodes,
}: NodeSectionProps) {
  return (
    <>
      <NodeSectionHeader isFolderNodeSection={isFolderNodeSection} />
      <NodeSectionBody nodes={nodes} />
    </>
  );
}
