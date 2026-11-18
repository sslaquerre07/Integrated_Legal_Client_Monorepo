import WrappedModal from "$src/app/components/modal/wrapped-modal";
import RenameNodeForm from "$src/app/components/form/rename-node-form";
import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { RENAME_NODE_MODAL_CONTENT } from "$src/app/constants/language/modal-content";

type RenameNodeModalProps = {
  id: string;
  name: string;
};

export default function RenameNodeModal({id, name}: RenameNodeModalProps) {
  const title = RENAME_NODE_MODAL_CONTENT.title;
  const renameModalTitle = title + " " + name;
  return (
    <WrappedModal
      title={renameModalTitle}
      content={RenameNodeForm(id, name)}
      trigger={(open) => (
        <IconButton
          aria-label="rename"
          size="large"
          className="h-12 w-12 rounded-lg bg-teal-400/5 text-white"
          onClick={open}
        >
          <DriveFileRenameOutlineIcon />
        </IconButton>
      )}
    />
  );
}