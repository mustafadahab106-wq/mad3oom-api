import { IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(2000)
  content: string;
}

export class ChatDto {
  @IsString()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsArray()
  history?: ChatMessageDto[];
}
