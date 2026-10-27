import FolderCard from "$src/app/components/card/folder-card"
import AddFileCard from "$src/app/components/card/add-file-card";
import Button from "$src/app/components/button/button";

export default function FileUploadSection() {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="whitespace-nowrap text-2xl font-semibold text-white">
          Your Uploaded Files
        </span>
        <Button className="w-fit">Create Folder</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <AddFileCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
      </div>
    </>
  );
}
