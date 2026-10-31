import { FileDetail } from "$src/app/constants/types/file-detail";

// SECTION 1
export const SECTION_NAME = "Your Uploaded Files";

export const BUTTON_LABELS: readonly string[] = [
  "Create Folder",
  "Upload File",
];

export const FOLDER_LABELS: readonly string[] = [
  "Folder 1",
  "Folder 2",
  "Folder 3",
];

export const FILES: readonly FileDetail[] = [
  {
    name: "Folder 1",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: true,
    card_type: "regular"
  },
  {
    name: "Folder 2",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: true,
    card_type: "regular"
  },
  {
    name: "Folder 3",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: true,
    card_type: "regular"
  },
  {
    name: "Folder 4",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: true,
    card_type: "regular"
  },
];

// SECTION 2
export const SECTION_NAME2 = "Lawyer Documents Drafts";

export const FILES2: readonly FileDetail[] = [
  {
    name: "File 1",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: false,
  },
  {
    name: "File 2",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: false,
  },
  {
    name: "File 3",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: false,
  },
  {
    name: "File 4",
    type: "pending",
    date_uploaded: "10/15/2026",
    isFolder: false,
  },
];
