import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { COMMENT} from "src/modules/user/enums";

export class CreateLikeCommentDto {
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(COMMENT)
    related_type:string

    @IsNotEmpty()
    @IsNumber()
    related_id:number

}