import React from "react";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import WrappedButton from "$src/app/components/button/wrapped-button";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import { getCurrentFolderId } from "$src/store/folderStructureSlice/FolderStructureSlice";
import { CREATE_FOLDER_MODAL_CONTENT } from "$src/app/constants/language/modal-content";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = React.useState("");
  const [createFolder] = useCreateFolderMutation();
  const currentFolderId = useSelector(getCurrentFolderId);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    await createFolder({
      name: folderName.trim(),
      parentId: currentFolderId || undefined,
    });
    setFolderName("");
  };

  return (
    <div>
      <FormControl className="flex flex-col gap-2 my-8">
        <InputLabel htmlFor="my-input" className="text-white">
          {CREATE_FOLDER_MODAL_CONTENT.form.inputLabel}
        </InputLabel>
        <Input
          id="folder-name"
          value={folderName}
          className="text-white"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <FormHelperText id="folder-name-helper-text" className="text-white">
          {CREATE_FOLDER_MODAL_CONTENT.form.helperText}
        </FormHelperText>
      </FormControl>
      <WrappedButton content="Submit" onClick={handleCreate} />
    </div>
  );
}
