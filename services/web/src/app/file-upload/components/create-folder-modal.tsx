
import WrappedModal from "$src/app/components/wrapped-modal";
import CreateFolderForm from "$src/app/file-upload/components/create-folder-form";
import WrappedButton from "$src/app/components/wrapped-button"
import { messages } from "$src/i18n/messages";

export default function CreateFolderModal() {
  const title = messages.FileUpload.createFolderModal.title;
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
