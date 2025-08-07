import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePostDto {

    @IsString()
    @IsOptional()
    @MaxLength(500,{message:"Content không được quá 500 kí tự"})
    content:string

    @IsOptional()
    @Type(()=>Number)
    imageIdDelete: number[];
}