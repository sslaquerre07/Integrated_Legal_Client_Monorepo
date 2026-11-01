"use client";
import { useSelector } from "react-redux";
import { RootState } from "$src/store/store";
import Section from "$src/app/components/section/section";
import {
  FILES,
  FILES2,
} from "@/app/constants/hardcoded/hardcoded-section-data";
import { SECTION_BUTTONS } from "$src/app/constants/page/file-upload/section-buttons";
import { SECTION_NAME_1, SECTION_NAME_2 } from "$src/app/constants/page/file-upload/section-names";
import HorizontalDivider from "$src/app/components/divider/horizontal-divider";

export default function FileUploadPage() {
  const lawyerFile = useSelector((state: RootState) => state.lawyerFile);

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <Section
          is_first_section
          section_label={SECTION_NAME_1}
          button_labels={SECTION_BUTTONS}
          files={FILES}
        />

        <HorizontalDivider />

        <Section
          section_label={SECTION_NAME_2}
          files={FILES2}
        />
      </div>
    </main>
  );
}
