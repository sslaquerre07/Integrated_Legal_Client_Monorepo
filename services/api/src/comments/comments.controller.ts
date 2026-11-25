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

  /**
   * Retrieves page's comments on a specific file version.
   * @param id UUID of the file node with the comment.
   * @param version Version of the file with the comment.
   * @param page Page to retrive comments from
   */
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