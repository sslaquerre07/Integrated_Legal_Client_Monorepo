import { useRenameNodeMutation } from "$src/store/nodesApi/nodesApiSlice";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import React from "react";
import WrappedButton from "$src/app/components/wrapped-button";
import { messages } from "$src/i18n/messages";

export default function RenameNodeForm(id: string, initialName: string) {
  const [newName, setNewName] = React.useState(initialName);
  const [renameNode] = useRenameNodeMutation();

  const handleRename = async () => {
    if (!newName.trim()) return;
    await renameNode({
      name: newName.trim(),
      id: id,
    });
    setNewName("");
  };

  return (
    <>
      <FormControl className="flex flex-col gap-2 my-8">
        <InputLabel htmlFor="my-input" className="text-white">
          {messages.FileUpload.renameNodeModal.form.inputLabel}
        </InputLabel>
        <Input
          id="new-node-name"
          value={newName}
          className="text-white"
          onChange={(e) => setNewName(e.target.value)}
        />
        <FormHelperText id="rename-name-helper-text" className="text-white">
          {messages.FileUpload.renameNodeModal.form.helperText}
        </FormHelperText>
      </FormControl>
      <WrappedButton content="Submit" onClick={handleRename} />
    </>
  );
}
