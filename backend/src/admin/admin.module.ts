import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService, AdminAuthService],
  exports: [AdminService, AdminAuthService],
})
export class AdminModule {}
