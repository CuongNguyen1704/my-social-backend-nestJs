import { Body, Controller, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreatePostDto } from "./dto/create.dto";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RequestWithUser } from "../auth/type/Request-with-user.interface";
import { FilesInterceptor } from "@nestjs/platform-express";


@Controller('post')
export class PostController {

    constructor(private readonly postService:PostService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images',10))
    async create(@Body() dataPost:CreatePostDto,@Request() req:RequestWithUser,@UploadedFiles() images: Express.Multer.File[]) {
        // console.log(req.user.id)
     const createPost =  await this.postService.create(dataPost,req.user.id,images);
     return createPost
    }

}