import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface App {
  id: string;
  organizationId: string;
  name: string;
  apiKeyPrefix: string;
  createdAt: string;
}

@Injectable()
export class AppsService {
  private apps: Map<string, App> = new Map();

  constructor() {
    const defaultApp: App = {
      id: uuidv4(),
      organizationId: uuidv4(),
      name: 'MyApp',
      apiKeyPrefix: 'sk_test_' + Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    this.apps.set(defaultApp.id, defaultApp);
  }

  getAll() {
    return Array.from(this.apps.values());
  }

  getById(id: string) {
    return this.apps.get(id);
  }

  create(data: { name: string; organizationId: string }) {
    const app: App = {
      id: uuidv4(),
      organizationId: data.organizationId,
      name: data.name,
      apiKeyPrefix: 'sk_test_' + Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    this.apps.set(app.id, app);
    return app;
  }
}
