import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.tenantName,
        plan: 'FREE',
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        tenantId: tenant.id,
      },
    });

    const token = this.generateToken(user.id, user.tenantId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const token = this.generateToken(user.id, user.tenantId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private generateToken(userId: string, tenantId: string) {
    return this.jwtService.sign({
      sub: userId,
      tenantId,
    });
  }
}
