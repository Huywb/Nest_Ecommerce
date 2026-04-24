import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
    example: 'abc@gmail.com',
    required:false
  })
  @IsEmail({}, { message: 'Email not valid' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Testing123',
    required:false

  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'firstName',
    example: 'Test1',
    required:false
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'lastName',
    example: 'Test5',
    required:false
})
  @IsNotEmpty()
  lastName: string;
}
