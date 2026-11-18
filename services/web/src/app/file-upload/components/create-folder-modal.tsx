
import WrappedModal from "$src/app/components/wrapped-modal";
import CreateFolderForm from "$src/app/file-upload/components/create-folder-form";
import WrappedButton from "$src/app/components/wrapped-button"
import { CREATE_FOLDER_MODAL_CONTENT } from "$src/app/constants/language/modal-content";

export default function CreateFolderModal() {
  const title = CREATE_FOLDER_MODAL_CONTENT.title;
  return (
    <WrappedModal
      title={title}
      content={CreateFolderForm()}
      trigger={(open) => (
        <WrappedButton 
          onClick={open} 
          content={title} /> 
      )}
    />
  );
}
