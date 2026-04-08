import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  costPrice: number;

  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @IsNumber()
  @IsOptional()
  @Min(0)
  suggestedPrice?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  stock: number;

  @Transform(({ value }) => parseInt(value) || 5)
  @IsNumber()
  @IsOptional()
  @Min(1)
  lowStockAlert?: number;
}
