import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { POST } from 'src/modules/user/enums';

export class UnlikePostDto {
  @IsString()
  @IsEnum(POST)
  @IsNotEmpty()
  related_type: string;

  @IsNumber()
  @IsNotEmpty()
  related_id: number;
}
