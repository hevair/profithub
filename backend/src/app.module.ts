import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReportsModule } from './reports/reports.module';
import { AlertsModule } from './alerts/alerts.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AdminModule } from './admin/admin.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    ReportsModule,
    AlertsModule,
    SubscriptionModule,
    AdminModule,
    PaymentModule,
    HealthModule,
  ],
})
export class AppModule {}
