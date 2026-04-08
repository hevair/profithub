import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from './alerts.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.alertsService.findAll(user.tenantId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.alertsService.markAsRead(id, user.tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.alertsService.remove(id, user.tenantId);
  }
}
