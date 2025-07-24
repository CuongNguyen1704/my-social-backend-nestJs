import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { plainToInstance } from "class-transformer";

@Controller('users')

export class UserController {
    constructor (private readonly userService: UserService){

    }

    @Post('create')
   async createUser(@Body() userDto:CreateUserDto){
        const user = await this.userService.createUser(userDto)
        const resposeData = plainToInstance(CreateUserDto,user,{
            excludeExtraneousValues:true
        })
        return {
            message : "Tạo User Thành công",
            data:resposeData
        }
    }
}