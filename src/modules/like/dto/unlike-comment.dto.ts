import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { COMMENT } from 'src/modules/user/enums';

export class UnlikeCommentDto {
  @IsString()
  @IsEnum(COMMENT)
  @IsNotEmpty()
  related_type: string;

  @IsNumber()
  @IsNotEmpty()
  related_id: number;
}
