import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../entities/friend_request.entity';
import { Repository } from 'typeorm';
import { RequestWithUser } from '../../auth/type/Request-with-user.interface';
import { UserService } from '../../user/user.service';
import { FRIEND_REQUEST_STATUS, FRIEND_SHIP_STATUS } from '../enums';
import { FriendShipEntity } from '../entities/friendship.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,

    private readonly userService: UserService,
    @InjectRepository(FriendShipEntity)
    private readonly friendShipRepository: Repository<FriendShipEntity>,
  ) {}

  async sendOrCancelFriendRequest(request_id: number, addressee_id: number) {
    await this.userService.findById(addressee_id);
    if (request_id === addressee_id) {
      throw new BadRequestException('Không thể kết bạn với chính mình');
    }

    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { requester: { id: request_id }, addressee: { id: addressee_id },status:FRIEND_REQUEST_STATUS.PENDING },
        { requester: { id: addressee_id }, addressee: { id: request_id },status:FRIEND_REQUEST_STATUS.PENDING },
      ],
      relations: ['requester', 'addressee'],
    });

    const friendShip = await this.friendShipRepository.findOne({
      where: [
        { user_id: request_id, friend_id: addressee_id },
        { user_id: addressee_id, friend_id: request_id },
      ],
    });
    if (friendShip && !friendShip.deleteAt) {
      throw new BadRequestException(
        'Bạn không thể gửi lời mời khi đã là bạn bè',
      );
    }

    if (friendRequest?.status == FRIEND_REQUEST_STATUS.PENDING) {
      if (friendRequest.addressee.id == request_id) {
        throw new BadRequestException(
          'Bạn không thể gửi lời mời kết bạn khi người đó đã gửi cho bạn',
        );
      }
    }
    if (!friendRequest) {
      const newfriendRequest = this.friendRequestRepository.create({
        requester_id: request_id,
        addressee_id: addressee_id,
      });
      const saveRequest =
        await this.friendRequestRepository.save(newfriendRequest);
      return {
        message: 'Gửi lời mời kết bạn thành công ',
        saveRequest,
      };
    } else {
      await this.friendRequestRepository.update(friendRequest?.id, {
        status: FRIEND_REQUEST_STATUS.CANCEL,
      });
      return { message: 'đã hủy lời mời' };
    }
  }

  async accept(userId: number, friend_id: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: {
        requester_id: friend_id,
        addressee_id: userId,
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
    });
    if (!friendRequest) {
      throw new BadRequestException('không tìm thấy lời mời kết bạn');
    }
    await this.friendRequestRepository.update(friendRequest.id, {
      status: FRIEND_REQUEST_STATUS.ACCEPTED,
    });
    const saveFriend1 = this.friendShipRepository.create({
      user_id: userId,
      friend_id: friend_id,
    });

    const saveFriend2 = this.friendShipRepository.create({
      user_id: friend_id,
      friend_id: userId,
    });
    await this.friendShipRepository.save([saveFriend1, saveFriend2]);

    return {
      message: 'kết bạn thành công',
    };
  }

  async reject(userId: number, friend_id: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: {
        requester_id: friend_id,
        addressee_id: userId,
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
    });
    if (!friendRequest) {
      throw new BadRequestException('không tìm thấy lời mời kết bạn');
    }
    await this.friendRequestRepository.update(friendRequest.id, {
      status: FRIEND_REQUEST_STATUS.REJECT,
    });

    return {
      message: 'Từ chối kết bạn thành công',
    };
  }

  async listRequest(user_id: number) {
    const listRequest = await this.friendRequestRepository.find({
      where: { addressee_id: user_id },
      relations: ['requester', 'addressee'],
    });
    return listRequest;
  }
}
