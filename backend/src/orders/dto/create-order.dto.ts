import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  platform: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  salePrice: number;

  @Transform(({ value }) => parseFloat(value) || 0)
  @IsNumber()
  @IsNotEmpty()
  fee: number;

  @Transform(({ value }) => parseFloat(value) || 0)
  @IsNumber()
  shippingCost?: number;
}
