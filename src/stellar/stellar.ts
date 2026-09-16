export type StellarNetwork = 'testnet' | 'public';

const STELLAR_ACCOUNT = /^G[A-Z2-7]{55}$/;
const STELLAR_CONTRACT = /^C[A-Z2-7]{55}$/;

export const API_VERSION = '2.0.0';

export function getNetwork(): StellarNetwork {
  const value = (process.env.STELLAR_NETWORK || 'testnet').toLowerCase();
  return value === 'public' || value === 'mainnet' ? 'public' : 'testnet';
}

export function horizonUrl(network: StellarNetwork = getNetwork()): string {
  if (process.env.STELLAR_HORIZON_URL) return process.env.STELLAR_HORIZON_URL;
  return network === 'public'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';
}

export function isStellarPublicKey(value: string): boolean {
  return Boolean(value) && STELLAR_ACCOUNT.test(String(value).trim());
}

export function isStellarContractId(value: string): boolean {
  return Boolean(value) && STELLAR_CONTRACT.test(String(value).trim());
}

export function quoteFee(amount: number, policyBps: number, maxFee: number): number {
  if (!(amount > 0) || policyBps < 0) return 0;
  const quoted = Math.floor((amount * policyBps) / 10_000);
  return quoted > maxFee ? maxFee : quoted;
}

export async function pingHorizon(timeoutMs = 2500): Promise<boolean> {
  const url = `${horizonUrl().replace(/\/$/, '')}/`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
