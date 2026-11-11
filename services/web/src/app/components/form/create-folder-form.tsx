import React from "react";
import {FormControl, FormHelperText, Input, InputLabel} from "@mui/material";
import WrappedButton from "$src/app/components/button/wrapped-button";
import {useCreateFolderMutation} from "$src/store/nodesApi/nodesApiSlice";
import {CREATE_FOLDER_MODAL_CONTENT} from "$src/app/constants/hardcoded/modal-content/create-folder-content";
import {getCurrentNode} from "$src/store/nodeHistory/nodeHistorySlice";
import {useSelector} from "react-redux";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = React.useState("");
  const [createFolder] = useCreateFolderMutation();
  const curr_id = useSelector(getCurrentNode)?.id;

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    await createFolder({
      name: folderName.trim(),
      parentId: curr_id,
    });
    setFolderName("");
  };

  return (
    <div>
      <FormControl className="flex flex-col gap-2 my-8">
        <InputLabel htmlFor="my-input" className="text-white">
          {CREATE_FOLDER_MODAL_CONTENT.modal.inputLabel}
        </InputLabel>
        <Input
          id="folder-name"
          value={folderName}
          className="text-white"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <FormHelperText id="folder-name-helper-text" className="text-white">
          {CREATE_FOLDER_MODAL_CONTENT.modal.helperText}
        </FormHelperText>
      </FormControl>
      <WrappedButton content="Submit" onClick={handleCreate} />
    </div>
  );
}
