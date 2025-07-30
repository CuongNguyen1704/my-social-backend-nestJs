import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { GENDER } from "../enums";
import { FilterDto } from "src/common/dto/fiter.dto";
import { Transform, Type } from "class-transformer";


export class UserFilter {
    @IsOptional()
    @IsEnum(GENDER)
    gender?:GENDER

    @IsOptional()
    @IsString()
    name?:string

}

export class UserFilterDto extends FilterDto<UserFilter> {

}
