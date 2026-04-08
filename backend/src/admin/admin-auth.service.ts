import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      type: 'admin',
    });

    return {
      accessToken: token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  }
}
