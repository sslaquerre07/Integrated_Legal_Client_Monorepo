
import WrappedModal from "$src/app/components/wrapped-modal";
import CreateFileForm from "$src/app/file-upload/components/create-file-form";
import WrappedButton from "$src/app/components/wrapped-button";
import { messages } from "$src/i18n/messages";

export default function CreateFileModal() {
  const title = messages.FileUpload.createFileModal.title
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
