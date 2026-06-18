import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  id: string;
  appId: string;
  userId: string | null;
  txHash: string;
  amount: number;
  fee: number;
  asset: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

@Injectable()
export class TransactionsService {
  private txs: Map<string, Transaction> = new Map();

  constructor() {
    for (let i = 0; i < 10; i++) {
      const tx: Transaction = {
        id: uuidv4(),
        appId: uuidv4(),
        userId: `user_${Math.random().toString(36).substring(7)}`,
        txHash: Math.random().toString(36).substring(2, 66).padEnd(64, '0'),
        amount: Math.random() * 10000,
        fee: Math.random() * 1,
        asset: 'USDC',
        status: ['pending', 'success', 'failed'][Math.floor(Math.random() * 3)] as any,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      };
      this.txs.set(tx.id, tx);
    }
  }

  getByAppId(appId: string, filters?: { userId?: string; status?: string }) {
    let results = Array.from(this.txs.values()).filter(t => t.appId === appId);
    if (filters?.userId) {
      results = results.filter(t => t.userId?.includes(filters.userId!));
    }
    if (filters?.status) {
      results = results.filter(t => t.status === filters.status);
    }
    return results;
  }

  getById(id: string) {
    return this.txs.get(id);
  }

  create(appId: string, data: { userId?: string; amount: number; fee: number; asset: string }) {
    const tx: Transaction = {
      id: uuidv4(),
      appId,
      userId: data.userId || null,
      txHash: Math.random().toString(36).substring(2, 66).padEnd(64, '0'),
      amount: data.amount,
      fee: data.fee,
      asset: data.asset,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.txs.set(tx.id, tx);
    return tx;
  }
}
