import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CancelDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
