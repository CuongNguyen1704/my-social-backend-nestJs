import { Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { FriendService } from "../services/friend_request.service";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RequestWithUser } from "../../auth/type/Request-with-user.interface";

@Controller('friends')
export class FriendController {
    constructor(
        private readonly friendShipSerice:FriendService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('send-request/:userId')
    async sendOrCancelFriendRequest(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const friendShip = await  this.friendShipSerice.sendOrCancelFriendRequest(req.user.id,userId)
        return friendShip
    }
}