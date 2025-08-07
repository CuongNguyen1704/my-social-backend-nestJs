import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService{
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository:Repository<CommentEntity>
    ){}

    async create(commentDto:CreateCommentDto,user_id:number){
        const createComment = await this.commentRepository.create({
            content:commentDto.content,
            post_id:commentDto.post_id,
            user_id:user_id
        })

        const saveComment = await this.commentRepository.save(createComment)
        
        return saveComment
    }
}