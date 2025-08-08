import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    content:string

    @IsNotEmpty()
    @IsNumber()
    post_id:number

    @IsNumber()
    @IsOptional()
    parent_id?:number


}