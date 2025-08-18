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
import { FRIEND_REQUEST_STATUS } from '../enums';
import { FriendShipEntity } from '../entities/friendship.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,

    private readonly userService: UserService,
    @InjectRepository(FriendShipEntity)
    private readonly friendShipRepository: Repository<FriendShipEntity>,
  ) {}

  async sendOrCancelFriendRequest(request_id: number, addressee_id: number) {
    await this.userService.findById(addressee_id);
    if (request_id === addressee_id){
      throw new BadRequestException('Không thể kết bạn với chính mình');
    }

    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { requester: { id: request_id }, addressee: { id: addressee_id } },
        { requester: { id: addressee_id }, addressee: { id: request_id } },
      ],
      relations: ['requester', 'addressee'],
    });

    if (!friendRequest) {
      const newfriendRequest = this.friendRequestRepository.create({
        requester_id: request_id,
        addressee_id: addressee_id,
      });
      const saveRequest = await this.friendRequestRepository.save(newfriendRequest);
      return {
        message:"Gửi lời mời kết bạn thành công ",
        saveRequest
      }
    }

    if(friendRequest.status == FRIEND_REQUEST_STATUS.CANCEL){
       const updateRequest = await  this.friendRequestRepository.update(friendRequest.id,{status:FRIEND_REQUEST_STATUS.PENDING})
       return {
          message: "Gửi lại lời mời thành công",
       }
    }

    if (friendRequest.status == FRIEND_REQUEST_STATUS.PENDING) {
      if (friendRequest.addressee.id == request_id) {
          throw new BadRequestException("Bạn không thể gửi lời mời kết bạn khi người đó đã gửi cho bạn")
      }
    }

    if(friendRequest.status == FRIEND_REQUEST_STATUS.ACCEPTED){
        throw new BadRequestException("Bạn không thể gửi lời mời khi người đó đã là bạn của bạn")
    }

    if (friendRequest.requester.id === request_id && friendRequest.status == FRIEND_REQUEST_STATUS.PENDING){
      await this.friendRequestRepository.update(friendRequest.id,{status:FRIEND_REQUEST_STATUS.CANCEL});
      return { message: 'đã hủy lời mời' };
    }
    
  }
}
