import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    content:string

    @IsNotEmpty()
    @IsNumber()
    post_id:number

    @IsNumber()
    parent_id?:number
    

}