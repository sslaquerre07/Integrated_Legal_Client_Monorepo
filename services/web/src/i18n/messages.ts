import fileExplorer from "$src/locales/en/file-upload.json"

// The one place UI text is read from. Register each new locale file here.
export const messages = {
  ...fileExplorer,
};

export type Messages = typeof messages;