import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { isStellarPublicKey } from '../stellar/stellar';

export interface SponsorWallet {
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
    return Array.from(this.wallets.values()).filter((w) => w.appId === appId);
  }

  create(
    appId: string,
    data: { address: string; asset: string; lowBalanceThreshold: number },
  ) {
    if (!isStellarPublicKey(data.address)) {
      throw new BadRequestException(
        'sponsor wallet address must be a Stellar G… public key',
      );
    }
    if (!(data.lowBalanceThreshold >= 0)) {
      throw new BadRequestException('lowBalanceThreshold must be >= 0');
    }
    const wallet: SponsorWallet = {
      id: randomUUID(),
      appId,
      address: data.address.trim(),
      balance: 0,
      asset: data.asset || 'USDC',
      lowBalanceThreshold: data.lowBalanceThreshold,
      createdAt: new Date().toISOString(),
    };
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  topUp(walletId: string, amount: number) {
    if (!(amount > 0)) {
      throw new BadRequestException('top-up amount must be greater than zero');
    }
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new BadRequestException('wallet not found');
    }
    wallet.balance += amount;
    return wallet;
  }

  getById(id: string) {
    return this.wallets.get(id);
  }
}
