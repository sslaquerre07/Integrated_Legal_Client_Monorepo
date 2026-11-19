# Locales

UI text lives here: one JSON file per feature, per language (`en/file-upload.json`).
Internationalization library: https://next-intl.dev/
Still TODO: Install the actual internationalization library. This just makes it so when we do it down the line, we already have the structure setup.

## Key Points
- Each file has one top-level PascalCase key, the feature's name (`FileUpload`).
- Keys are camelCase and say what the text is for (`createFolderModal.title`), not where it sits.
- Components read text from `messages` in `$src/i18n/messages`. Register each new file there.
- Give every place in the UI its own key, even when two read the same in English.