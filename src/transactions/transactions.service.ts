import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PoliciesService } from '../policies/policies.service';

export interface Transaction {
  id: string;
  appId: string;
  userId: string | null;
  txHash: string;
  amount: number;
  fee: number;
  asset: string;
  status: 'pending_onchain' | 'success' | 'failed';
  createdAt: string;
}

@Injectable()
export class TransactionsService {
  private txs: Map<string, Transaction> = new Map();

  constructor(private readonly policies: PoliciesService) {}

  getByAppId(appId: string, filters?: { userId?: string; status?: string }) {
    let results = Array.from(this.txs.values()).filter((t) => t.appId === appId);
    if (filters?.userId) {
      results = results.filter((t) => t.userId?.includes(filters.userId!));
    }
    if (filters?.status) {
      results = results.filter((t) => t.status === filters.status);
    }
    return results.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  }

  getById(id: string) {
    return this.txs.get(id);
  }

  quote(appId: string, amount: number, asset = 'USDC') {
    return this.policies.quote(appId, amount, asset);
  }

  create(
    appId: string,
    data: { userId?: string; amount: number; fee: number; asset: string },
  ) {
    if (!(data.amount > 0)) {
      throw new BadRequestException('amount must be greater than zero');
    }
    if (!(data.fee > 0)) {
      throw new BadRequestException('fee must be greater than zero');
    }
    const asset = data.asset || 'USDC';
    const policy = this.policies.assertFeeAllowed(appId, data.fee, asset);
    this.policies.consumeFee(policy.id, data.fee);

    const tx: Transaction = {
      id: randomUUID(),
      appId,
      userId: data.userId || null,
      // Honest pending ref until a Horizon/Soroban submit attaches a real hash.
      txHash: `pending_${randomUUID().replace(/-/g, '').slice(0, 16)}`,
      amount: data.amount,
      fee: data.fee,
      asset,
      status: 'pending_onchain',
      createdAt: new Date().toISOString(),
    };
    this.txs.set(tx.id, tx);
    return tx;
  }
}
