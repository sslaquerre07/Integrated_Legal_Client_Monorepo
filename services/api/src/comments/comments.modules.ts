import { Module, Version } from "@nestjs/common";
import { Comment } from "../entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Version, Comment])],
  controllers: [],
  providers: [],
})
export class NodesModule {}