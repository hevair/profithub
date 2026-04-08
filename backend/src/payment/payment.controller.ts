import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'))
  async createCheckout(
    @CurrentUser() user: any,
    @Body() body: { planId: string; priceId: string },
  ) {
    return this.paymentService.createCheckoutSession(
      user.tenantId,
      body.planId,
      body.priceId,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Body() body: { sessionId: string; status: 'paid' | 'failed' },
  ) {
    return this.paymentService.handleWebhook(body.sessionId, body.status);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getHistory(@CurrentUser() user: any) {
    return this.paymentService.getPaymentHistory(user.tenantId);
  }
}
