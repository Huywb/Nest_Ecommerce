import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, Min } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'abc@gmail.com',
  })
  @IsEmail({}, { message: 'Email not valid' })
  @IsEmpty()
  email: string;
  @ApiProperty({
    description: 'Password',
    example: '********',
  })
  @IsEmpty()
  @Min(6)
  password: string;
}
