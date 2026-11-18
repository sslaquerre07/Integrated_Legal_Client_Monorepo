
import WrappedModal from "$src/app/components/wrapped-modal";
import CreateFileForm from "$src/app/file-upload/components/create-file-form";
import WrappedButton from "$src/app/components/wrapped-button";
import { CREATE_FILE_MODAL_CONTENT } from "$src/app/constants/language/modal-content";

export default function CreateFileModal() {
  const title = CREATE_FILE_MODAL_CONTENT.title
  return (
    <WrappedModal
      title={title}
      content={CreateFileForm()}
            trigger={(open) => (
              <WrappedButton 
                onClick={open} 
                content={title} /> 
            )}
    />
  );
}
