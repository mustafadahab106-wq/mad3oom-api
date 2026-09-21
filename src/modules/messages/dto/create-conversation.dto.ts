import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  @Min(1)
  otherUserId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  listingId?: number;
}
