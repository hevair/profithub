import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.reportsService.getDashboard(user.tenantId);
  }

  @Get('products')
  async getProfitByProduct(@CurrentUser() user: any) {
    return this.reportsService.getProfitByProduct(user.tenantId);
  }
}
