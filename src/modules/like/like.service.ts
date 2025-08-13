import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from './like.entity';
import { Repository } from 'typeorm';
import { CreatePostLikeDto } from './dto/like-post.dto';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { CreateLikeCommentDto } from './dto/like-comment';
import { RelatedType } from '../user/enums';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  async PostLike(likeDto: CreatePostLikeDto, user_id: number) {
    await this.postService.findById(likeDto.related_id);
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_type: RelatedType.POST,
        related_id: likeDto.related_id,
        user: { id: user_id },
      },
      relations: ['user'],
    });

    if (existingLike) {
      await this.likeRepository.delete(existingLike.id);
      await this.postService.decrementPostLike(likeDto.related_id);
      return { message: 'Unlike successfully' };
    }

    const newLike = this.likeRepository.create({
      related_type: RelatedType.POST,
      related_id: likeDto.related_id,
      user: { id: user_id },
    });

    const saveLikePost = await this.likeRepository.save(newLike);
    await this.postService.incrementPostLike(likeDto.related_id);
    return saveLikePost;
  }

  async CommentLike(commentDto: CreateLikeCommentDto, user_id: number) {
    await this.commentService.findById(commentDto.related_id);
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_id: commentDto.related_id,
        related_type:RelatedType.COMMENT,
        user_id: user_id,
      },
      relations: ['user'],
    });

    if (existingLike) {
      await this.likeRepository.delete(existingLike.id);
      await this.commentService.decrementCommentLike(commentDto.related_id);
      return { message: 'Unlike Successfully' };
    }

    const newLikeComment = this.likeRepository.create({
      related_id: commentDto.related_id,
      related_type: RelatedType.COMMENT,
      user: { id: user_id },
    });

    const saveLike = await this.likeRepository.save(newLikeComment);
    await this.commentService.incrementCommentLike(commentDto.related_id);
    return saveLike;
  }
}
