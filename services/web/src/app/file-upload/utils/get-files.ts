import { FileData } from "$src/app/constants/types/file-data";

// should be the same port defined under /src/index.ts
const API_BASE_URL = "http://localhost:3001";

export async function getFiles(): Promise<FileData> {
  const res = await fetch(`${API_BASE_URL}/nodes/structure`);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
