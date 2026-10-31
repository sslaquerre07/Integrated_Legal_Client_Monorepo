import WrappedButton from "$src/app/components/button/wrapped-button";
import ItemCard from "@/app/components/card/item-card";
import { FileDetail } from "$src/app/constants/types/file-detail";
import FileCard from "@/app/components/card/file-card";
import AddFileCard from "@/app/components/card/add-file-card";

type SectionProps = {
  is_first_section?: boolean;
  section_label: string;
  button_labels?: readonly string[];
  files?: readonly FileDetail[];
};

export default function Section({
  is_first_section = false, // false by default
  section_label,
  button_labels,
  files,
}: SectionProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white">
          {section_label}
        </span>
        {button_labels && (
          <div className="flex flex-row gap-2">
            {button_labels.map((text) => (
              <WrappedButton key={text} content={text} isFolder={false} />
            ))}
          </div>
        )}
      </div>

      {files && (
        <div className="flex flex-wrap gap-4 py-4">
          {is_first_section ? <AddFileCard /> : undefined}
          {files.map((file) =>
            file.isFolder ? (
              <ItemCard key={file.name} content={file.name} isFolder />
            ) : (
              <FileCard
                key={file.name}
                name={file.name}
                type={file.type}
                date_uploaded={file.date_uploaded}
              />
            ),
          )}
        </div>
      )}
    </>
  );
}
