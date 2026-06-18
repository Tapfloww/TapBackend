import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PoliciesService } from './policies.service';

@Controller('v1/apps/:appId/policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  getByApp(@Param('appId') appId: string) {
    return this.policiesService.getByAppId(appId);
  }

  @Post()
  create(
    @Param('appId') appId: string,
    @Body('asset') asset: string,
    @Body('maxFeePerTx') maxFeePerTx: number,
    @Body('dailyCap') dailyCap: number,
  ) {
    return this.policiesService.create(appId, { asset, maxFeePerTx, dailyCap });
  }
}
