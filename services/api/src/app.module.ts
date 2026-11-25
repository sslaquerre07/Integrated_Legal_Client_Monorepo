import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodesModule } from './nodes/nodes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemNode } from './entities/node.entity';
import { Version } from './entities/version.entity';
import { Comment } from './entities/comment.entity';
import { CommentsModule } from './comments/comments.modules';
import { getDatabaseConfig } from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...getDatabaseConfig((name) => configService.get<string>(name)),
          entities: [ItemNode, Version, Comment],
        };
      },
    }),
    NodesModule,
    CommentsModule,
  ],
})
export class AppModule {}
