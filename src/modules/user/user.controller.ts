import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { use } from 'passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/type/Request-with-user.interface';
import { UserEntity } from './user.entity';
import { getManyUserByname } from './dto/get-many-by-name.dto';
import { UserFilterDto } from './dto/filter-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService
              
  ) {}
  // thêm xác thực jwt
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(
    @Body() userDto: CreateUserDto,
  ) {
    const user = await this.userService.createUser(userDto);
    return {
      message: 'Tạo User Thành công',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id:number){
      const oneUser = await this.userService.getOneUser(id)
      return {
        message: "Lấy user thành công",
        data: oneUser
      }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async getMany(@Body() name:getManyUserByname){
    console.log(name)
      const users = await this.userService.getManyUser(name)
      return {
        message: "Thành công",
        data: users
      }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async fillMany(@Query() userFilterDto:UserFilterDto){
    console.log(userFilterDto)
      const users = await this.userService.fillMany(userFilterDto);
      return users
  }

  
  @UseGuards()
  @Delete(':id')
  async softDelete(@Param('id') id:number){
        await this.userService.softDelete(id)
        return {
            message: "Xóa mềm thành công user"
        }
  }
  // thêm xác thực jwt
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async  update(@Param('id') id:number,
  @Body() updateUser: Partial<UserEntity>, ){
        const user = await this.userService.update(id,updateUser)
        return {
           message: "Cập nhật user thành công",
           data: user
        }
  }


}
