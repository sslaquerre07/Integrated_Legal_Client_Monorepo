import { Module } from "@nestjs/common";
import { Comment } from "../entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}