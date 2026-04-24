import { IsNotEmpty, IsString } from "class-validator";


export class confirmPaymentDto {
    @IsNotEmpty()
    @IsString()
    paymentIntentId: string

    @IsNotEmpty()
    @IsString()
    orderId: string
}
