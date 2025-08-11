import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import {  CreatePostLikeDto } from "./dto/create-like-post.dto";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { CreateLikeCommentDto } from "./dto/create-like-comment";
import { UnlikePostDto } from "./dto/unlike-post";
import { UnlikeCommentDto } from "./dto/unlike-comment.dto";

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

    @UseGuards(JwtAuthGuard)
    @Delete('unlike-post')
    async unlikePost (@Body() deletLikePostDto:UnlikePostDto,@Request() req:RequestWithUser){
        const unLikePost = await this.likeSevice.deleteLikePost(deletLikePostDto,req.user.id)
        return unLikePost
    }

    @UseGuards(JwtAuthGuard)
    @Delete('unlike-comment')
    async unlikeComment(@Body() unlikeCommentDto:UnlikeCommentDto,@Request() req:RequestWithUser){
        const unlikeComment = await this.likeSevice.deleteLikeComment(unlikeCommentDto,req.user.id)
        return unlikeComment
    }
}