import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendShipEntity } from "../entities/friendship.entity";
import { Repository } from "typeorm";

@Injectable()
export class friendShipSerice {
    constructor(
        @InjectRepository(FriendShipEntity)
        private readonly frienShipEnity: Repository<FriendShipEntity>

        
    ){}


}