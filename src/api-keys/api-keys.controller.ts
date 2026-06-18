import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

@Controller('v1/apps/:appId/keys')
export class ApiKeysController {
  constructor(private readonly keysService: ApiKeysService) {}

  @Get()
  getByApp(@Param('appId') appId: string) {
    return this.keysService.getByAppId(appId);
  }

  @Post()
  create(@Param('appId') appId: string, @Body('name') name: string) {
    return this.keysService.create(appId, { name });
  }

  @Delete(':keyId')
  revoke(@Param('keyId') keyId: string) {
    return this.keysService.revoke(keyId);
  }
}
