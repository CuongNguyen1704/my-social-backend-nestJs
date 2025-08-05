import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsNotEmpty()
    @IsString()
    title:string


    @IsString()
    @IsNotEmpty()
    content:string

    @IsNotEmpty()
    user_id:number

    @IsOptional()
    images:string[]



    
}