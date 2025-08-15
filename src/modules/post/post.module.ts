import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { ImageModule } from '../image/image.module';
import { UploadModule } from '../upload/upload.module';
import { UserModule } from '../user/user.module';
import { LikeEntity } from '../like/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity,LikeEntity]), ImageModule,UploadModule,UserModule],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostService]
})
export class PostModule {}
