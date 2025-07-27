import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { getManyUserByname } from './dto/getMany-byname.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService
              
  ) {}

  @Post('create')
  async createUser(
    @Body() userDto: CreateUserDto,
  ) {
    const user = await this.userService.createUser(userDto);
    const resposeData = plainToInstance(CreateUserDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Tạo User Thành công',
      data: resposeData,
    };
  }

  @Get(':id')
  async getOne(@Param('id') id:number){
      const oneUser = await this.userService.getOneUser(id)
      return {
        message: "Lấy user thành công",
        data: oneUser
      }
  }

  @Post()
  async getMany(@Body() name:getManyUserByname){
    console.log(name)
      const users = await this.userService.getManyUser(name)
      return {
        message: "Thành công",
        data: users
      }
  }
  

  @Delete(':id')
  async softDelete(@Param('id') id:string){
        await this.userService.softDelete(Number(id))
        return {
            message: "Xóa mềm thành công user"
        }
  }

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
