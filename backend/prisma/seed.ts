import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin
  const adminEmail = 'admin@profithub.com';
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Administrador',
      },
    });
    console.log('✅ Admin created: admin@profithub.com / admin123');
  }

  // Create default plans
  const existingPlans = await prisma.planConfig.findMany();
  
  if (existingPlans.length === 0) {
    await prisma.planConfig.createMany({
      data: [
        {
          name: 'Grátis',
          price: 0,
          maxProducts: 50,
          maxOrders: 100,
          maxAlerts: 10,
          features: 'Dashboard básico,Produtos,Pedidos,Alertas',
          order: 1,
          active: true,
        },
        {
          name: 'Pro',
          price: 29,
          maxProducts: 999999,
          maxOrders: 999999,
          maxAlerts: 999999,
          features: 'Produtos ilimitados,Pedidos ilimitados,Relatórios avançados,Suporte prioritário,Alertas ilimitados',
          order: 2,
          active: true,
        },
        {
          name: 'Starter',
          price: 9.90,
          maxProducts: 200,
          maxOrders: 500,
          maxAlerts: 50,
          features: 'Produtos 200,Pedidos 500,Relatórios básicos,Alertas 50',
          order: 0,
          active: false,
        },
      ],
    });
    console.log('✅ Plans created');
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
