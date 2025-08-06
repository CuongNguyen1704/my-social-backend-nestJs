import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from '../image/image.entity';
import { CreatePostDto } from './dto/create.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,

    private readonly userService: UserService,
    private readonly uploadSevice: UploadService,
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

    const urls: string[] = [];
    for (const file of images) {
      const url = await this.uploadSevice.upload(file);
      if(url){
        urls.push(url);
      }
      
    }

    const ImageEntities = urls.map((url) => {
      const image = new ImageEntity();
      image.url = url, 
      image.post = savePost;
      return image;
    });

    await this.imageRepository.save(ImageEntities);

    return {
      ...savePost,
      images: ImageEntities,
    };
  }
}
