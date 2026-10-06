import { Controller, Get, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { NodesService } from './nodes.service';

@Controller('nodes')
export class NodesController {
  // Utilities setup
  private readonly logger = new Logger(NodesController.name);
  constructor(@Inject(NodesService) private readonly nodesService: NodesService) {}

  @Get()
  async findAll() {
    try {
      const nodes = await this.nodesService.getAllNodes();
      return { success: true, data: nodes };
    } catch (error: unknown) {
      this.logger.error('Database connection failed:', error);
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      throw new HttpException(
        { success: false, error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
