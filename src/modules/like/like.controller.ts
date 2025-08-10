import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import {  CreatePostLikeDto } from "./dto/create-like-post.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { CreateLikeCommentDto } from "./dto/create-like-comment";

@Controller('like')

export class LikeController{

    constructor(private readonly likeSevice:LikeService){}

    @UseGuards(JwtAuthGuard)
    @Post('like-post')
    async createLikePost(@Body() likeDto:CreatePostLikeDto,@Request() req:RequestWithUser){
        const postLike = await this.likeSevice.createPostLike(likeDto,req.user.id)
        return postLike
    }

    @UseGuards(JwtAuthGuard)
    @Post('like-comment')
    async createLikeComment(@Body() commentDto:CreateLikeCommentDto,@Request() req:RequestWithUser){
        const commentLike = await  this.likeSevice.createCommentLike(commentDto,req.user.id)
        return commentLike
    }
}