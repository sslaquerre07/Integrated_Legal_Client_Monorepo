import { getCurrentNode } from "$src/store/nodeHistory/nodeHistorySlice";
import { useCreateFileMutation } from "$src/store/nodesApi/nodesApiSlice";
import { FormControl, Input } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WrappedButton from "$src/app/components/button/wrapped-button";

export default function CreateFileForm() {
  const [createFile] = useCreateFileMutation();
  const curr_id = useSelector(getCurrentNode)?.id;
  const [files, setFiles] = useState<File[]>([]);

  // Uploads the user-selected files
  const handleCreateFile = () => {

    // Upload the files
    createFile({ parentId: curr_id, files });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // Set state files
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
