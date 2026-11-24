import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../entities/comment.entity";
import { Repository } from "typeorm";
import type { CommentDTO } from "@repo/types";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}
  
  async buildThread(comment: Comment): Promise<CommentDTO[]> {
    const threadComments = await this.repository
      .createQueryBuilder("comment")
      .where("comment.node_id = :nodeId", { nodeId: comment.nodeId })
      .andWhere("comment.node_version = :nodeVersion", {
        nodeVersion: comment.nodeVersion,
      })
      .andWhere("comment.page = :page", { page: comment.page })
      .andWhere("(comment.id = :headId OR comment.parent_id = :headId)", {
        headId: comment.id,
      })
      .orderBy("comment.created_at", "ASC")
      .addOrderBy("comment.id", "ASC")
      .getMany();

    return threadComments.map((comment) => comment as CommentDTO);
  }
  
  async getThreadHeads(
    nodeId: string,
    nodeVersion: string,
    page?: number,
  ): Promise<Comment[]> {
    const query = this.repository
      .createQueryBuilder("comment")
      .where("comment.node_id = :nodeId", { nodeId })
      .andWhere("comment.node_version = :nodeVersion", { nodeVersion })
      .andWhere("comment.parent_id IS NULL");

    if (page !== undefined) {
      query.andWhere("comment.page = :page", { page });
    }

    return query.orderBy("comment.created_at", "ASC").getMany();
  }

}