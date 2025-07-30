import { Expose } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";
import { GENDER } from "../enums";

export class GetOneDto {

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
    @Expose()
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