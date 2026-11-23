import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import { FormControl, Input } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WrappedButton from "../../components/wrapped-button";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";

export default function CreateFileForm() {
  const [createFile] = useCreateFileMutation();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const [files, setFiles] = useState<File[]>([]);

  // Uploads the user-selected files
  const handleCreateFile = () => files.forEach((file) => createFile({ parentId: currentFolderId || undefined, file }));

  // Updates the state object whenever user changes their uploads
  // Beneficial once we implement a custom drag-and-drop component
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_files = Array.from(e.target.files!);
    setFiles(new_files);
  };

  return (
    <>
      <FormControl>
        <Input
          type="file"
          inputProps={{ multiple: true }}
          id="my-files"
          onChange={handleFileChange}
        />
      </FormControl>
      <WrappedButton content="Submit" onClick={handleCreateFile} />
    </>
  );
}
