import { Controller, Get, Param, Put, Request, UseGuards } from "@nestjs/common";
import { friendShipSerice } from "../services/friend_ship.service";
import { JwtAuthGuard } from "src/modules/guards/jwt-auth.guard";
import { RequestWithUser } from "src/modules/auth/type/Request-with-user.interface";

@Controller('friend-ship')
export class FriendShipController {
    constructor(
        private readonly friendShipService:friendShipSerice
    ){}

    @UseGuards(JwtAuthGuard)
    @Put('unfriend/:userId')
    async unFriend(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const unFriend = await this.friendShipService.unFriend(req.user.id,userId)
        return unFriend
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('list-friend')
    async listFriend(@Request() req:RequestWithUser){
        const listFriend = await this.friendShipService.listFriend(req.user.id)
        return listFriend
    }
    
}