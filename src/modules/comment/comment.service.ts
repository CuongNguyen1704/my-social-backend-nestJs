import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async create(commentDto: CreateCommentDto, user_id: number) {
    await this.postService.findById(commentDto.post_id);
    await this.userService.findById(user_id);

    let parentComment: CommentEntity | null = null;
    if (commentDto.parent_id) {
      parentComment = await this.commentRepository.findOne({
        where: { id: commentDto.parent_id },
        relations: ['post'],
      });
      if (!parentComment) {
        throw new NotFoundException('Trả lời comment không tồn tại');
      }
      if (parentComment.post.id !== commentDto.post_id) {
        throw new BadRequestException(
          'Comment cha phải cùng post với comment hiện tại',
        );
      }
    }

    const createComment = this.commentRepository.create({
      content: commentDto.content,
      post_id: commentDto.post_id,
      user_id: user_id,
      parent: parentComment || undefined,
    });

    const saveComment = await this.commentRepository.save(createComment);

    if (commentDto.parent_id) {
      await this.commentRepository.increment(
        { id: commentDto.parent_id },
        'reply_count',
        1,
      );
    } else {
      await this.postService.incrementCommentCount(commentDto.post_id);
    }
    return saveComment;
  }

  async listCommentByPost(
    post_id: number,
    paginationQuery: PaginationQueryDto,
  ) {
    const { page = 1, limit = 10 } = paginationQuery;

    const [data, total] = await this.commentRepository.findAndCount({
      where: {
        post_id,
        parent_id: IsNull(),
      },
      relations: ['user'],
      order: {
        createAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit),
    };
  }

  async listReply(parent_id: number) {
    const listReply = await this.commentRepository.find({
      where: { parent: { id: parent_id } },
      relations: ['user'],
    });
    return listReply;
  }

  async findById(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
    });
    if (!comment) {
      throw new NotFoundException('Không tồn tại comment ');
    }
  }

  async decrementCommentLike(id: number) {
    await this.commentRepository.decrement({ id: id }, 'like_count', 1);
  }

  async incrementCommentLike(id: number) {
    await this.commentRepository.increment({ id: id }, 'like_count', 1);
  }

  async deleteComment(id: number, user_id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['parent', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    if (comment.user_id !== user_id) {
      throw new ForbiddenException('Bạn không có quyền xóa comment này');
    }

    if (!comment.parent_id) {
      await this.postService.decrementCommentCount(comment.post_id);
    } else {
      await this.commentRepository.decrement(
        { id: comment.parent_id },
        'reply_count',
        1,
      );
    }

    await this.commentRepository.delete(id);

    return {
      message: 'Comment delete successfully',
    };
  }

  async update(contentDto: UpdateCommentDto, user_id: number, id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['post', 'user'],
    });
    if (!comment) {
      throw new NotFoundException('comment không tồn tại');
    }
    if (comment.user_id !== user_id) {
      throw new ForbiddenException('Bạn không có quyền sửa comment này');
    }
    const newContent = contentDto.content.trim()
    if(!newContent){
      throw new BadRequestException("Nội dung không được để trống")
    }
    if(comment.content === newContent){
      throw new BadRequestException("Nội dung mới phải khác nội dung cũ")
    }

    await this.commentRepository.update(id, {
      content: contentDto.content,
      is_updated:true,
      // updateAt:new Date()
    });

    const updateComment = await this.commentRepository.findOne({where:{id:id}})
    return {
      message:"cập nhật thành công",
      updateComment
    }

  }
}
