import { BatchFailureDto } from "../dtos/nodes.dto";

export type BatchActionFailure = BatchFailureDto;

export type BatchActionResult<T> = {
  succeeded: Array<T>;
  failed: BatchActionFailure[];
};

export type BatchActionItemResult<T> =
  | { success: true; value: T }
  | ({ success: false } & BatchActionFailure);
