import FolderCard from "$src/app/components/card/folder-card";
import AddFileCard from "$src/app/components/card/add-file-card";
import Button from "$src/app/components/button/button";

// TODO: Move this to a different folder when application grows
type ListProps = {
  section_label: string;
  button_labels: readonly string[];
  folder_labels: readonly string[];
};

export default function FileUploadSection({
  section_label,
  button_labels,
  folder_labels,
}: ListProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white">
          {section_label}
        </span>
        <div className="flex flex-row gap-2">
          {button_labels.map((text) => (
            <Button key={text}>{text}</Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {folder_labels.map((text) => (
          <FolderCard key={text} folder_name={text} />
        ))}
      </div>
    </>
  );
}
