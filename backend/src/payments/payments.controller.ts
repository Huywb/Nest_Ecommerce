import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PaymentsService } from './payments.service';
import { GetUser } from 'src/common/decorator/GetUser.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { confirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Payments')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
  })
  async createPaymentIntent(
    @Body() createPaymentData: CreatePaymentDto,
    @GetUser('id') id: string,
  ) {
    return this.paymentsService.createPaymentIntent(createPaymentData, id);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
  })
  async confirmPayment(
    @Body() paymentData: confirmPaymentDto,
    @GetUser('id') id: string,
  ) {
    return this.paymentsService.confirmPayment(paymentData, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
  })
  async getUserPayments(@GetUser('id') id: string) {
    return this.paymentsService.getUserPayments(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
  })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.paymentsService.findOne(id, userId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments for a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
  })
  async getPaymentsByOrder(
    @Param('orderId') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return this.paymentsService.getPaymentsByOrder(orderId, userId);
  }
}
