import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from './like.entity';
import { Repository } from 'typeorm';
import { CreatePostLikeDto } from './dto/create-like-post.dto';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { CreateLikeCommentDto } from './dto/create-like-comment';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  async createPostLike(likeDto: CreatePostLikeDto, user_id: number) {
    await this.postService.findById(likeDto.related_id);
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_type: likeDto.related_type,
        related_id: likeDto.related_id,
        user_id: user_id,
      },
      relations: ['user'],
    });

    if (existingLike) {
      throw new BadRequestException(' Đã Like Bài Viết');
    }

    const newLike = await this.likeRepository.create({
      related_type: likeDto.related_type,
      related_id: likeDto.related_id,
      user: { id: user_id },
    });

    const saveLikePost = await this.likeRepository.save(newLike);

    return saveLikePost;
  }

  async createCommentLike(commentDto: CreateLikeCommentDto, user_id: number) {
    await this.commentService.findById(commentDto.related_id);
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_id: commentDto.related_id,
        related_type: commentDto.related_type,
        user_id: user_id,
      },
      relations: ['user'],
    });

    if (existingLike) {
      throw new BadRequestException(' Đã Like Comment');
    }

    const newLikeComment = await this.likeRepository.create({
      related_id: commentDto.related_id,
      related_type: commentDto.related_type,
      user: { id: user_id },
    });

    const saveLike = await this.likeRepository.save(newLikeComment);
    return saveLike;
  }
}
