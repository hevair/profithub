import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('subscription')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getPlanInfo(@CurrentUser() user: any) {
    return this.subscriptionService.getPlanInfo(user.tenantId);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Post('upgrade')
  async upgradeToPro(@CurrentUser() user: any) {
    return this.subscriptionService.upgradeToPro(user.tenantId);
  }

  @Post('downgrade')
  async downgradeToFree(@CurrentUser() user: any) {
    return this.subscriptionService.downgradeToFree(user.tenantId);
  }
}
