import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('🔧 Creating admin user...');

  const email = 'admin@profithub.com';
  const password = 'admin123';

  // Delete existing admin if exists
  await prisma.admin.deleteMany({ where: { email } });

  // Create new admin
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
      name: 'Administrador',
    },
  });

  console.log('✅ Admin created!');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  console.log('');
  console.log('Use these credentials to login at /admin/login');
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
