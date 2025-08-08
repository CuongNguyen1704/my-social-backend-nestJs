import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

@Controller('comment')
export class CommentController{
    constructor(
        private readonly commentService:CommentService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() commentDto:CreateCommentDto,@Request() req:RequestWithUser){
        const comment = await  this.commentService.create(commentDto,req.user.id)
        return comment
    }

    @UseGuards(JwtAuthGuard)
    @Get('list-comment-by-post/:id')
    async listCommentByPost(@Param('id') post_id:number,@Query() paginationQuery:PaginationQueryDto ){
        const listCommentByPost = await this.commentService.listCommentByPost(post_id,paginationQuery)
        return listCommentByPost
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async ListReplyComment(@Query() paginationQueryDto:PaginationQueryDto){
        const listReply = await this.commentService.listReply(paginationQueryDto)
        return listReply
    }


}