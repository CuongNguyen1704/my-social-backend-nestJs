import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { NewsfeedService } from "./newsfeed.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";

@Controller('newsfeed')
export class NewsfeedController {
    constructor(
        private readonly newsFeedService:NewsfeedService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNewfeedByUser(@Request() req:RequestWithUser){
        const newsFeed = await this.newsFeedService.getNewFeed(req.user.id)
        return newsFeed
    }
}