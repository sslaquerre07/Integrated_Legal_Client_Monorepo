import Link from "next/link";

export default function Home() {
  return (
    <nav>
      {/* Navigates instantly to /file-upload */}
      <Link href="/file-upload">Go to File Upload Page</Link>
    </nav>
  );
}
