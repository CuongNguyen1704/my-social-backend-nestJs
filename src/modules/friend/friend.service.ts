import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendShipsEntity } from './friend.entity';
import { Repository } from 'typeorm';
import { RequestWithUser } from '../auth/type/Request-with-user.interface';
import { UserService } from '../user/user.service';
import { FRIENDSHIPSTATUS } from './enums';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendShipsEntity)
    private readonly friendShipRepository: Repository<FriendShipsEntity>,

    private readonly userService: UserService,
  ) {}

  async sendRequest(request_id: number, addressee_id: number) {
     await this.userService.findById(addressee_id);
    if (request_id === addressee_id) {
      throw new BadRequestException('Không thể kết bạn với chính mình');
    }

    const friendship = await this.friendShipRepository.findOne({
      where: [
        { requester: { id: request_id }, addressee: { id: addressee_id } },
        {addressee:{id:addressee_id},requester:{id:request_id}},
      ],
      relations:['requester','addressee'],
      
    });

    if(!friendship){
        const newFriendShip = this.friendShipRepository.create({
            requester_id:request_id,
            addressee_id:addressee_id,

        })
        return this.friendShipRepository.save(newFriendShip);
    }

    if(friendship.status == FRIENDSHIPSTATUS.PENDING){
        if(friendship.addressee.id == request_id){
            friendship.status = FRIENDSHIPSTATUS.ACCEPTED
            return this.friendShipRepository.save(friendship)
        }
    }

    if(friendship.requester.id === request_id){
        await this.friendShipRepository.remove(friendship)
        return {message:"đã hủy lời mời"}
    }

    if(friendship.status === FRIENDSHIPSTATUS.ACCEPTED){
        await this.friendShipRepository.remove(friendship);
        return {message:"Đã hủy kết bạn"}
    }

    return friendship


  }
}
