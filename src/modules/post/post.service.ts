import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly uploadService: UploadService,
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
    });

    return {
      ...post,
      images: saveImage,
    };
  }

  async deatail(id: number) {
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
    
    if(!getPostByUser || getPostByUser.length === 0){
        return {message: "Người dùng này chưa có bài viết nào cả"}
    }

    return getPostByUser;
  }
}
