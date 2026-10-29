import FolderCard from "$src/app/components/card/folder-card";
import WrappedButton from "$src/app/components/button/wrapped-button";
import { FileData } from "$src/app/constants/types/file-data";
import WrappedItemCard from "$src/app/components/card/wrapped-item-card";

// TODO: Move this to a different folder when application grows
type ListProps = {
  section_label: string;
  button_labels: readonly string[];
  folder_labels: readonly string[];
  file_data: FileData;
};

export default function FileUploadSection({
  section_label,
  button_labels,
  folder_labels,
  file_data,
}: ListProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white">
          {section_label}
        </span>
        <div className="flex flex-row gap-2">
          {button_labels.map((text) => (
            <WrappedButton key={text} content={text} isFolder={false} />
          ))}
        </div>
      </div>

      {file_data ? (
        <div className="flex flex-wrap gap-4 py-4">
          {Object.values(file_data?.entities).map((entity) => (
            <WrappedItemCard
              key={entity.id}
              content={entity.name}
              isFolder={true}
            />
          ))}{" "}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 py-4">
          {folder_labels.map((text) => (
            <WrappedItemCard key={text} content={text} isFolder={true} />
          ))}
        </div>
      )}
    </>
  );
}
