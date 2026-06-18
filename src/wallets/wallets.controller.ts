import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('v1/apps/:appId/wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  getByApp(@Param('appId') appId: string) {
    return this.walletsService.getByAppId(appId);
  }

  @Post()
  create(
    @Param('appId') appId: string,
    @Body('address') address: string,
    @Body('asset') asset: string,
    @Body('lowBalanceThreshold') lowBalanceThreshold: number,
  ) {
    return this.walletsService.create(appId, { address, asset, lowBalanceThreshold });
  }

  @Post(':walletId/topup')
  topUp(@Param('walletId') walletId: string, @Body('amount') amount: number) {
    return this.walletsService.topUp(walletId, amount);
  }
}
