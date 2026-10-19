"use client";

import { ArrowLeftIcon, ArrowUpIcon } from "lucide-react";

import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import { useNodesControllerGetFolderStructureQuery } from "@/store/api/nodesApi.generated"; // adjust the path

import Link from "next/link";
import { cn } from "cn";

export default function SandboxPage() {
  const data_package = useNodesControllerGetFolderStructureQuery({ depth: 1 });

  console.log(data_package);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-1.5 shadow-xs">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ArrowLeftIcon data-icon="inline-start" />
          Go back
        </Link>

        <div className="h-4 w-px bg-border" />

        <Button variant="outline">Button</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon />
        </Button>
      </div>
    </main>
  );
}
