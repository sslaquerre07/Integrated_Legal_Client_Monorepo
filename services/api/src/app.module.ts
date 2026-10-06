import { Module } from '@nestjs/common';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [NodesModule],
})
export class AppModule {}
