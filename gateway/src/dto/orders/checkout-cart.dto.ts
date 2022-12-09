import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckoutCartDto {
  @IsArray()
  @IsNotEmpty()
  items: number[];

  userId: string;
}
