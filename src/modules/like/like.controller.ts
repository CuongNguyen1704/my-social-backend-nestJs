import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import {  CreatePostLikeDto } from "./dto/like-post.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { CreateLikeCommentDto } from "./dto/like-comment";


@Controller('likes')

export class LikeController{

    constructor(private readonly likeSevice:LikeService){}

    @UseGuards(JwtAuthGuard)
    @Post('like-post')
    async LikePost(@Body() likeDto:CreatePostLikeDto,@Request() req:RequestWithUser){
        const postLike = await this.likeSevice.PostLike(likeDto,req.user.id)
        return postLike
    }

    @UseGuards(JwtAuthGuard)
    @Post('like-comment')
    async LikeComment(@Body() commentDto:CreateLikeCommentDto,@Request() req:RequestWithUser){
        const commentLike = await  this.likeSevice.CommentLike(commentDto,req.user.id)
        return commentLike
    }

}