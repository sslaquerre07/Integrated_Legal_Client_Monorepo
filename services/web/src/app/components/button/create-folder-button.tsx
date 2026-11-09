"use client";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import WrappedButton from "$src/app/components/button/wrapped-button";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";

export default function CreateFolderButton() {
  const [name, setName] = useState("");
  const [createFolder] = useCreateFolderMutation();

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createFolder({ name: name.trim() });
    setName(""); // Clear input field
  };

  return (
    <div className="flex items-center gap-2">
      <TextField
        size="small"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ "& .MuiInputBase-root": { color: "white" } }}
      />
      <WrappedButton content="Create folder" isFolder onClick={handleCreate} />
    </div>
  );
}