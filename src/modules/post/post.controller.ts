import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/type/Request-with-user.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdatePostDto } from './dto/update.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() dataPost: CreatePostDto,
    @Request() req: RequestWithUser,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    // console.log(req.user.id)
    const createPost = await this.postService.create(
      dataPost,
      req.user.id,
      images,
    );
    return createPost;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Body() updateDto: UpdatePostDto,
    @Request() req: RequestWithUser,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') post_id: number,
  ) {
    const updatePost = await this.postService.update(
      updateDto,
      req.user.id,
      images,
      post_id,
    );
    return updatePost;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async detail(@Param('id') id: number) {
    const post = await this.postService.detail(id);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user/:id')
  async getPostByUser(@Param('id') id: number,@Request() req:RequestWithUser,@Query() paginationQueryDto:PaginationQueryDto) {
    const postByUser = await this.postService.getPostByUser(id,req.user.id,paginationQueryDto);
    return postByUser;
  }
}
