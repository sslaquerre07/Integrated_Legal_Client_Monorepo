import NodeCard from "$src/app/file-upload/components/node-card";
import { NodeDto } from "@repo/types";
import ArrowBack from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { messages } from "$src/i18n/messages";
import {
  openFolder,
  selectCurrentFolderId,
} from "$src/store/folderNav/folderNavSlice";
import { selectBackId } from "$src/store/folderNav/selectors";
import WrappedModal from "$src/app/components/wrapped-modal";
import CreateFileForm from "./create-file-form";
import WrappedButton from "$src/app/components/wrapped-button";
import CreateFolderForm from "./create-folder-form";
import { Stack } from "@mui/material";

type NodeSectionProps = {
  isFolderNodeSection?: boolean; // Currently, we have 2 different sections - Files and Folder
  nodes: NodeDto[];
};

export default function NodeSection({
  isFolderNodeSection = false,
  nodes,
}: NodeSectionProps) {
  const dispatch = useDispatch();
  const backId = useSelector(selectBackId);

  const handleGoBack = () => {
    dispatch(openFolder(backId));
  };

  const section_label = isFolderNodeSection
    ? messages.FileUpload.sections.folders
    : messages.FileUpload.sections.files;
  const isAtRootFolder = useSelector(selectCurrentFolderId) ? false : true;

  const createFileModalTitle = messages.FileUpload.createFileModal.title;
  const createFolderModalTitle = messages.FileUpload.createFolderModal.title;

  return (
    <Stack>
      <Stack className="flex flex-row items-center justify-between">
        <Stack className="flex flex-row items-center gap-5">
          {isFolderNodeSection && !isAtRootFolder ? (
            <IconButton
              aria-label="back"
              size="medium"
              className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
              onClick={handleGoBack}
            >
              <ArrowBack />
            </IconButton>
          ) : null}
          <span className="whitespace-nowrap text-2xl font-semibold text-white">
            {section_label}
          </span>
        </Stack>
        {isFolderNodeSection ? (
          <Stack className="flex flex-row items-center gap-2">
            <WrappedModal
              title={createFileModalTitle}
              content={<CreateFileForm />}
              trigger={(open) => (
                <WrappedButton onClick={open} content={createFileModalTitle} />
              )}
            />
            <WrappedModal
              title={createFolderModalTitle}
              content={<CreateFolderForm />}
              trigger={(open) => (
                <WrappedButton
                  onClick={open}
                  content={createFolderModalTitle}
                />
              )}
            />
          </Stack>
        ) : null}
      </Stack>
      <Stack direction="row" className="flex flex-wrap gap-4 py-4">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </Stack>
    </Stack>
  );
}
