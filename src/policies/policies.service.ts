import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface SponsorPolicy {
  id: string;
  appId: string;
  asset: string;
  maxFeePerTx: number;
  dailyCap: number;
  dailyUsed: number;
  createdAt: string;
}

@Injectable()
export class PoliciesService {
  private policies: Map<string, SponsorPolicy> = new Map();

  getByAppId(appId: string) {
    return Array.from(this.policies.values()).filter(p => p.appId === appId);
  }

  create(appId: string, data: { asset: string; maxFeePerTx: number; dailyCap: number }) {
    const policy: SponsorPolicy = {
      id: uuidv4(),
      appId,
      asset: data.asset,
      maxFeePerTx: data.maxFeePerTx,
      dailyCap: data.dailyCap,
      dailyUsed: 0,
      createdAt: new Date().toISOString(),
    };
    this.policies.set(policy.id, policy);
    return policy;
  }
}
