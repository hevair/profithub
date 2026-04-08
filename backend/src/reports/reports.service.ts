import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      monthlyOrders,
      recentOrders,
      lowStockProducts,
      recentAlerts,
    ] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.order.findMany({
        where: { tenantId },
        include: {
          product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.product.findMany({
        where: {
          tenantId,
          stock: { lt: 5 },
        },
      }),
      this.prisma.alert.findMany({
        where: { tenantId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const monthlyRevenue = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.salePrice),
      0,
    );
    const monthlyProfit = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.profit),
      0,
    );

    return {
      monthlyRevenue,
      monthlyProfit,
      totalOrders: monthlyOrders.length,
      lowStockProducts: lowStockProducts.length,
      recentOrders,
      recentAlerts,
    };
  }

  async getProfitByProduct(tenantId: string) {
    const orders = await this.prisma.order.findMany({
      where: { tenantId },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    });

    const productMap = new Map<string, { name: string; totalProfit: number; count: number }>();

    for (const order of orders) {
      const existing = productMap.get(order.productId);
      if (existing) {
        existing.totalProfit += Number(order.profit);
        existing.count += 1;
      } else {
        productMap.set(order.productId, {
          name: order.product.name,
          totalProfit: Number(order.profit),
          count: 1,
        });
      }
    }

    return Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        ...data,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);
  }
}
