import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { GENDER } from "../enums";
import { Expose } from "class-transformer";


export class  CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string

    @IsNotEmpty()
    @IsString()
    @Expose()
    email:string

    @IsNotEmpty()
    @IsString()
    password:string

    @IsNotEmpty()
    @IsString()
    @Expose()
    fullName:string

    @IsString()
    avatar:string

    @IsDate()
    dateOfBirth:Date

    @IsString()
    @Expose()
    @IsEnum(GENDER)
    gender:string

    @IsString()
    @Expose()
    phone:string

}