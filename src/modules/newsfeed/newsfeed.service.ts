import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShipEntity } from '../friend/entities/friendship.entity';
import { In, Repository } from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { LikeEntity } from '../like/like.entity';
import { PostEntity } from '../post/post.entity';

@Injectable()
export class NewsfeedService {
  constructor(
    @InjectRepository(FriendShipEntity)
    private readonly friendShipRepo: Repository<FriendShipEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,

    @InjectRepository(LikeEntity)
    private readonly likeRepo: Repository<LikeEntity>,

    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async getNewFeed(user_id: number) {
    const friendships = await this.friendShipRepo.find({
      where: { user_id: user_id },
    });

    const friendIds = friendships.map((f) => f.friend_id);
    if (friendships.length === 0) return [];

    const posts = await this.postRepo.find({
      where: { user: { id: In(friendIds) } },
      relations: ['user'],
      order: { createAt: 'DESC' },
      take: 100,
    });

    const now = Date.now(); // thời gian hiện tại tính theo mini giây
    const msPerHour = 1000 * 60 * 60; // 1 giờ = 3600000 mili giây

    const scorePosts = posts.map((post) => {
      const likeCount = post.like_count;
      const commentCount = post.comment_count;

      const baseScore = likeCount * 2 + commentCount * 3;

      const hourseCreatePost =
        (now - new Date(post.createAt).getTime()) / msPerHour;

      const timePenaty = hourseCreatePost * 0.1;

      const finalScore = +(baseScore - timePenaty).toFixed(2);

      return {
        ...post,
        score:finalScore
      };
    });

    // sắp xếp điểm từ cao tới thấp
    scorePosts.sort((a,b) => b.score - a.score)

    return scorePosts
  }
}
