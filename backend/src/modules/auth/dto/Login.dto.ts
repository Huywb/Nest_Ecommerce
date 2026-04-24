import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, Min, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'abc@gmail.com',
  })
  @IsEmail({}, { message: 'Email not valid' })
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'Password',
    example: 'Testing123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
