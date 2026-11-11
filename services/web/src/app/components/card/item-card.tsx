"use client";
import {useDispatch} from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDeleteNodesMutation } from "@/store/nodesApi/nodesApiSlice";
import { NodeDto } from "@repo/types";
import { pushCurrentNodeToHistory } from "@/store/nodeHistory/nodeHistorySlice";

type ItemCardProps = {
  node: NodeDto;
};

export default function ItemCard({node}: ItemCardProps) {
  // Define variables
  const id = node.id;
  const isFolder = node.isFolder;
  const content = node.name;

  const icon = isFolder ? <FolderIcon fontSize="large" /> : undefined;

  const [deleteNodesMutation] = useDeleteNodesMutation();
  const dispatch = useDispatch();

  /**
   * Pushes the nodeState to the nodeHistory
   */
  function handleSelect() {
    // Create new_node with updated values
    const new_node = {
      id: id,
      name: content,
      parentId: node.parentId || ""
    }

    // Push the new_node
    dispatch(pushCurrentNodeToHistory(new_node));
  }

  function handleDeleteNode() {
    deleteNodesMutation({ids: [id]});
  }

  return (
    <Card className="relative whitespace-nowrap rounded-lg bg-white/5 text-white">
      <CardActionArea
        className="flex h-full w-full min-w-56 items-center justify-start gap-3 py-4 pl-3 pr-20 font-roboto-mono text-xl font-bold"
        onClick={handleSelect}
      >
        {icon}
        {content}
      </CardActionArea>

      <IconButton
        aria-label="delete"
        size="large"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-lg bg-teal-400/5 text-white"
        onClick={handleDeleteNode}
      >
        <CloseIcon />
      </IconButton>
    </Card>
  );
}
