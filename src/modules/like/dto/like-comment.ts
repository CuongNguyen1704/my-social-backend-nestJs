import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RelatedType} from "src/modules/user/enums";

export class CreateLikeCommentDto {
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(RelatedType)
    related_type:string

    @IsNotEmpty()
    @IsNumber()
    related_id:number

    
}