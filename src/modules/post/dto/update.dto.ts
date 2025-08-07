import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {

    @IsString()
    @IsOptional()
    content:string

    @IsOptional()
    @Type(()=>Number)
    imageIdDelete: number[];
}