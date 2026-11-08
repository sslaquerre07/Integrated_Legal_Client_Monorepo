export type BatchActionFailure = {
  stage: string;
  message: string;
};

export type BatchActionResult<T> = {
  succeeded: Array<T>;
  failed: BatchActionFailure[];
};

export type BatchActionItemResult<T> =
  | { success: true; value: T }
  | ({ success: false } & BatchActionFailure);
