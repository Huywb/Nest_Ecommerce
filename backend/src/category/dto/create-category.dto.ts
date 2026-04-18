import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description:"Name of category",
        example: "Test1"
    })
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty({
        description: "Description of category",
        example:"This is test of description"
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description:"This is slug",
        example: '10'
    })
    @IsOptional()
    @IsString()
    slug? : string;
    @ApiProperty({
        description:"This is imageUrl",
        example: 'https://example.com/images/electronics.png'
    })
    @IsOptional()
    @IsString()
    imageUrl? : string;

    @ApiProperty({
        description:"This is set Active",
        example: 'true'
    })
    @IsOptional()
    isActive? : boolean
}