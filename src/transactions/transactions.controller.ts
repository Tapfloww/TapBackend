import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('v1/apps/:appId/transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @Get()
  getByApp(
    @Param('appId') appId: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.txService.getByAppId(appId, { userId, status });
  }

  @Get(':txId')
  getById(@Param('txId') txId: string) {
    return this.txService.getById(txId);
  }

  @Post()
  create(
    @Param('appId') appId: string,
    @Body() data: { userId?: string; amount: number; fee: number; asset: string },
  ) {
    return this.txService.create(appId, data);
  }
}
