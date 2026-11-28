import fileUpload from "$src/locales/en/file-upload.json";
import fileView from "$src/locales/en/file-view.json";

// The one place UI text is read from. Register each new locale file here.
export const messages = {
  ...fileUpload,
  ...fileView,
};

export type Messages = typeof messages;
