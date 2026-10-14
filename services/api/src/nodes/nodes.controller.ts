import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './nodes.dto';

@Controller('nodes')
export class NodesController {
  // Utilities setup
  constructor(@Inject(NodesService) private readonly nodesService: NodesService) {}

  @Get()
  async findAll() {
    const nodes = await this.nodesService.getAllNodes();
    return { success: true, data: nodes };
  }

  @Get('/findById')
  async findOne(@Body('id') id: string) {
    const node = await this.nodesService.getNodeById(id);
    return { success: true, data: node };
  }

  @Post()
  async createNode(@Body() nodeDto: CreateNodeDto) {
    const node = await this.nodesService.createNode(nodeDto);
    return { success: true, data: node };
  }
}
