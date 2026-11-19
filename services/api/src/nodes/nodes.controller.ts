import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  StreamableFile,
  MaxFileSizeValidator,
  ParseFilePipe,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { NodesService } from "./nodes.service";
import { FilesService, type UploadedFileVersion } from "./files.service";
import { ItemNode } from "../entities/node.entity";
import { type Response } from "express";

import {
  BatchActionItemResult,
  BatchActionResult,
  CreateNodeDto,
  NodeDto,
} from "@repo/types";
import { toNodeDto } from "./utils";
import { VersionsService } from "./versions.service";

@Controller("nodes")
export class NodesController {
  // Utilities setup
  constructor(
    @Inject(NodesService) private readonly nodesService: NodesService,
    @Inject(FilesService) private readonly filesService: FilesService,
    @Inject(VersionsService) private readonly versionsService: VersionsService,
  ) {}

  // Helper functions
  private collectBatchResults<T>(
    results: BatchActionItemResult<T>[],
  ): BatchActionResult<T> {
    const batchResult: BatchActionResult<T> = { succeeded: [], failed: [] };
    results.forEach((result) => {
      if (result.success) {
        batchResult.succeeded.push(result.value);
      } else {
        const { success: _, ...failure } = result;
        batchResult.failed.push(failure);
      }
    });
    return batchResult;
  }
  private async uploadVersionForNode(
    file: Express.Multer.File,
    node: ItemNode,
  ): Promise<BatchActionItemResult<NodeDto>> {
    let uploadedFile: UploadedFileVersion;
    try {
      uploadedFile = await this.filesService.uploadFile(file, node.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return { success: false, stage: "storage", message };
    }

    try {
      await this.versionsService.createVersion(node.id, uploadedFile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return { success: false, stage: "database", message };
    }

    return { success: true, value: toNodeDto(node) };
  }

  /**
   * Retrieves the folder structure up to the requested depth.
   * @param depth Maximum number of tree levels to return, starting at the root.
   * @param rootId Optional node ID to use as the root of the returned structure.
   */
  @Get("/structure")
  async getFolderStructure(
    @Query("depth", new DefaultValuePipe(1), ParseIntPipe) depth: number,
    @Query("rootId", new ParseUUIDPipe({ optional: true })) rootId?: string,
  ) {
    if (depth < 1) {
      throw new BadRequestException("depth must be a positive integer");
    }
    return await this.nodesService.getFolderStructure(depth, rootId);
  }

  /**
   * Retrieves a file's contents for inline display.
   * @param id UUID of the file node to retrieve.
   * @param version Optional version of the file to retrieve.
   */
  @Get("/file")
  async getFileContent(
    @Res({ passthrough: true }) res: Response,
    @Body("id", new ParseUUIDPipe()) id: string,
    @Body("version") version?: string,
  ) {
    const node = await this.nodesService.getNodeById(id);
    if (node.isFolder) {
      throw new BadRequestException(
        "The specified node is a folder, not a file.",
      );
    }
    const nodeVersion = version ?? await this.versionsService.getCurrentNodeVersion(id);

    const fileStream = this.filesService.retrieveFileStream(id, nodeVersion);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", "application/octet-stream");

    return new StreamableFile(fileStream);
  }

  /**
   * Uploads multiple files and creates a node for each file.
   * The result reports successful uploads and any database or storage failures.
   * @param files Files to upload.
   * @param parentId Optional UUID of the folder that will contain the uploaded files.
   */
  @Post("/files/newFile")
  @UseInterceptors(FilesInterceptor("files"))
  async createFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 10 MB Max Size
          new MaxFileSizeValidator({ maxSize: 10 * 1048576 }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body("parentId") parentId?: string,
  ): Promise<BatchActionResult<NodeDto>> {
    const results: BatchActionItemResult<NodeDto>[] = await Promise.all(
      files.map(async (file) => {
        // Attempt to create a node in the database
        const nodeDto: CreateNodeDto = {
          name: file.originalname,
          isFolder: false,
          parentId: parentId ?? undefined,
        };
        let node: ItemNode;
        try {
          node = await this.nodesService.createNode(nodeDto);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          return { success: false as const, stage: "database", message };
        }

        const result = await this.uploadVersionForNode(file, node);
        if (!result.success && result.stage === "storage") {
          await this.nodesService.deleteNode(node.id);
        }
        return result;
      }),
    );

    return this.collectBatchResults(results);
  }

  /**
   * Uploads a new version of an existing file node.
   * @param id UUID of the file node to update.
   * @param file New file contents.
   */
  @Post("/files/:id/versions")
  @UseInterceptors(FileInterceptor("file"))
  async createFileVersion(
    @Param("id", new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1048576 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<BatchActionResult<NodeDto>> {
    const node = await this.nodesService.getNodeById(id);
    if (node.isFolder) {
      throw new BadRequestException(
        "The specified node is a folder, not a file.",
      );
    }

    const result = await this.uploadVersionForNode(file, node);
    return this.collectBatchResults([result]);
  }

  /**
   * Creates a folder node.
   * @param name Name of the new folder.
   * @param parentId Optional UUID of the parent folder.
   */
  @Post("/folders")
  async createFolder(
    @Body("name") name: string,
    @Body("parentId") parentId?: string,
  ): Promise<NodeDto> {
    const nodeDto: CreateNodeDto = {
      name,
      isFolder: true,
      parentId: parentId ?? undefined,
    };
    const node = await this.nodesService.createNode(nodeDto);
    return toNodeDto(node);
  }

  /**
   * Updates a node's name.
   * @param id UUID of the node to update.
   * @param nodeDto Node fields to update.
   */
  @Patch("/:id")
  async updateNode(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() nodeDto: Partial<CreateNodeDto>,
  ): Promise<NodeDto> {
    const updatedNode = await this.nodesService.updateNode(id, nodeDto);
    return toNodeDto(updatedNode);
  }

  /**
   * Deletes files and empty folders with their associated node records.
   * The result reports successful deletions and any storage or database failures.
   * @param ids UUIDs of the file or folder nodes to delete.
   */
  @Delete()
  async deleteNodes(
    @Body("ids") ids: string[],
  ): Promise<BatchActionResult<{ id: string }>> {
    const results: BatchActionItemResult<{ id: string }>[] = await Promise.all(
      ids.map(async (id) => {
        try {
          const node = await this.nodesService.getNodeById(id);
          if (!node.isFolder) await this.filesService.deleteFile(id);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          return { success: false as const, stage: "storage", message };
        }

        try {
          await this.nodesService.deleteNode(id);
          return { success: true as const, key: id, value: { id } };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          return { success: false as const, stage: "database", message };
        }
      }),
    );

    return this.collectBatchResults(results);
  }
}
