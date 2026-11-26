import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ('status' in error) {
    // FetchBaseQueryError: a failed request
    if ('error' in error) return error.error; // FETCH_ERROR, PARSING_ERROR, CUSTOM_ERROR
    const data = error.data as { message?: string } | undefined; // HTTP error status
    return data?.message ?? `Request failed (${error.status})`;
  }
  // SerializedError: something thrown in your code
  return error.message ?? 'Something went wrong';
}