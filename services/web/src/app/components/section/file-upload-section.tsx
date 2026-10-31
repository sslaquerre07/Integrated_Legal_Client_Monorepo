import WrappedButton from "$src/app/components/button/wrapped-button";
import WrappedItemCard from "$src/app/components/card/wrapped-item-card";
import { FileDetail } from "$src/app/constants/types/file-detail";
import WrappedTripleLayerCard from "$src/app/components/card/wrapped-triple-layer-card";
import WrappedAddFileCard from "$src/app/components/card/wrapped-add-file-card";

// TODO: Move this to a different folder when application grows
type ListProps = {
  is_first_section?: boolean;
  section_label: string;
  button_labels?: readonly string[];
  files?: readonly FileDetail[];
};

export default function FileUploadSection({
  is_first_section = false, // false by default
  section_label,
  button_labels,
  files,
}: ListProps) {
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
          {is_first_section ? <WrappedAddFileCard /> : undefined}
          {files.map((file) =>
            file.isFolder ? (
              <WrappedItemCard key={file.name} content={file.name} isFolder card_type={file.card_type} />
            ) : (
              <WrappedTripleLayerCard
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
