import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShipEntity } from '../entities/friendship.entity';
import { Repository } from 'typeorm';
import { FRIEND_REQUEST_STATUS, FRIEND_SHIP_STATUS } from '../enums';
import { FriendRequestEntity } from '../entities/friend_request.entity';

@Injectable()
export class friendShipSerice {
  constructor(
    @InjectRepository(FriendShipEntity)
    private readonly frienShipRepository: Repository<FriendShipEntity>,

    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  async unFriend(userId: number, friend_id: number) {
    const friendships = await this.frienShipRepository.find({
      where: [
        { user_id: userId, friend_id: friend_id },
        { user_id: friend_id, friend_id: userId },
      ],
    });
    if (friendships.length === 0) {
      throw new NotFoundException('2 bạn chưa phải là bạn bè');
    }

    const allActive = friendships.every(
      (f) => f.status === FRIEND_SHIP_STATUS.ACTIVE,
    );
    if (!allActive) {
      throw new BadRequestException('Chỉ có thể hủy khi đang là bạn bè');
    }
    for (const friendship of friendships) {
      ((friendship.status = FRIEND_SHIP_STATUS.UNFRIENDED),
        await this.frienShipRepository.save(friendship));
    }

    const requestFriend = await this.friendRequestRepository.findOne({
      where: [
        { requester_id: userId, addressee_id: friend_id },
        { requester_id: friend_id, addressee_id: userId },
      ],
    });
    if (requestFriend) {
      await this.friendRequestRepository.update(requestFriend.id, {
        status: FRIEND_REQUEST_STATUS.CANCEL,
      });
    }

    return {
      message: 'đã hủy kết bạn thành công',
    };
  }
}
