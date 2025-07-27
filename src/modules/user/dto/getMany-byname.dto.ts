import { IsNotEmpty, IsString } from "class-validator";

export class getManyUserByname {
    @IsString()
    @IsNotEmpty()
    name:string
}