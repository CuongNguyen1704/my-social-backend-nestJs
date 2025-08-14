import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

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
    @Get('parent-id/:parent_id')
    async ListReplyComment(@Param('parent_id') parent_id: number){
        const listReply = await this.commentService.listReply(parent_id)
        return listReply
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteComment(@Param('id') id:number, @Request() req:RequestWithUser){
       const deleteComment =  await this.commentService.deleteComment(id,req.user.id)
       return deleteComment 
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async  updateComment(@Body() content:UpdateCommentDto,@Param('id') id:number, @Request() req:RequestWithUser){
         const updateComment = await this.commentService.update(content,req.user.id,id)
         return updateComment
    }


    


}