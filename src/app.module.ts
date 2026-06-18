import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { OrganizationsModule } from './organizations/organizations.module';
import { AppsModule } from './apps/apps.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PoliciesModule } from './policies/policies.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    OrganizationsModule,
    AppsModule,
    ApiKeysModule,
    PoliciesModule,
    WalletsModule,
    TransactionsModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
