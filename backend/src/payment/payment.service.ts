import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(tenantId: string, planId: string, priceId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Tenant não encontrado');
    }

    // Simulação - em produção usaria Stripe SDK
    const sessionId = `cs_${Date.now()}_${tenantId}`;
    
    // Salvar intent de pagamento
    await this.prisma.paymentIntent.create({
      data: {
        tenantId,
        planId,
        stripeSessionId: sessionId,
        status: 'pending',
      },
    });

    return {
      sessionId,
      url: `${process.env.FRONTEND_URL}/app/payment/success?session=${sessionId}`,
    };
  }

  async handleWebhook(sessionId: string, status: 'paid' | 'failed') {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (!intent) {
      throw new Error('Pagamento não encontrado');
    }

    if (status === 'paid') {
      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { status: 'paid' },
      });

      await this.prisma.tenant.update({
        where: { id: intent.tenantId },
        data: { plan: 'PRO' },
      });

      return { success: true, plan: 'PRO' };
    }

    await this.prisma.paymentIntent.update({
      where: { id: intent.id },
      data: { status: 'failed' },
    });

    return { success: false };
  }

  async getPaymentHistory(tenantId: string) {
    return this.prisma.paymentIntent.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
