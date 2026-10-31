"use client";
import { useSelector } from "react-redux";
import { RootState } from "$src/store/store";
import Section from "$src/app/components/section/section";
import {
  SECTION_NAME,
  BUTTON_LABELS,
  SECTION_NAME2,
  FILES,
  FILES2,
} from "$src/app/constants/hardcoded/hardcoded-section";
import HorizontalDivider from "$src/app/components/divider/horizontal-divider";

export default function FileUploadPage() {
  const lawyerFile = useSelector((state: RootState) => state.lawyerFile);

  return (
    <main className="bg-company min-h-screen text-white p-8">
      <div className="flex flex-col gap-7">
        <Section
          is_first_section
          section_label={SECTION_NAME}
          button_labels={BUTTON_LABELS}
          files={FILES}
        />

        <HorizontalDivider />

        <Section
          section_label={SECTION_NAME2}
          files={FILES2}
        />
      </div>
    </main>
  );
}
