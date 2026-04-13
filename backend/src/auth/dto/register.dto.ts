import { IsEmail, IsEmpty, Min } from "class-validator";


export class registerDto {
    @IsEmail({},{message:"Email is required"})
    @IsEmpty({message:"Email not empty"})
    email: string;

    @IsEmpty({message:"Password not empty"})
    @Min(8)
    password:string;

    @IsEmpty({message:"FirstName not empty"})
    firstName: string;

    @IsEmpty({message:"LastName not empty"})
    lastName: string
}