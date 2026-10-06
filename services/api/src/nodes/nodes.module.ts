import { Module } from '@nestjs/common';
import { NodesController } from './nodes.controller';
import { NodesRepository } from './nodes.repository';
import { NodesService } from './nodes.service';

@Module({
  controllers: [NodesController],
  providers: [NodesService, NodesRepository],
})
export class NodesModule {}
