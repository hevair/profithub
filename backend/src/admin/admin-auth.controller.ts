import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.adminAuthService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    return this.adminAuthService.register(body.email, body.password, body.name);
  }
}
