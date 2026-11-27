"use client";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDeleteNodeMutation } from "$src/store/nodesApi/nodesApiSlice";
import { NodeDto } from "@repo/types";
import { openFolder } from "$src/store/folderNav/folderNavSlice";
import { Stack } from "@mui/material";
import WrappedModal from "$src/app/components/wrapped-modal";
import RenameNodeForm from "./rename-node-form";
import { messages } from "$src/i18n/messages";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useRouter } from "next/navigation";

type NodeCardProps = {
  node: NodeDto;
};

export default function NodeCard({ node }: NodeCardProps) {
  const { id, isFolder, name: content } = node;

  const router = useRouter();

  const [deleteNodesMutation] = useDeleteNodeMutation();
  const dispatch = useDispatch();
  /**
   * Pushes the nodeState to the nodeHistory
   */
  function handleSelect() {
    if (isFolder) {
      dispatch(openFolder(id));
    } else {
      router.push(`file-view/${id}`);
    }
  }

  function handleDeleteNode() {
    deleteNodesMutation(id);
  }

  const renameModalTitle = `${messages.FileUpload.renameNodeModal.title} ${content}`;

  return (
    <Card className="flex items-center whitespace-nowrap rounded-lg bg-white/5 text-white">
      <CardActionArea
        className="flex min-w-0 flex-1 items-center justify-start gap-3 self-stretch py-4 pl-3 pr-3 font-roboto-mono text-xl font-bold"
        onClick={handleSelect}
      >
        {isFolder ? <FolderIcon fontSize="large" /> : undefined}
        <span className="min-w-0 truncate" title={content}>
          {content}
        </span>
      </CardActionArea>

      <Stack direction="row" className="flex shrink-0 gap-2 pr-3">
        <WrappedModal
          title={renameModalTitle}
          content={<RenameNodeForm id={id} initialName={content} />}
          trigger={(open) => (
            <IconButton
              aria-label="rename"
              size="large"
              className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
              onClick={open}
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>
          )}
        />
        <IconButton
          aria-label="delete"
          size="large"
          className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
          onClick={handleDeleteNode}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Card>
  );
}
