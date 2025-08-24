import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { FriendRequestService } from "../services/friend_request.service";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RequestWithUser } from "../../auth/type/Request-with-user.interface";

@Controller('friend-request')
export class FriendRequestController {
    constructor(
        private readonly friendRequestService:FriendRequestService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('send-request/:userId')
    async sendOrCancelFriendRequest(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const friendRequest= await  this.friendRequestService.sendOrCancelFriendRequest(req.user.id,userId)
        return friendRequest
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-friend-request/:userId')
    async acceptFriendRequest(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const accept = await this.friendRequestService.accept(req.user.id,userId)
        return accept
    }

    @UseGuards(JwtAuthGuard)
    @Post('reject-friend-request/:userId')
    async rejectFriendRequest(@Request() req:RequestWithUser,@Param('userId') userId:number){
        const reject =  await this.friendRequestService.reject(req.user.id,userId)
        return reject
    }

    @UseGuards(JwtAuthGuard)
    @Get('list-request-friend')
    async getListRequestFriend(@Request() req:RequestWithUser){
        const listRequest = await this.friendRequestService.listRequest(req.user.id)
        return listRequest
    }
}