import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen min-w-screen items-center justify-center gap-y-8">
      {/* Navigates instantly to /file-upload */}
      <Card size="sm" className="mx-auto w-full max-w-xs">
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link href="/file-upload">Go to File Upload Page</Link>
        </CardFooter>
      </Card>
      <Card size="sm" className="mx-auto w-full max-w-xs">
        <CardHeader>
          <CardTitle>Sandbox</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link href="/sandbox">Go to Sandbox</Link>
        </CardFooter>
      </Card>
    </main>
  );
}
