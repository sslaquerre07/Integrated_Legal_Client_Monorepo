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
  Res,
  StreamableFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  InternalServerErrorException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { NodesService } from "./nodes.service";
import { FilesService, type UploadedFileVersion } from "./files.service";
import { ItemNode } from "../entities/node.entity";
import { type Response } from "express";

import { CreateNodeDto, NodeDto } from "@repo/types";
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

  // Uploads a file and creates its version entry.
  private async uploadVersionForNode(
    file: Express.Multer.File,
    node: ItemNode,
    deleteNodeOnStorageFailure = false,
  ): Promise<NodeDto> {
    let uploadedFile: UploadedFileVersion;
    try {
      uploadedFile = await this.filesService.uploadFile(file, node.id);
    } catch (error) {
      if (deleteNodeOnStorageFailure) {
        await this.nodesService.deleteNode(node.id);
      }
      throw error;
    }

    await this.versionsService.createVersion(node.id, uploadedFile);
    return toNodeDto(node);
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
  @Get("/file/:id")
  async getFileContent(
    @Res({ passthrough: true }) res: Response,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("version") version?: string,
  ) {
    const node = await this.nodesService.getNodeById(id);
    if (node.isFolder) {
      throw new BadRequestException(
        "The specified node is a folder, not a file.",
      );
    }
    // Either retrieves the user-specified version or the current version
    const nodeVersion = version ?? await this.versionsService.getCurrentNodeVersion(id);

    const fileStream = this.filesService.retrieveFileStream(id, nodeVersion);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", "application/octet-stream");

    return new StreamableFile(fileStream);
  }

  /**
   * Uploads a file and creates a node for it.
   * @param file File to upload.
   * @param parentId Optional UUID of the folder that will contain the uploaded file.
   */
  @Post("/files/new-node")
  @UseInterceptors(FileInterceptor("file"))
  async createFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 10 MB Max Size
          new MaxFileSizeValidator({ maxSize: 10 * 1048576 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body("parentId") parentId?: string,
  ): Promise<NodeDto> {
    const nodeDto: CreateNodeDto = {
      name: file.originalname,
      isFolder: false,
      parentId: parentId ?? undefined,
    };
    const node = await this.nodesService.createNode(nodeDto);
    return this.uploadVersionForNode(file, node, true);
  }

  /**
   * Uploads a new version of an existing file node.
   * @param id UUID of the file node to update.
   * @param file New file contents.
   */
  @Post("/files/new-version")
  @UseInterceptors(FileInterceptor("file"))
  async createFileVersion(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1048576 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body("id", new ParseUUIDPipe()) id: string,
  ): Promise<NodeDto> {
    const node = await this.nodesService.getNodeById(id);
    if (node.isFolder) {
      throw new BadRequestException(
        "The specified node is a folder, not a file.",
      );
    }

    return this.uploadVersionForNode(file, node);
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
   * Deletes a file and its versions, or an empty folder.
   * @param id UUID of the file or folder node to delete.
   */
  @Delete("/files/:id")
  async deleteNode(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    const allVersions = await this.versionsService.getAllVersionEntriesById(id);
    const versionDeletionResults = await Promise.allSettled(
      allVersions.map(async (version) => {
        await this.filesService.deleteFile(version.nodeId, version.nodeVersion);
        await this.versionsService.deleteVersion(
          version.nodeId,
          version.nodeVersion,
        );
      }),
    );
    const versionDeletionFailures = versionDeletionResults.filter(
      (result) => result.status === "rejected",
    );
    if (versionDeletionFailures.length > 0) {
      const message = versionDeletionFailures
        .map((result) =>
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
        )
        .join("; ");
      throw new InternalServerErrorException(message);
    }

    if ((await this.versionsService.getAllVersionEntriesById(id)).length !== 0) {
      throw new InternalServerErrorException(
        "Another version was uploaded during deletion; the file could not be removed completely.",
      );
    }

    await this.nodesService.deleteNode(id);
  }

  /**
   * Deletes a specific version of a file.
   * If the current version is deleted, sets the most recent remaining version as current.
   * Returns the new current version regardless
   * @param id UUID of the file node.
   * @param version Version identifier to delete.
   */
  @Delete("/file-version/:id")
  async deleteFileVersion(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("version") version: string,
  ): Promise<string> {
    // If there is only one remaining version, should call the node deletion endpoint
    if((await this.versionsService.getAllVersionEntriesById(id)).length <= 1)
      throw new BadRequestException("Calling this endpoint requires more than one remaining version");

    const currentFileVersion = await this.versionsService.getCurrentNodeVersion(id);
    await this.filesService.deleteFile(id, version);
    await this.versionsService.deleteVersion(id, version);
    
    if(currentFileVersion === version)
      return this.versionsService.findAndSetNewCurrentVersion(id);
    else return currentFileVersion;
  }

  /**
   * Rolls a file back to a specific version by deleting all newer versions.
   * The specified version becomes the current version.
   * Returns the new current version
   * @param id UUID of the file node.
   * @param version Version identifier to roll back to.
   */
  @Delete("/file-version/rollback/:id")
  async rollbackFileVersion(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("version") version: string,
  ): Promise<string> {
    if(await this.versionsService.getCurrentNodeVersion(id) === version)
      throw new BadRequestException("This is already the current version");
    const newerVersions = await this.versionsService.getNewerVersions(
      id,
      version,
    );

    const deletionResults = await Promise.allSettled(
      newerVersions.map(async (newerVersion) => {
        try {
          await this.filesService.deleteFile(
            newerVersion.nodeId,
            newerVersion.nodeVersion,
          );
        } catch (error) {
          throw new InternalServerErrorException(
            `Version ${newerVersion.nodeVersion} failed to be deleted from storage during rollback. Other versions may have been deleted in this process`,
            { cause: error },
          );
        }

        try {
          await this.versionsService.deleteVersion(
            newerVersion.nodeId,
            newerVersion.nodeVersion,
          );
        } catch (error) {
          throw new InternalServerErrorException(
            `Version ${newerVersion.nodeVersion} failed to be deleted from the database. Other versions may have been deleted in this process`,
            { cause: error },
          );
        }
      }),
    );

    const currentVersion =
      await this.versionsService.findAndSetNewCurrentVersion(id);
    const failedDeletion = deletionResults.find(
      (result) => result.status === "rejected",
    );
    if (failedDeletion) {
      throw failedDeletion.reason;
    }

    return currentVersion;
  }
}
