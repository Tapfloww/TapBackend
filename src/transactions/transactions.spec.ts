import { PoliciesService } from '../policies/policies.service';
import { TransactionsService } from './transactions.service';

describe('sponsorship policy + transactions', () => {
  const appId = 'app_test';
  let policies: PoliciesService;
  let txs: TransactionsService;

  beforeEach(() => {
    policies = new PoliciesService();
    txs = new TransactionsService(policies);
    policies.create(appId, {
      asset: 'USDC',
      maxFeePerTx: 10,
      dailyCap: 100,
      policyBps: 20,
    });
  });

  it('quotes fee under policy', () => {
    const q = txs.quote(appId, 10_000, 'USDC');
    expect(q.fee).toBe(10); // 20 bps capped at maxFeePerTx 10
  });

  it('rejects fee above maxFeePerTx', () => {
    expect(() =>
      txs.create(appId, { amount: 100, fee: 50, asset: 'USDC' }),
    ).toThrow(/maxFeePerTx/);
  });

  it('creates pending_onchain sponsorship tx within policy', () => {
    const tx = txs.create(appId, { amount: 100, fee: 5, asset: 'USDC' });
    expect(tx.status).toBe('pending_onchain');
    expect(tx.txHash.startsWith('pending_')).toBe(true);
  });
});
