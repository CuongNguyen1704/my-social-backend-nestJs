import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateLikeCommentDto {
    
    @IsNotEmpty()
    @IsNumber()
    related_id:number

    
}