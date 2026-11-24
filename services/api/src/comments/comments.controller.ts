import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {
  constructor(
    @Inject(CommentsService) private readonly commentsService: CommentsService,
  ) {}

  @Get("/perPage/:id")
  async getPageComments(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("version") version: string,
    @Query("page", ParseIntPipe) page: number,
  ) {
    const threadHeads = await this.commentsService.getThreadHeads(
      id,
      version,
      page,
    );
    return Promise.all(
      threadHeads.map((head) => this.commentsService.buildThread(head)),
    );
  }
}