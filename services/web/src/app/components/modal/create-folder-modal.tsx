
import WrappedModal from "$src/app/components/modal/wrapped-modal";
import CreateFolderForm from "$src/app/components/form/create-folder-form";
import WrappedButton from "$src/app/components/button/wrapped-button"
import { CREATE_FOLDER_MODAL_CONTENT } from "$src/app/constants/hardcoded/modal-content/create-folder-content";

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
