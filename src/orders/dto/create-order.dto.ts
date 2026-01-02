import {
  IsArray,
  IsDateString,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: '64f9c8a...' })
  @IsMongoId()
  customerId: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  items: OrderItemDto[];
}
