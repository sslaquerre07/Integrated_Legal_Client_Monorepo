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
            <CardTitle>File Upload (Figma Port)</CardTitle>
            <CardDescription>
              Default file upload implementation. Has our design language from
              Figma but not interactive components.
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
            <CardTitle>Interactive File Upload</CardTitle>
            <CardDescription>
              Shadcn file upload variant, with interactive components. But it
              has default colors.
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
            <CardTitle>
              (Hardcoded) Alternative Two-Column File Upload
            </CardTitle>
            <CardDescription>
              Split-view layout for file uploads. Alternative Layout to
              consider. If rejected, it will be removed in future frontend PRs.
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
            <CardTitle>(Hardcoded) Lawyer Docs Example</CardTitle>
            <CardDescription>
              Potential design for lawyer documents from Clients POV. Please let
              me know what you think.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              nativeButton={false}
              render={<Link href="/lawyer-documents-example" />}
            >
              Go to Lawyer Documents Example
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
