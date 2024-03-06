import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class AudioDto {
  @MinLength(10, {
    message: 'text должен быть не меньше 10 символов',
  })
  @MaxLength(1000, {
    message: 'text должен быть меньше 1000 символов',
  })
  text: string;

  @IsNotEmpty({ message: 'speaker_id не должен быть пустым' })
  @IsNumber({}, { message: 'speaker_id должен быть числом' })
  speaker_id: number;
}
