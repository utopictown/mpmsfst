import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
