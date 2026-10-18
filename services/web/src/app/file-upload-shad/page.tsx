import { Field } from "@repo/ui/components/ui/field";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { FolderCard } from "@repo/ui/components/folder-card";
import { FileCard } from "@repo/ui/components/file-card";
import { SearchIcon } from "lucide-react";

export default function FileUploadShadPage() {
  return (
    <main className="flex flex-col gap-y-3 min-h-screen min-w-screen justify-center items-center">
      {/* Search Group */}
      <Field orientation="horizontal" className="max-w-1/2">
        <Input type="search" placeholder="Search Projects" />
        <Button variant={"default"} size={"icon"} aria-label="Search">
          <SearchIcon />
        </Button>
      </Field>
      {/* Header */}
      <h2>Your uploaded Files</h2>
      {/* Created Folder Card */}
      <FolderCard name="Yo" />
      {/* Uploaded File card*/}
      <FileCard name="Bro" />
    </main>
  );
}
