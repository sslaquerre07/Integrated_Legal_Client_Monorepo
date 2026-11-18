import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import { FormControl, Input } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WrappedButton from "../../components/wrapped-button";
import { getCurrentFolderId } from "$src/store/folderStructureSlice/FolderStructureSlice";

export default function CreateFileForm() {
  const [createFile] = useCreateFileMutation();
  const currentFolderId = useSelector(getCurrentFolderId);
  const [files, setFiles] = useState<File[]>([]);

  // Uploads the user-selected files
  const handleCreateFile = () => {
    createFile({ parentId: currentFolderId || undefined, files });
  };

  // Updates the state object whenever user changes their uploads
  // Beneficial once we implement a custom drag-and-drop component
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_files = Array.from(e.target.files!);
    setFiles(new_files);
  };

  return (
    <div>
      <FormControl>
        <Input
          type="file"
          inputProps={{ multiple: true }}
          id="my-files"
          onChange={handleFileChange}
        />
      </FormControl>
      <WrappedButton content="Submit" onClick={handleCreateFile} />
    </div>
  );
}
