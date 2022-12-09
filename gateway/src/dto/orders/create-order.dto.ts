import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
