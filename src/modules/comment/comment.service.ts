import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UserService } from "../user/user.service";
import { PostService } from "../post/post.service";

@Injectable()
export class CommentService{
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository:Repository<CommentEntity>,
        private readonly userService:UserService,
        private readonly postService:PostService 
    ){}

    async create(commentDto:CreateCommentDto,user_id:number){
        await this.postService.findById(commentDto.post_id)
        await this.userService.findById(user_id)
        const createComment = this.commentRepository.create({
            content:commentDto.content,
            post_id:commentDto.post_id,
            user_id:user_id
        })

        const saveComment = await this.commentRepository.save(createComment)
        
        return saveComment 
    }
}