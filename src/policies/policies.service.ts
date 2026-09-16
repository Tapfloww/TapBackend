import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { quoteFee } from '../stellar/stellar';

export interface SponsorPolicy {
  id: string;
  appId: string;
  asset: string;
  maxFeePerTx: number;
  policyBps: number;
  dailyCap: number;
  dailyUsed: number;
  createdAt: string;
}

@Injectable()
export class PoliciesService {
  private policies: Map<string, SponsorPolicy> = new Map();

  getByAppId(appId: string) {
    return Array.from(this.policies.values()).filter((p) => p.appId === appId);
  }

  getPrimary(appId: string, asset = 'USDC') {
    return this.getByAppId(appId).find((p) => p.asset === asset);
  }

  create(
    appId: string,
    data: {
      asset: string;
      maxFeePerTx: number;
      dailyCap: number;
      policyBps?: number;
    },
  ) {
    if (!(data.maxFeePerTx > 0)) {
      throw new BadRequestException('maxFeePerTx must be greater than zero');
    }
    if (!(data.dailyCap > 0)) {
      throw new BadRequestException('dailyCap must be greater than zero');
    }
    const policyBps = data.policyBps ?? 20;
    if (policyBps < 0 || policyBps > 10_000) {
      throw new BadRequestException('policyBps must be 0..=10000');
    }
    const policy: SponsorPolicy = {
      id: randomUUID(),
      appId,
      asset: data.asset || 'USDC',
      maxFeePerTx: data.maxFeePerTx,
      policyBps,
      dailyCap: data.dailyCap,
      dailyUsed: 0,
      createdAt: new Date().toISOString(),
    };
    this.policies.set(policy.id, policy);
    return policy;
  }

  assertFeeAllowed(appId: string, fee: number, asset = 'USDC') {
    const policy = this.getPrimary(appId, asset);
    if (!policy) {
      throw new BadRequestException('no sponsorship policy configured for app/asset');
    }
    if (fee > policy.maxFeePerTx) {
      throw new BadRequestException('fee exceeds maxFeePerTx policy');
    }
    if (policy.dailyUsed + fee > policy.dailyCap) {
      throw new BadRequestException('daily sponsorship cap exceeded');
    }
    return policy;
  }

  consumeFee(policyId: string, fee: number) {
    const policy = this.policies.get(policyId);
    if (policy) policy.dailyUsed += fee;
    return policy;
  }

  quote(appId: string, amount: number, asset = 'USDC') {
    const policy = this.getPrimary(appId, asset);
    if (!policy) {
      throw new BadRequestException('no sponsorship policy configured for app/asset');
    }
    if (!(amount > 0)) {
      throw new BadRequestException('amount must be greater than zero');
    }
    return {
      amount,
      asset: policy.asset,
      policyBps: policy.policyBps,
      maxFeePerTx: policy.maxFeePerTx,
      fee: quoteFee(amount, policy.policyBps, policy.maxFeePerTx),
      dailyRemaining: Math.max(0, policy.dailyCap - policy.dailyUsed),
    };
  }
}
