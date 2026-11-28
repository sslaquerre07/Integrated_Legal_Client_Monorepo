import React from "react";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import WrappedButton from "$src/app/components/wrapped-button";
import { useCreateFolderMutation } from "$src/store/nodesApi/nodesApiSlice";
import { useSelector } from "react-redux";
import { messages } from "$src/i18n/messages";
import { selectCurrentFolderId } from "$src/store/folderNav/folderNavSlice";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = React.useState("");
  const [createFolder] = useCreateFolderMutation();
  const currentFolderId = useSelector(selectCurrentFolderId);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    await createFolder({
      name: folderName.trim(),
      parentId: currentFolderId || undefined,
    });
    setFolderName("");
  };

  return (
    <>
      <FormControl className="flex flex-col gap-2 my-8">
        <InputLabel htmlFor="my-input" className="text-white">
          {messages.FileUpload.createFolderModal.form.inputLabel}
        </InputLabel>
        <Input
          id="folder-name"
          value={folderName}
          className="text-white"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <FormHelperText id="folder-name-helper-text" className="text-white">
          {messages.FileUpload.createFolderModal.form.helperText}
        </FormHelperText>
      </FormControl>
      <WrappedButton
        content={messages.FileUpload.createFolderModal.form.submitButtonContent}
        onClick={handleCreate}
      />
    </>
  );
}
