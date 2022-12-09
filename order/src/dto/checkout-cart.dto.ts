import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CheckoutCartDto {
  @IsNotEmpty()
  @IsArray()
  items: number[];

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
