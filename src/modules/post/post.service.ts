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

    let imageEntities: ImageEntity[] = [];
    if (Array.isArray(updateDto.images)) {
      imageEntities = updateDto.images.map((url) => {
        const image = new ImageEntity();
        image.url = url;
        image.post = post;
        return image;
      });
    }

    post.content = updateDto.content ?? post.content;

    if (images && images.length > 0) {
      await this.imageService.deleteImagesByPostId(post_id);

      const urls = await Promise.all(
        images.map((file) => this.uploadService.upload(file)),
      );
      const imageEntities = urls.map((url) => {
        const image = new ImageEntity();
        image.url = url as string;
        image.post = post;
        return image;
      });

      post.images = imageEntities;
    }

    await this.postRepository.save(post);
  }
}
