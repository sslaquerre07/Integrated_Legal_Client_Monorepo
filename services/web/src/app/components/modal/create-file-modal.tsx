
import WrappedModal from "$src/app/components/modal/wrapped-modal";
import { CREATE_FILE_MODAL_CONTENT } from "@/app/constants/hardcoded/modal-content/create-file-content";
import CreateFileForm from "../form/create-file-form";

export default function CreateFileModal() {
  return (
    <WrappedModal
      title={CREATE_FILE_MODAL_CONTENT.title}
      content={CreateFileForm()}
    />
  );
}
