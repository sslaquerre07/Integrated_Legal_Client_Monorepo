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
  UploadedFiles,
  Res,
  StreamableFile,
  MaxFileSizeValidator,
  ParseFilePipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { NodesService } from "./nodes.service";
import {
  CreateNodeDto,
  FolderStructureDto,
  ResponseNodeDto,
} from "../dtos/nodes.dto";
import { FilesService } from "./files.service";
import { ItemNode } from "../entities/node.entity";
import { BatchActionItemResult, BatchActionResult } from "./nodes.types";
import { type Response } from "express";
import { ApiOkResponse, ApiProduces } from "@nestjs/swagger";

@Controller("nodes")
export class NodesController {
  // Utilities setup
  constructor(
    @Inject(NodesService) private readonly nodesService: NodesService,
    @Inject(FilesService) private readonly filesService: FilesService,
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
        const { success: _success, ...failure } = result;
        batchResult.failed.push(failure);
      }
    });
    return batchResult;
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
  ): Promise<FolderStructureDto> {
    if (depth < 1) {
      throw new BadRequestException("depth must be a positive integer");
    }
    return await this.nodesService.getFolderStructure(depth, rootId);
  }

  /**
   * Retrieves a file's contents for inline display.
   * @param id UUID of the file node to retrieve.
   */
  @Get("/file/:id")
  @ApiProduces("application/octet-stream")
  @ApiOkResponse({
    description: "The File.",
    schema: { type: "string", format: "binary" },
  })
  async getFileContent(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const node = await this.nodesService.getNodeById(id);
    if (node.isFolder) {
      throw new BadRequestException(
        "The specified node is a folder, not a file.",
      );
    }

    const fileStream = this.filesService.retrieveFileStream(id);
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
  @Post("/files")
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
  ): Promise<BatchActionResult<ResponseNodeDto>> {
    const results: BatchActionItemResult<ResponseNodeDto>[] = await Promise.all(
      files.map(async (file, index) => {
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

        try {
          await this.filesService.uploadFile(file, node.id);
          return {
            success: true as const,
            value: ResponseNodeDto.fromEntity(node),
          };
        } catch (error) {
          await this.nodesService.deleteNode(node.id);
          const message =
            error instanceof Error ? error.message : String(error);
          return { success: false as const, stage: "storage", message };
        }
      }),
    );

    return this.collectBatchResults(results);
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
  ): Promise<ResponseNodeDto> {
    const nodeDto: CreateNodeDto = {
      name,
      isFolder: true,
      parentId: parentId ?? undefined,
    };
    const node = await this.nodesService.createNode(nodeDto);
    return ResponseNodeDto.fromEntity(node);
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
  ): Promise<ResponseNodeDto> {
    const updatedNode = await this.nodesService.updateNode(id, nodeDto);
    return ResponseNodeDto.fromEntity(updatedNode);
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
