import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { NewsfeedService } from "./newsfeed.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

@Controller('newsfeed')
export class NewsfeedController {
    constructor(
        private readonly newsFeedService:NewsfeedService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNewfeedByUser(@Request() req:RequestWithUser,@Query() pagination:PaginationQueryDto){
        const newsFeed = await this.newsFeedService.getNewFeed(req.user.id,pagination)
        return newsFeed
    }
}