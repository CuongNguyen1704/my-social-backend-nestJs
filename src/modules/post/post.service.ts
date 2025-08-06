import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from '../image/image.entity';
import { CreatePostDto } from './dto/create.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UploadService } from '../upload/upload.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,

    private readonly userService: UserService,
    private readonly uploadSevice: UploadService,

    private readonly imageService:ImageService
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

    const imageEntities = await this.imageService.uploadImages(images, savePost);

    return {
      ...savePost,
      images: imageEntities,
    };
  }
}
