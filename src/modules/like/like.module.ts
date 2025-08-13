import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikeEntity } from "./like.entity";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { PostModule } from "../post/post.module";
import { CommentModule } from "../comment/conmment.module";

@Module({
    imports:[TypeOrmModule.forFeature([LikeEntity]),PostModule,CommentModule],
    providers:[LikeService],
    exports:[LikeService],
    controllers:[LikeController]

})

export class LikeModule{}