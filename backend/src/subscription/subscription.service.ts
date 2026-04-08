import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getPlanInfo(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    const productCount = await this.prisma.product.count({
      where: { tenantId },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orderCount = await this.prisma.order.count({
      where: { tenantId, createdAt: { gte: startOfMonth } },
    });

    const alertCount = await this.prisma.alert.count({
      where: { tenantId, createdAt: { gte: startOfMonth } },
    });

    // Buscar planos do banco
    const allPlans = await this.prisma.planConfig.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // Mapear planos para formato padronizado
    const limits = allPlans.reduce((acc, plan) => {
      const key = plan.name.toUpperCase();
      acc[key] = {
        name: plan.name,
        price: plan.price,
        maxProducts: plan.maxProducts,
        maxOrders: plan.maxOrders,
        maxAlerts: plan.maxAlerts,
        features: plan.features.split(',').map((f: string) => f.trim()),
      };
      return acc;
    }, {} as Record<string, any>);

    // Determinar o plano atual do tenant
    const tenantPlanKey = (tenant?.plan || 'FREE').toUpperCase();
    let currentPlan = limits[tenantPlanKey];
    
    // Se não encontrar pelo nome, tenta pelo índice
    if (!currentPlan) {
      currentPlan = limits[Object.keys(limits)[0]] || {
        name: 'Grátis',
        price: 0,
        maxProducts: 50,
        maxOrders: 100,
        maxAlerts: 10,
        features: ['Dashboard básico'],
      };
    }

    return {
      plan: tenant?.plan || 'FREE',
      planName: currentPlan.name,
      price: currentPlan.price,
      features: currentPlan.features,
      usage: {
        products: {
          current: productCount,
          limit: currentPlan.maxProducts,
          unlimited: currentPlan.maxProducts >= 999999,
        },
        orders: {
          current: orderCount,
          limit: currentPlan.maxOrders,
          unlimited: currentPlan.maxOrders >= 999999,
        },
        alerts: {
          current: alertCount,
          limit: currentPlan.maxAlerts,
          unlimited: currentPlan.maxAlerts >= 999999,
        },
      },
      limits,
      allPlans: allPlans.map(p => ({
        id: p.name,
        name: p.name,
        price: p.price,
        maxProducts: p.maxProducts,
        maxOrders: p.maxOrders,
        features: p.features,
        active: p.active,
      })),
    };
  }

  async upgradeToPro(tenantId: string) {
    // Atualizar para o plano PRO no banco
    const proPlan = await this.prisma.planConfig.findFirst({
      where: { name: 'PRO' },
    });

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: proPlan?.name || 'PRO' },
    });
  }

  async downgradeToFree(tenantId: string) {
    // Atualizar para o plano FREE no banco
    const freePlan = await this.prisma.planConfig.findFirst({
      where: { 
        OR: [
          { name: 'FREE' },
          { name: 'Grátis' },
        ]
      },
    });

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: freePlan?.name || 'FREE' },
    });
  }

  async getPlans() {
    return this.prisma.planConfig.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }
}
