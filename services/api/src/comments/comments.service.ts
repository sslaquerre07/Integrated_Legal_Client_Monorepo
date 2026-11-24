import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}
}