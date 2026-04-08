import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalTenants, proTenants, totalUsers, totalProducts, totalOrders] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { plan: 'PRO' } }),
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await this.prisma.order.aggregate({
      _sum: { salePrice: true },
      where: { createdAt: { gte: startOfMonth } },
    });

    return {
      totalTenants,
      proTenants,
      freeTenants: totalTenants - proTenants,
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyRevenue: monthlyRevenue._sum.salePrice || 0,
      proConversion: totalTenants > 0 ? ((proTenants / totalTenants) * 100).toFixed(1) : 0,
    };
  }

  async getTenants(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { users: true, products: true, orders: true } },
        },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      data: tenants.map(t => ({
        id: t.id,
        name: t.name,
        plan: t.plan,
        createdAt: t.createdAt,
        usersCount: t._count.users,
        productsCount: t._count.products,
        ordersCount: t._count.orders,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTenantById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, email: true, name: true, createdAt: true } },
        products: { select: { id: true, name: true, stock: true } },
        orders: {
          select: { id: true, salePrice: true, profit: true, platform: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        alerts: { select: { id: true, type: true, message: true, createdAt: true } },
      },
    });
  }

  async updateTenantPlan(tenantId: string, plan: string) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan },
    });
  }

  async deleteTenant(tenantId: string) {
    await this.prisma.alert.deleteMany({ where: { tenantId } });
    await this.prisma.order.deleteMany({ where: { tenantId } });
    await this.prisma.product.deleteMany({ where: { tenantId } });
    await this.prisma.user.deleteMany({ where: { tenantId } });
    return this.prisma.tenant.delete({ where: { id: tenantId } });
  }

  async getAllPlans() {
    return this.prisma.planConfig.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async updatePlan(planId: string, data: { name?: string; price?: number; maxProducts?: number; maxOrders?: number; features?: string }) {
    return this.prisma.planConfig.update({
      where: { id: planId },
      data,
    });
  }

  async createPlan(data: { name: string; price: number; maxProducts: number; maxOrders: number; features: string; order: number }) {
    return this.prisma.planConfig.create({ data });
  }

  async deletePlan(planId: string) {
    return this.prisma.planConfig.delete({ where: { id: planId } });
  }

  async getInadimplentes() {
    return this.prisma.tenant.findMany({
      where: { plan: 'FREE' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        users: {
          select: { email: true, name: true },
        },
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
