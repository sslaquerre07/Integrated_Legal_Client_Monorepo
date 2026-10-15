import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { ItemNode } from '../entities/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemNode])],
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
