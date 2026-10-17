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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NodesService } from './nodes.service';
import { CreateNodeDto, ResponseNodeDto } from '../dtos/nodes.dto';
import { FilesService } from './files.service';
import { ItemNode } from '../entities/node.entity';
import { BatchActionItemResult, BatchActionResult } from './types';

@Controller('nodes')
export class NodesController {
  // Utilities setup
  constructor(
    @Inject(NodesService) private readonly nodesService: NodesService,
    @Inject(FilesService) private readonly filesService: FilesService,
  ) {}

  // Helper functions
  private collectBatchResults<T>(results: BatchActionItemResult<T>[]): BatchActionResult<T> {
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

  @Get()
  async getFolderStructure(
    @Query('depth', new DefaultValuePipe(1), ParseIntPipe) depth: number,
    @Query('rootId', new ParseUUIDPipe({ optional: true })) rootId?: string,
  ) {
    if (depth < 1) {
      throw new BadRequestException('depth must be a positive integer');
    }
    return await this.nodesService.getFolderStructure(depth, rootId);
  }

  @Post('/files')
  @UseInterceptors(FilesInterceptor('files'))
  async createNode(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('parentId') parentId?: string,
  ): Promise<BatchActionResult<ResponseNodeDto>> {
    const results: BatchActionItemResult<ResponseNodeDto>[] = await Promise.all(files.map(async (file, index) => {
      const nodeDto: CreateNodeDto = {
        name: file.originalname,
        isFolder: false,
        parentId: parentId ?? undefined,
      };
      let node: ItemNode;

      try {
        node = await this.nodesService.createNode(nodeDto);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false as const, stage: 'database', message };
      }

      try {
        await this.filesService.uploadFile(file, node.id);
        return { success: true as const, value: ResponseNodeDto.fromEntity(node) };
      } catch (error) {
        await this.nodesService.deleteNode(node.id);
        const message = error instanceof Error ? error.message : String(error);
        return { success: false as const, stage: 'storage', message };
      }
    }));

    return this.collectBatchResults(results);
  }

  @Post('/folders')
  async createFolder(@Body('name') name: string, @Body('parentId') parentId?: string): Promise<ResponseNodeDto> {
    const nodeDto: CreateNodeDto = {
      name,
      isFolder: true,
      parentId: parentId ?? undefined,
    };
    const node = await this.nodesService.createNode(nodeDto);
    return ResponseNodeDto.fromEntity(node);
  }

  @Patch('/:id')
  async updateNode(@Param('id', new ParseUUIDPipe()) id: string, @Body() nodeDto: Partial<CreateNodeDto>): Promise<ResponseNodeDto> {
    const updatedNode = await this.nodesService.updateNode(id, nodeDto);
    return ResponseNodeDto.fromEntity(updatedNode);
  }

  @Delete('/files')
  async deleteNodes(@Body('ids') ids: string[]): Promise<BatchActionResult<{ id: string }>> {
    const results: BatchActionItemResult<{ id: string }>[] = await Promise.all(ids.map(async (id) => {
      try {
        await this.filesService.deleteFile(id);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false as const, stage: 'storage', message };
      }

      try {
        await this.nodesService.deleteNode(id);
        return { success: true as const, key: id, value: { id } };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false as const, stage: 'database', message };
      }
    }));

    return this.collectBatchResults(results);
  }

  // TODO: Need to consider if there's anything within these folders
  // @Delete('/folders')
  // async deleteFolders(@Body('ids') ids: string[]): Promise<BatchActionResult<{ id: string }>> {
  // }
}
