import { Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend_request.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";

@Controller('friends')
export class FriendController {
    constructor(
        private readonly friendShipSerice:FriendService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('send-request/:userId')
    async sendRequest(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const friendShip = await  this.friendShipSerice.sendRequest(req.user.id,userId)
        return friendShip
    }
}