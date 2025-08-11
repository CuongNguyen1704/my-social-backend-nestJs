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
import { UnlikePostDto } from './dto/unlike-post';
import { UnlikeCommentDto } from './dto/unlike-comment.dto';

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

  async deleteLikePost(deletLikePostDto: UnlikePostDto, user_id: number) {
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_id: deletLikePostDto.related_id,
        related_type: deletLikePostDto.related_type,
        user_id: user_id,
      },
      relations: ['user'],
    });

    if (!existingLike) {
      throw new NotFoundException('Chưa like Bài Post Này');
    }

    await this.likeRepository.delete(existingLike.id);

    return { message: 'Unlike bài post thành công' };
  }

  async deleteLikeComment(unlikeCommentDto: UnlikeCommentDto, user_id: number) {
    const existingLike = await this.likeRepository.findOne({
      where: {
        related_id: unlikeCommentDto.related_id,
        related_type: unlikeCommentDto.related_type,
        user_id: user_id,
      },
      relations: ['user'],
    });

    if (!existingLike) {
      throw new NotFoundException('Chưa like Comment Này');
    }

    await this.likeRepository.delete(existingLike.id);

    return { message: 'Unlike comment thành công' };
  }
}
