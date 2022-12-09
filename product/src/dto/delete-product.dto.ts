import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class DeleteProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
