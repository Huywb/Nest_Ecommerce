import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    orderId : string;
    @IsNotEmpty()
    @IsNumber()
    amount : number;
    @IsNotEmpty()
    @IsString()
    currency : string = 'usd';
    @IsString()
    @IsOptional()
    description? : string;
}