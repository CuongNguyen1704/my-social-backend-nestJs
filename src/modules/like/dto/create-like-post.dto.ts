import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { POST} from "src/modules/user/enums";

export class CreatePostLikeDto {
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(POST)
    related_type:string

    @IsNotEmpty()
    @IsNumber()
    related_id:number

}