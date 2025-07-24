import { IsNotEmpty, IsString } from "class-validator";

export class ChangPasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string

    @IsNotEmpty()
    @IsString()
    passwordConfirmation:string
}