"use client";

import Button from "../components/button/button";
import DraftDocumentCard from "../components/card/draft-document-card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FileUploadSection from "../components/section/file-upload-section";

export default function FileUploadPage() {
  const lawyerFile = useSelector((state: RootState) => state.lawyerFile);
  //   let text = "Lawyer Draft 1";
  //   let text2 = "Lawyer Draft 2";
  //   let text3 = "Other Document 1";
  //   let text4 = "Other Document 2";
  //   let type = "approved";
  //   let type2 = "pending";
  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <FileUploadSection />
        <div className="h-px w-full bg-white/10"></div>

        <div className="flex flex-row items-center justify-between">
          <span className="whitespace-nowrap text-2xl font-semibold text-white">
            Lawyer Documents and Drafts
          </span>

          <div className="flex flex-row gap-2">
            <Button className="w-fit">Drafts</Button>
            <Button className="w-fit">Documents</Button>
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
      </div>
    </main>
  );
}
