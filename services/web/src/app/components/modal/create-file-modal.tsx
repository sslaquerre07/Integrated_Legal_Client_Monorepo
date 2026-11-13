
import WrappedModal from "$src/app/components/modal/wrapped-modal";
import { CREATE_FILE_MODAL_CONTENT } from "$src/app/constants/hardcoded/modal-content/create-file-content";
import CreateFileForm from "$src/app/components/form/create-file-form";
import WrappedButton from "$src/app/components/button/wrapped-button";

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
