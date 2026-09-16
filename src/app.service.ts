import { Injectable } from '@nestjs/common';
import {
  API_VERSION,
  getNetwork,
  horizonUrl,
  pingHorizon,
} from './stellar/stellar';

@Injectable()
export class AppService {
  async getHealth() {
    const horizonOk = await pingHorizon();
    return {
      status: horizonOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'TapFlow API',
      version: API_VERSION,
      network: getNetwork(),
      horizon_ok: horizonOk,
      horizon_url: horizonUrl(),
      contract_id: process.env.CONTRACT_ADDRESS || null,
    };
  }

  getInfo() {
    return {
      name: 'TapFlow API',
      description:
        'Stellar fee-sponsorship control plane for apps (policies, sponsor wallets, sponsored txs)',
      version: API_VERSION,
      network: getNetwork(),
      horizonUrl: horizonUrl(),
      endpoints: {
        health: '/health',
        dashboard: '/v1/dashboard',
        apps: '/v1/apps',
        policies: '/v1/apps/:appId/policies',
        wallets: '/v1/apps/:appId/wallets',
        transactions: '/v1/apps/:appId/transactions',
        quote: '/v1/apps/:appId/transactions/quote',
      },
    };
  }
}
