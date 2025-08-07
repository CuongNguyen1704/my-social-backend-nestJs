import { Injectable } from '@nestjs/common';
import { PostEntity } from '../post/post.entity';
import { ImageEntity } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,

    private readonly uploadSevice: UploadService,
  ) {}

  async createImage(
    images: Express.Multer.File[],
    post: PostEntity,
  ): Promise<ImageEntity[]> {
    // console.log("🚀 ~ ImageService ~ createImage ~ post:", post)
    const urls: string[] = [];
    for (const file of images) {
      const url = await this.uploadSevice.upload(file);
      if (url) {
        urls.push(url);
      }
    }

    const ImageEntities = urls.map((url) => {
      const image = new ImageEntity();
      image.url = url;
      image.post_id = post.id;
      return image;
    });

    return await this.imageRepository.save(ImageEntities);
  }

  async deleteImgage(imageIdDelete: number[], post_id: number) {
    const images = await this.imageRepository.find({
      where: {
        id: In(imageIdDelete),
        post_id: post_id,
      },
    });

    await this.imageRepository.remove(images);
  }
}
