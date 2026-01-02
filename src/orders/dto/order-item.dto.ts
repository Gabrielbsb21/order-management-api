import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'Notebook' })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @IsPositive()
  unitPriceUSD: number;
}
