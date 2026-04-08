import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.alert.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, type: string, message: string) {
    return this.prisma.alert.create({
      data: {
        tenantId,
        type,
        message,
      },
    });
  }

  async markAsRead(id: string, tenantId: string) {
    const alert = await this.prisma.alert.findFirst({
      where: { id, tenantId },
    });

    if (!alert) {
      throw new NotFoundException('Alerta não encontrado');
    }

    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string, tenantId: string) {
    const alert = await this.prisma.alert.findFirst({
      where: { id, tenantId },
    });

    if (!alert) {
      throw new NotFoundException('Alerta não encontrado');
    }

    return this.prisma.alert.delete({
      where: { id },
    });
  }
}
