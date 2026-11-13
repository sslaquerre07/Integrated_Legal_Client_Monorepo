"use client";
import {useDispatch} from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  useDeleteNodesMutation,
} from "@/store/nodesApi/nodesApiSlice";
import {NodeDto} from "@repo/types";
import {pushCurrentNodeToHistory} from "@/store/nodeHistory/nodeHistorySlice";
import RenameNodeModal from "../modal/rename-node-modal";

type ItemCardProps = {
  node: NodeDto;
};

export default function ItemCard({node}: ItemCardProps) {
  const {id, isFolder, name: content} = node;

  const icon = isFolder ? <FolderIcon fontSize="large" /> : undefined;

  const [deleteNodesMutation] = useDeleteNodesMutation();
  const dispatch = useDispatch();

  /**
   * Pushes the nodeState to the nodeHistory
   */
  function handleSelect() {
    dispatch(
      pushCurrentNodeToHistory({
        id,
        name: content,
        parentId: node.parentId || "",
      }),
    );
  }

  function handleDeleteNode() {
    deleteNodesMutation({ids: [id]});
  }

  return (
    <Card className="flex items-center whitespace-nowrap rounded-lg bg-white/5 text-white">
      <CardActionArea
        className="flex min-w-0 flex-1 items-center justify-start gap-3 self-stretch py-4 pl-3 pr-3 font-roboto-mono text-xl font-bold"
        onClick={handleSelect}
      >
        {icon}
        <span className="min-w-0 truncate" title={content}>
          {content}
        </span>
      </CardActionArea>

      <div className="flex shrink-0 gap-2 pr-3">
        <RenameNodeModal id={id} name={content} />
        <IconButton
          aria-label="delete"
          size="large"
          className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
          onClick={handleDeleteNode}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </Card>
  );
}
