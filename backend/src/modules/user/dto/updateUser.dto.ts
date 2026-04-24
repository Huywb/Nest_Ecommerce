import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class updateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'Abc@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email not valid' })
  email?: string;

  @ApiProperty({
    description: 'fistName',
    example: 'Test2',
  })
  @IsOptional()
  firstName?: string;
  @ApiProperty({
    description: 'lastName',
    example: 'Test5',
  })
  @IsOptional()
  lastName?: string;
}
