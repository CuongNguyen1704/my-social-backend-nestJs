import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { In, Repository } from 'typeorm';
import { ImageEntity } from '../image/image.entity';
import { CreatePostDto } from './dto/create.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UploadService } from '../upload/upload.service';
import { ImageService } from '../image/image.service';
import { UpdatePostDto } from './dto/update.dto';
import { url } from 'inspector';
import { error } from 'console';
import { LikeService } from '../like/like.service';
import { LikeEntity } from '../like/like.entity';
import { RelatedType } from '../user/enums';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly uploadService: UploadService,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}

  async create(
    dto: CreatePostDto,
    user_id: number,
    images: Express.Multer.File[],
  ) {
    const user = await this.userService.findById(user_id);
    const post = this.postRepository.create({
      content: dto.content,
      user: user,
    });
    const savePost = await this.postRepository.save(post);

    const imageEntities = await this.imageService.createImage(images, savePost);

    return {
      ...savePost,
      images: imageEntities,
    };
  }

  async update(
    updateDto: UpdatePostDto,
    user_id: number,
    images: Express.Multer.File[],
    post_id: number,
  ) {
    const post = await this.postRepository.findOne({
      where: { id: post_id },
      relations: ['user', 'images'],
    });
    if (!post) {
      throw new NotFoundException('không có bài viết nào thỏa mãn');
    }

    if (post.user.id !== user_id) {
      throw new BadRequestException('Bạn không có quyền sửa bài viết này');
    }

    if (updateDto.imageIdDelete?.length) {
      // chỗ này phải là mảng ids muốn xóa
      await this.imageService.deleteImgage(updateDto.imageIdDelete, post_id);
    }

    let saveImage: ImageEntity[] = [];
    if (Array.isArray(images) && images.length > 0) {
      saveImage = await this.imageService.createImage(images, post);
    }

    // chỗ này m đang lưu bài post cũ gồm cả ảnh cũ, nhưng ảnh cũ bị xóa ở đoạn trên nên gây lỗi
    await this.postRepository.update(post.id, {
      content: updateDto.content ?? post.content,
      is_updated: true,
    });

    const postUpdate = await this.postRepository.findOne({
      where: { id: post_id },
      relations: ['user', 'images'],
    });

    return {
      Post: postUpdate,
      images: saveImage,
    };
  }

  async deatail(id: number) {
    if(!id || isNaN(id)){
      throw new BadRequestException("Ivalid post id")
    }
    const postDeatail = await this.postRepository.findOne({
      where: { id: id },
      relations: ['images', 'user'],
    });
    if (!postDeatail) {
      throw new NotFoundException('Không có bài viết nào thỏa mãn');
    }

    return postDeatail;
  }

  async findById(post_id: number) {
    const checkPost = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
    });

    if (!checkPost) {
      throw new NotFoundException('Không có bài viết nào hợp lệ');
    }

    return checkPost;
  }

  async getPostByUser(id: number) {
    await this.userService.findById(id);
    const getPostByUser = await this.postRepository.find({
      where: {
        user: { id: id },
      },
      order: {
        createAt: 'DESC',
      },
      relations: ['user', 'images'],
    });

    if (!getPostByUser || getPostByUser.length === 0) {
      return { message: 'Người dùng này chưa có bài viết nào cả' };
    }

    return getPostByUser;
  }

  async decrementPostLike(related_id: number) {
    await this.postRepository.decrement({ id: related_id }, 'like_count', 1);
  }

  async incrementPostLike(related_id: number) {
    await this.postRepository.increment({ id: related_id }, 'like_count', 1);
  }

  async incrementCommentCount(post_id: number) {
    await this.postRepository.increment({ id: post_id }, 'comment_count', 1);
  }

  async decrementCommentCount(post_id: number) {
    this.postRepository.decrement({ id: post_id }, 'comment_count', 1);
  }

  async getAll(user_id: number) {
    const posts = await this.postRepository.find();

    let likePostIds: number[] = [];

    if (user_id) {
      const likePosts = await this.likeRepository.find({
        where: {
          user_id,
          related_type: RelatedType.POST,
          related_id: In(posts.map((p) => p.id)),
        },
      });
      likePostIds = likePosts.map((lp) => lp.related_id);
    }

    return posts.map((post) => ({
      ...post,
      isLike: likePostIds.includes(post.id),
    }));
  }
}
