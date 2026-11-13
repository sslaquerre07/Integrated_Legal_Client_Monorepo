import { getCurrentNode } from "@/store/nodeHistory/nodeHistorySlice";
import { useCreateFileMutation } from "@/store/nodesApi/nodesApiSlice";
import { FormControl, Input } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WrappedButton from "../button/wrapped-button";

export default function CreateFileForm() {
  const [createFile] = useCreateFileMutation();
  const curr_id = useSelector(getCurrentNode)?.id;
  const [files, setFiles] = useState<File[]>([]);

  // Uploads the user-selected files
  const handleCreateFile = () => {
    // Log the state
    console.log("files: ", files);

    // Upload the files
    createFile({ parentId: curr_id, files });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Log e first
    console.log("e: ", e);

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
