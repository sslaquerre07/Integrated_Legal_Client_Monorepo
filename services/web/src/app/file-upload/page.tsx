"use client";
import DraftDocumentCard from "$src/app/components/card/draft-document-card";
import { useSelector } from "react-redux";
import { RootState } from "$src/store/store";
import FileUploadSection from "$src/app/components/section/file-upload-section";
import {
  SECTION_NAME,
  BUTTON_LABELS,
  FOLDER_LABELS,
} from "$src/app/constants/hardcoded/hardcoded-section";
import HorizontalDivider from "$src/app/components/divider/horizontal-divider";
import WrappedButton from "$src/app/components/button/wrapped-button";

export default function FileUploadPage() {
  const lawyerFile = useSelector((state: RootState) => state.lawyerFile);

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <FileUploadSection
          section_label={SECTION_NAME}
          button_labels={BUTTON_LABELS}
          folder_labels={FOLDER_LABELS}
        ></FileUploadSection>

        <HorizontalDivider />

        <FileUploadSection
          section_label={"Folders Fetched from GET `../nodes/structure`"}
          button_labels={BUTTON_LABELS}
          file_data={files}
        ></FileUploadSection>
      </div>

      <HorizontalDivider />

      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white py-6">
          Lawyer Documents and Drafts
        </span>

        <div className="flex flex-row gap-2">
          <WrappedButton content="Drafts" isFolder={false} />
          <WrappedButton content="Documents" isFolder={false} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <DraftDocumentCard
          name={lawyerFile.name}
          type={lawyerFile.status}
          date_uploaded={lawyerFile.date_uploaded}
        />
        <DraftDocumentCard
          name={lawyerFile.name}
          type={lawyerFile.status}
          date_uploaded={lawyerFile.date_uploaded}
        />
        <DraftDocumentCard
          name={lawyerFile.name}
          type={lawyerFile.status}
          date_uploaded={lawyerFile.date_uploaded}
        />
        <DraftDocumentCard
          name={lawyerFile.name}
          type={lawyerFile.status}
          date_uploaded={lawyerFile.date_uploaded}
        />
      </div>
    </main>
  );
}
