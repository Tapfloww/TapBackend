import {
  API_VERSION,
  getNetwork,
  horizonUrl,
  isStellarContractId,
  isStellarPublicKey,
  quoteFee,
} from './stellar';

describe('stellar helpers', () => {
  const valid = 'GDZST3XVCDTUJ76ZAV2HA72KYFL3JCPBHQ4PXESVXHMZQ5MDDG2WXYUP';

  it('accepts G-strkeys and rejects fakes', () => {
    expect(isStellarPublicKey(valid)).toBe(true);
    expect(isStellarPublicKey('GAVXXX')).toBe(false);
  });

  it('validates contract ids', () => {
    expect(
      isStellarContractId(
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4',
      ),
    ).toBe(true);
  });

  it('quotes fees with BPS and cap', () => {
    expect(quoteFee(10_000, 20, 100)).toBe(20);
    expect(quoteFee(10_000, 20, 10)).toBe(10);
  });

  it('exposes version and testnet defaults', () => {
    expect(API_VERSION).toBe('2.0.0');
    expect(getNetwork()).toBe('testnet');
    expect(horizonUrl('testnet')).toContain('horizon-testnet');
  });
});
