import { Controller, Inject } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("nodes")
export class NodesController {
  // Utilities setup
  constructor(
    @Inject(CommentsService) private readonly commentsService: CommentsService,
  ) {}
}