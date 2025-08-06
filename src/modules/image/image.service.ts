import { Injectable } from '@nestjs/common';
import { PostEntity } from '../post/post.entity';
import { ImageEntity } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository:Repository<ImageEntity>,

    private readonly uploadSevice:UploadService

  ) {}

  async createImage(
    images: Express.Multer.File[],
    post: PostEntity,
  ): Promise<ImageEntity[]> {
    const urls: string[] = [];
    for (const file of images) {
      const url = await this.uploadSevice.upload(file);
      if (url) {
        urls.push(url);
      }
    }

    const ImageEntities = urls.map((url) => {
      const image = new ImageEntity();
      image.url = url, 
      image.post = post;
      return image;
    });

   return await this.imageRepository.save(ImageEntities);
  }

async deleteImagesByPostId(post_id: number) {
  await this.imageRepository.delete({ post: { id: post_id } });
}
}
