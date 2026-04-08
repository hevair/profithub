import { Controller, Get, Put, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('tenants')
  async getTenants(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getTenants(Number(page), Number(limit));
  }

  @Get('tenants/:id')
  async getTenantById(@Param('id') id: string) {
    return this.adminService.getTenantById(id);
  }

  @Put('tenants/:id/plan')
  async updateTenantPlan(
    @Param('id') id: string,
    @Body('plan') plan: string,
  ) {
    return this.adminService.updateTenantPlan(id, plan);
  }

  @Delete('tenants/:id')
  async deleteTenant(@Param('id') id: string) {
    return this.adminService.deleteTenant(id);
  }

  @Get('plans')
  async getAllPlans() {
    return this.adminService.getAllPlans();
  }

  @Post('plans')
  async createPlan(@Body() data: any) {
    return this.adminService.createPlan(data);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePlan(id, data);
  }

  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    return this.adminService.deletePlan(id);
  }

  @Get('inadimplentes')
  async getInadimplentes() {
    return this.adminService.getInadimplentes();
  }
}
