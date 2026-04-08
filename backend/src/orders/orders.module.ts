import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
