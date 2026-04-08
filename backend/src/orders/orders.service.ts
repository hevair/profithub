import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private alertsService: AlertsService,
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.order.findMany({
      where: { tenantId },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateOrderDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.stock <= 0) {
      throw new BadRequestException('Produto sem estoque');
    }

    const profit = this.calculateProfit(
      dto.salePrice,
      Number(product.costPrice),
      dto.fee || 0,
      dto.shippingCost || 0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          tenantId,
          productId: dto.productId,
          platform: dto.platform,
          salePrice: dto.salePrice,
          shippingCost: dto.shippingCost || 0,
          fee: dto.fee || 0,
          profit,
        },
        include: {
          product: {
            select: { id: true, name: true },
          },
        },
      });

      await tx.product.update({
        where: { id: dto.productId },
        data: { stock: { decrement: 1 } },
      });

      return newOrder;
    });

    const updatedProduct = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (updatedProduct && updatedProduct.stock < updatedProduct.lowStockAlert) {
      await this.alertsService.create(
        tenantId,
        'LOW_STOCK',
        `Produto "${product.name}" com estoque baixo: ${updatedProduct.stock} unidades`,
      );
    }

    if (profit < 0) {
      await this.alertsService.create(
        tenantId,
        'LOW_MARGIN',
        `Pedido com prejuízo: "${product.name}" deu -R$ ${Math.abs(profit).toFixed(2)}`,
      );
    }

    return order;
  }

  private calculateProfit(
    salePrice: number,
    costPrice: number,
    fee: number,
    shippingCost: number,
  ): number {
    return salePrice - (costPrice + fee + shippingCost);
  }
}
