import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, Min } from "class-validator";


export class QueryCategoryDto {
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