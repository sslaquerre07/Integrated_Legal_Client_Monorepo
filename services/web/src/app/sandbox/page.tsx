"use client";

import { ArrowUpIcon } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { useNodesControllerGetFolderStructureQuery } from "@/store/api/nodesApi.generated"; // adjust the path

import Link from "next/link";

export default function SandboxPage() {
  const data_package = useNodesControllerGetFolderStructureQuery({ depth: 1 });

  console.log(data_package);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Link href="/">Go back</Link>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline">Button</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon />
        </Button>
      </div>
    </main>
  );
}
