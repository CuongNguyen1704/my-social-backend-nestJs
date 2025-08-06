import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    content:string

    @IsOptional()
    images:string[]



    
}