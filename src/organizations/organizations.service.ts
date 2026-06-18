import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

@Injectable()
export class OrganizationsService {
  private orgs: Map<string, Organization> = new Map();

  constructor() {
    const defaultOrg: Organization = {
      id: uuidv4(),
      name: 'Default Organization',
      createdAt: new Date().toISOString(),
    };
    this.orgs.set(defaultOrg.id, defaultOrg);
  }

  getOrganization(id?: string) {
    if (!id) {
      return Array.from(this.orgs.values())[0];
    }
    return this.orgs.get(id);
  }

  getAll() {
    return Array.from(this.orgs.values());
  }
}
