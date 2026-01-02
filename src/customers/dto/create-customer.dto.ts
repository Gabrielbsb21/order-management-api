/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Gabriel Silva', description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'gabriel@email.com', description: 'Customer email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Brasil', description: 'Customer country' })
  @IsString()
  @IsNotEmpty()
  country: string;
}
