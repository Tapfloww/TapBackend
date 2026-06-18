import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'TapFlow API',
      version: '1.0.0',
    };
  }

  getInfo() {
    return {
      name: 'TapFlow API',
      description: 'Stellar payment sponsorship platform',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        dashboard: '/v1/dashboard',
        apps: '/v1/apps',
        policies: '/v1/policies',
        wallets: '/v1/wallets',
        transactions: '/v1/transactions',
      },
    };
  }
}
