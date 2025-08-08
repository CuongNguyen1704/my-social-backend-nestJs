import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";

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
}