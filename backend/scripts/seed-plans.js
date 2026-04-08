const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPlans() {
  console.log('📦 Verificando planos...');
  
  const existingPlans = await prisma.planConfig.findMany();
  console.log('Planos encontrados:', existingPlans.length);
  
  if (existingPlans.length === 0) {
    console.log('Criando planos padrão...');
    
    await prisma.planConfig.createMany({
      data: [
        {
          name: 'FREE',
          price: 0,
          maxProducts: 50,
          maxOrders: 100,
          maxAlerts: 10,
          features: 'Dashboard básico,Produtos,Pedidos,Alertas',
          order: 1,
          active: true,
        },
        {
          name: 'PRO',
          price: 29,
          maxProducts: 999999,
          maxOrders: 999999,
          maxAlerts: 999999,
          features: 'Produtos ilimitados,Pedidos ilimitados,Relatórios avançados,Suporte prioritário',
          order: 2,
          active: true,
        },
      ],
    });
    
    console.log('✅ Planos criados!');
  } else {
    existingPlans.forEach(p => {
      console.log(` - ${p.name}: R$ ${p.price}, produtos: ${p.maxProducts}`);
    });
  }
}

seedPlans()
  .then(() => {
    console.log('✅ Concluído!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
