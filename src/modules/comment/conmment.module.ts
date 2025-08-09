import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { UserModule } from "../user/user.module";
import { PostModule } from "../post/post.module";

@Module({
    imports:[TypeOrmModule.forFeature([CommentEntity]),UserModule,PostModule],
    controllers:[CommentController],
    providers:[CommentService],
    exports:[CommentService]
})

export class CommentModule{}