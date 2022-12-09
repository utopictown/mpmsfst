import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustStockDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
