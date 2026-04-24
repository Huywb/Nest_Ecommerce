import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class changePasswordDto {
    @ApiProperty({
        description:"Current password",
        example: "123123132"
    })
    @IsNotEmpty()
    currentPassword? : string;

    @ApiProperty({
        description:"New password",
        example: "123123"
    })
    @IsNotEmpty()
    newPassword?:string
}
