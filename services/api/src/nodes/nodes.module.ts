import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { ItemNode } from '../entities/node.entity';
import { Version } from '../entities/version.entity';
import { FilesService } from './files.service';
import { VersionsService } from './versions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemNode, Version])],
  controllers: [NodesController],
  providers: [NodesService, FilesService, VersionsService],
})
export class NodesModule {}
