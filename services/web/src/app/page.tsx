import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-6">
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>
              Default file upload implementation.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              nativeButton={false}
              render={<Link href="/file-upload" />}
            >
              Go to File Upload Page
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Alternative File Upload</CardTitle>
            <CardDescription>
              Shadcn file upload component variant.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              nativeButton={false}
              render={<Link href="/file-upload-shad" />}
            >
              Go to Shad File Upload Page
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>(Hardcoded) Two-Column File Upload</CardTitle>
            <CardDescription>
              Split-view layout for file uploads.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              nativeButton={false}
              render={<Link href="/file-upload-two-column" />}
            >
              Go to Two-Column Upload
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>

        <Card size="sm" className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Sandbox</CardTitle>
            <CardDescription>
              Testing ground for experimental UI.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              nativeButton={false}
              render={<Link href="/sandbox" />}
            >
              Go to Sandbox
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
