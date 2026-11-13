import {RENAME_NODE_MODAL_CONTENT} from "@/app/constants/hardcoded/modal-content/rename-node-content";
import {useRenameNodeMutation} from "@/store/nodesApi/nodesApiSlice";
import {FormControl, FormHelperText, Input, InputLabel} from "@mui/material";
import React from "react";
import WrappedButton from "../button/wrapped-button";

export default function RenameNodeForm(id: string, initialName: string) {
  const [newName, setNewName] = React.useState(initialName);
  const [renameNode] = useRenameNodeMutation();

  const handleRename = async () => {
    if (!newName.trim()) return;
    await renameNode({
      name: newName.trim(),
      id: id
    });
    setNewName("");
  };

  return (
    <div>
    <FormControl className="flex flex-col gap-2 my-8">
      <InputLabel htmlFor="my-input" className="text-white">
        {RENAME_NODE_MODAL_CONTENT.form.inputLabel}
      </InputLabel>
      <Input
        id="new-node-name"
        value={newName}
        className="text-white"
        onChange={(e) => setNewName(e.target.value)}
      />
      <FormHelperText id="rename-name-helper-text" className="text-white">
        {RENAME_NODE_MODAL_CONTENT.form.helperText}
      </FormHelperText>
    </FormControl>
    <WrappedButton content="Submit" onClick={handleRename} />
    </div>
  );
}
