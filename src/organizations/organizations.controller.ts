import { Controller, Get, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('v1/organization')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get()
  getCurrent() {
    return this.orgService.getOrganization();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.orgService.getOrganization(id);
  }
}
