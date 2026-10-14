import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './nodes.dto';

@Controller('nodes')
export class NodesController {
  // Utilities setup
  constructor(@Inject(NodesService) private readonly nodesService: NodesService) {}

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const node = await this.nodesService.getNodeById(id);
    return { success: true, data: node };
  }

  @Post()
  async createNode(@Body() nodeDto: CreateNodeDto) {
    const node = await this.nodesService.createNode(nodeDto);
    return { success: true, data: node };
  }

  @Patch('/:id')
  async updateNode(@Param('id') id: string, @Body() nodeDto: Partial<CreateNodeDto>) {
    const updatedNode = await this.nodesService.updateNode(id, nodeDto);
    return { success: true, data: updatedNode };
  }

  @Delete('/:id')
  async deleteNode(@Param('id') id: string) {
    await this.nodesService.deleteNode(id);
    return { success: true, message: 'Node deleted successfully' };
  }
}
