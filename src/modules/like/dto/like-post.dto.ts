import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { RelatedType} from "src/modules/user/enums";

export class CreatePostLikeDto {
    
    @IsNotEmpty()
    @IsNumber()
    related_id:number

}