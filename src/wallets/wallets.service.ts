import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface SponsorWallet {
  id: string;
  appId: string;
  address: string;
  balance: number;
  asset: string;
  lowBalanceThreshold: number;
  createdAt: string;
}

@Injectable()
export class WalletsService {
  private wallets: Map<string, SponsorWallet> = new Map();

  getByAppId(appId: string) {
    return Array.from(this.wallets.values()).filter(w => w.appId === appId);
  }

  create(appId: string, data: { address: string; asset: string; lowBalanceThreshold: number }) {
    const wallet: SponsorWallet = {
      id: uuidv4(),
      appId,
      address: data.address,
      balance: Math.random() * 1000,
      asset: data.asset,
      lowBalanceThreshold: data.lowBalanceThreshold,
      createdAt: new Date().toISOString(),
    };
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  topUp(walletId: string, amount: number) {
    const wallet = this.wallets.get(walletId);
    if (wallet) {
      wallet.balance += amount;
    }
    return wallet;
  }
}
