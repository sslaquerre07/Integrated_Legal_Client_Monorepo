
import WrappedModal from "$src/app/components/modal/wrapped-modal";
import CreateFolderForm from "$src/app/components/form/create-folder-form";
import { CREATE_FOLDER_MODAL_CONTENT } from "$src/app/constants/hardcoded/modal-content/create-folder-content";

export default function CreateFolderModal() {
  return (
    <WrappedModal
      title={CREATE_FOLDER_MODAL_CONTENT.title}
      content={CreateFolderForm()}
    />
  );
}
