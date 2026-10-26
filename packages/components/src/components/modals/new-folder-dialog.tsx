import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import { Button } from "../ui/button";
import { useState } from "react";

/**
 * Uncontrolled dialog: DialogTrigger / DialogClose open and close it, so no state here.
 * Create doesn't close it yet. When you wire Redux, either pass `open` / `onOpenChange`
 * from your store, or wrap the Create button in <DialogClose asChild>.
 */
export default function NewFolderDialog({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    if (!name) return;

    setPending(true);
    setError(null);
    try {
      await onCreate(name);
      setOpen(false); // only close once the server says it worked
    } catch {
      setError("Couldn't create the folder. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <FolderPlus /> New folder
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              Group related documents before sharing them with your lawyer.
            </DialogDescription>
          </DialogHeader>
          <Input
            name="name"
            required
            autoFocus
            placeholder="Untitled folder"
            aria-label="Folder name"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: "outline" })}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
