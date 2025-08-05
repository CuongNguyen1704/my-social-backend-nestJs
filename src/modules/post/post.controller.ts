import { Body, Controller, Post } from "@nestjs/common";
import { CreatePostDto } from "./dto/create.dto";
import { PostService } from "./post.service";

@Controller('post')
export class PostController {

    constructor(private readonly postService:PostService){}

    @Post()
    async create(@Body() dataPost:CreatePostDto) {
     const createPost =  await this.postService.create(dataPost);
     return createPost
    }

}