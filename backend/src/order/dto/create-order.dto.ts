import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  @IsNotEmpty()
  quantity: number;
  @ApiProperty({
    description: 'Price',
    example: 49.99,
  })
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
    @ApiProperty({type: [OrderItemDto]})
    @IsNotEmpty()
    @IsArray()
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    shippingAddress: string;
}
