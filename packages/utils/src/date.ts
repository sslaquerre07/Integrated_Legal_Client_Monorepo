// Date Helper functions
export const dateFormat = new Intl.DateTimeFormat("en-US",);
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));