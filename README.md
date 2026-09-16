# TapFlow Backend

NestJS control-plane API for **Stellar fee sponsorship**.

Apps configure sponsor wallets + policies; TapFlow quotes and records sponsored transactions aligned with the Soroban sponsorship vault (`TapContract`).

## v2.0.0

- `GET /health` pings Horizon (`horizon_ok` / degraded)
- Sponsor wallet create requires a valid **G…** public key
- Policies: `maxFeePerTx`, `dailyCap`, `policyBps` (mirrors on-chain quote/cap)
- `GET /v1/apps/:appId/transactions/quote` — BPS fee quote with cap
- `POST .../transactions` enforces policy + daily cap; returns `pending_onchain` (no fake ledger hashes)
- Jest coverage + GitHub Actions CI

```bash
npm install
npm test
npm run build
npm run dev
```

See `.env.example`. Never commit private keys.
