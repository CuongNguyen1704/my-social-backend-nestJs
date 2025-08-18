import { Controller } from "@nestjs/common";
import { friendShipSerice } from "../services/friend_ship.service";

@Controller('friend-ship')
export class FriendShipController {
    constructor(
        private readonly friendShipService:friendShipSerice
    ){}

    
}