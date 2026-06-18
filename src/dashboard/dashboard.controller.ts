import { Controller, Get } from '@nestjs/common';
import { OrganizationsService } from '../organizations/organizations.service';
import { AppsService } from '../apps/apps.service';
import { PoliciesService } from '../policies/policies.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';

@Controller('v1/dashboard')
export class DashboardController {
  constructor(
    private readonly orgsService: OrganizationsService,
    private readonly appsService: AppsService,
    private readonly policiesService: PoliciesService,
    private readonly txService: TransactionsService,
    private readonly walletsService: WalletsService,
  ) {}

  @Get()
  getDashboard() {
    const org = this.orgsService.getOrganization();
    const apps = this.appsService.getAll();

    let totalTxCount = 0;
    let totalFeeSpent = 0;
    const allTxs: any[] = [];

    apps.forEach(app => {
      const txs = this.txService.getByAppId(app.id);
      totalTxCount += txs.length;
      totalFeeSpent += txs.reduce((sum, t) => sum + t.fee, 0);
      allTxs.push(...txs);
    });

    const lowBalanceWallets = apps
      .flatMap(app => this.walletsService.getByAppId(app.id))
      .filter(w => w.balance < w.lowBalanceThreshold);

    return {
      org,
      apps,
      totalTxCount,
      totalFeeSpent: parseFloat(totalFeeSpent.toFixed(7)),
      activePolicies: apps.reduce((sum, app) => sum + this.policiesService.getByAppId(app.id).length, 0),
      lowBalanceWallets,
    };
  }
}
