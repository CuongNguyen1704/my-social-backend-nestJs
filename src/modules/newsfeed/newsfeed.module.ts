import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/conmment.module';
import { FriendModule } from '../friend/friend.module';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendShipEntity } from '../friend/entities/friendship.entity';
import { CommentEntity } from '../comment/comment.entity';
import { PostEntity } from '../post/post.entity';
import { LikeEntity } from '../like/like.entity';

@Module({
  imports: [
    PostModule,
    LikeModule,
    CommentModule,
    FriendModule,
    TypeOrmModule.forFeature([
      FriendShipEntity,
      CommentEntity,
      PostEntity,
      LikeEntity,
    ]),
  ],
  controllers: [NewsfeedController],
  providers: [NewsfeedService],
  exports: [NewsfeedService],
})
export class NewsfeedModule {}
