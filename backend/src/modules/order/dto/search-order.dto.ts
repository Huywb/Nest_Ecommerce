import { Type } from "class-transformer";
import { IsOptional } from "class-validator";


export enum OrderStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class SearchOrderDto {
    @IsOptional()
    @Type(() => Number)
    page? : number = 1;

    @IsOptional()
    @Type(() => Number)
    limit? : number = 10;

    @IsOptional()
    status? : OrderStatus;

    @IsOptional()
    search? : string;
}