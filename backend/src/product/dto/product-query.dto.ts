import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';


export class QueryProductDto {
    @ApiProperty({
        description:"Is Active",
        example:"true"
    })
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    search?: string;
    
    @Min(1)
    @IsOptional()
    page?: number;
    @Min(10)
    @IsOptional()
    limit: number
}