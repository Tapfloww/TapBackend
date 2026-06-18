import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppsService } from './apps.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('v1/apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  getAll() {
    return this.appsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.appsService.getById(id);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.appsService.create({
      name,
      organizationId: uuidv4(),
    });
  }
}
