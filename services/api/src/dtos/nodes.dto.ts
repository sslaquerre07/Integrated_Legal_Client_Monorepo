import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { ItemNode } from "../entities/node.entity";
import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class CreateNodeDto {
  @IsString()
  name!: string;

  @IsBoolean()
  isFolder!: boolean;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}

export class ResponseNodeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsBoolean()
  isFolder!: boolean;

  @IsDate()
  updatedAt!: Date;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  constructor(
    id: string,
    name: string,
    isFolder: boolean,
    updatedAt: Date,
    parentId?: string,
  ) {
    this.id = id;
    this.name = name;
    this.isFolder = isFolder;
    this.updatedAt = updatedAt;
    this.parentId = parentId;
  }
  static fromEntity(entity: ItemNode): ResponseNodeDto {
    return new ResponseNodeDto(
      entity.id,
      entity.name,
      entity.isFolder,
      entity.updatedAt,
      entity.parent?.id,
    );
  }
}

// Additional DTO classes
/** One entry in the folder hierarchy. Each ID's details are in `entities`. */
export class FolderTreeItemDto {
  /** UUID of the node. */
  id!: string;

  /** Child nodes. Empty when there are none or the depth limit was reached. */
  children!: FolderTreeItemDto[];
}

/** Response of GET /nodes/structure. */
@ApiExtraModels(ResponseNodeDto)
export class FolderStructureDto {
  /** The hierarchy, as IDs only. */
  tree!: FolderTreeItemDto[];

  /** Details of every node in `tree`, keyed by ID. */
  @ApiProperty({
    type: "object",
    additionalProperties: { $ref: getSchemaPath(ResponseNodeDto) },
  })
  entities!: Record<string, ResponseNodeDto>;
}

/** One item of a batch request that failed. */
export class BatchFailureDto {
  /** The step that failed. */
  @ApiProperty({ enum: ["database", "storage"] })
  stage!: "database" | "storage";

  /** What went wrong. */
  message!: string;
}

/** Response of POST /nodes/files. */
export class UploadFilesResultDto {
  /** Nodes created for the files that uploaded. */
  succeeded!: ResponseNodeDto[];

  /** Files that failed, with the reason. */
  failed!: BatchFailureDto[];
}

/** Body of POST /nodes/files, sent as multipart/form-data. */
export class UploadFilesDto {
  /** Files to upload, 10 MB max each. */
  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  files!: unknown[]; // documentation only: multer puts the files in req.files

  /** UUID of the folder that will contain the files. Leave out for the top level. */
  parentId?: string;
}

/** A deleted node. */
export class DeletedNodeDto {
  /** UUID of the deleted node. */
  id!: string;
}

/** Response of DELETE /nodes. */
export class DeleteNodesResultDto {
  /** Nodes that were deleted. */
  succeeded!: DeletedNodeDto[];

  /** Nodes that couldn't be deleted, with the reason. */
  failed!: BatchFailureDto[];
}

/** Body of DELETE /nodes. */
export class DeleteNodesDto {
  /** UUIDs of the files or empty folders to delete. */
  ids!: string[];
}

export class CreateFolderDto {
  /** Name of the new folder. */
  name!: string;

  /** UUID of the parent folder. Leave out to create the folder at the top level. */
  parentId?: string;
}
