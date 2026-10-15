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
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto, ResponseNodeDto } from '../dtos/nodes.dto';

@Controller('nodes')
export class NodesController {
  // Utilities setup
  constructor(@Inject(NodesService) private readonly nodesService: NodesService) {}

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

  @Post()
  async createNode(@Body() nodeDto: CreateNodeDto): Promise<ResponseNodeDto> {
    const node = await this.nodesService.createNode(nodeDto);
    return ResponseNodeDto.fromEntity(node);
  }

  @Patch('/:id')
  async updateNode(@Param('id', new ParseUUIDPipe()) id: string, @Body() nodeDto: Partial<CreateNodeDto>): Promise<ResponseNodeDto> {
    const updatedNode = await this.nodesService.updateNode(id, nodeDto);
    return ResponseNodeDto.fromEntity(updatedNode);
  }

  @Delete('/:id')
  async deleteNode(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.nodesService.deleteNode(id);
    return { message: 'Node deleted successfully' };
  }
}
