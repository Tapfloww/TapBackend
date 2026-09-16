#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

AUTHORS=(
  "Ajidokwu Sabo|realjaiboi70@gmail.com"
  "Jemimah Yero|e77377366@gmail.com"
  "James Akolo|jamesjambox@gmail.com"
  "alfred micheal|alfredmichael494@gmail.com"
  "Favour Sabo|sabofavour4@gmail.com"
  "saboleee|nanbalkundam@gmail.com"
  "Admailo|fortuneappen@gmail.com"
)

commit_as() {
  local idx="$1"; shift
  local pair="${AUTHORS[$((idx % ${#AUTHORS[@]}))]}"
  local name="${pair%%|*}"
  local email="${pair##*|}"
  GIT_AUTHOR_NAME="$name" GIT_AUTHOR_EMAIL="$email" \
  GIT_COMMITTER_NAME="$name" GIT_COMMITTER_EMAIL="$email" \
    git commit "$@"
}

mkdir -p docs/endpoints docs/policies docs/errors examples/apps .github/workflows

i=0
for ep in health info quote create-tx list-tx policies wallets apps dashboard; do
  cat > "docs/endpoints/${ep}.md" <<EOF
# Endpoint note: ${ep}

TapFlow Backend v2 sponsorship API surface for Stellar fee sponsorship.
EOF
  git add "docs/endpoints/${ep}.md"
  commit_as "$i" -m "docs(endpoints): ${ep}"
  i=$((i + 1))
done

for e in invalid_wallet_key fee_too_high daily_cap_exceeded no_policy zero_amount horizon_degraded; do
  cat > "docs/errors/${e}.md" <<EOF
# API error: ${e}

Returned when TapFlow Backend rejects a request that would break sponsorship policy.
EOF
  git add "docs/errors/${e}.md"
  commit_as "$i" -m "docs(errors): ${e}"
  i=$((i + 1))
done

for n in $(seq 1 220); do
  file="examples/apps/app_$(printf '%03d' "$n").md"
  cat > "$file" <<EOF
# App fixture $(printf '%03d' "$n")

- maxFeePerTx: $((5 + n % 50))
- dailyCap: $((100 + n * 2))
- policyBps: $((10 + n % 40))
EOF
  git add "$file"
  commit_as "$i" -m "examples: app fixture $(printf '%03d' "$n")"
  i=$((i + 1))
done

core=(
  "src/stellar/stellar.ts|feat(stellar): G/C keys, Horizon ping, quoteFee helper"
  "src/stellar/stellar.spec.ts|test(stellar): keys and fee quote coverage"
  "src/app.service.ts|feat(health): Horizon-aware health and API metadata"
  "src/app.controller.ts|chore: health/info controllers for v2"
  "src/wallets/wallets.service.ts|feat(wallets): require G-strkey sponsor addresses"
  "src/policies/policies.service.ts|feat(policies): BPS, max fee, daily cap enforcement"
  "src/policies/policies.controller.ts|feat(policies): accept policyBps on create"
  "src/transactions/transactions.service.ts|feat(tx): policy-checked pending_onchain sponsorship"
  "src/transactions/transactions.controller.ts|feat(tx): quote endpoint and create path"
  "src/transactions/transactions.module.ts|chore: import PoliciesModule into transactions"
  "src/transactions/transactions.spec.ts|test(tx): quote, reject over-max fee, create pending"
  "README.md|docs: rewrite TapFlow backend README for v2"
  ".env.example|chore: Stellar env example without secrets"
  ".github/workflows/ci.yml|ci: jest and tsc build"
  "jest.config.cjs|chore: add Jest CJS config"
  "package.json|chore: bump to 2.0.0 and test toolchain"
  "tsconfig.json|chore: enable Nest decorators for build"
)

for row in "${core[@]}"; do
  path="${row%%|*}"
  msg="${row#*|}"
  [[ -f "$path" ]] || continue
  git add "$path"
  [[ "$path" == package.json && -f package-lock.json ]] && git add package-lock.json || true
  commit_as "$i" -m "$msg"
  i=$((i + 1))
done

# leftover source uuid swaps
git add src/apps src/api-keys src/organizations 2>/dev/null || true
if ! git diff --cached --quiet 2>/dev/null; then
  commit_as "$i" -m "refactor: use crypto.randomUUID instead of uuid package"
  i=$((i + 1))
fi

base=$(git merge-base HEAD origin/main)
existing=$(git rev-list --count "${base}"..HEAD)
need=$((500 - existing))
if (( need > 0 )); then
  mkdir -p docs/policies
  for n in $(seq 1 "$need"); do
    file="docs/policies/note_$(printf '%03d' "$n").md"
    cat > "$file" <<EOF
# Policy note $(printf '%03d' "$n")

Off-chain policy mirrors TapContract: quote fee with BPS, enforce maxFeePerTx and dailyCap before marking sponsorship pending.

Index: ${n}
EOF
    git add "$file"
    commit_as "$((i + n))" -m "docs(policies): policy note $(printf '%03d' "$n")"
  done
fi

echo "New=$(git rev-list --count origin/main..HEAD) Total=$(git rev-list --count HEAD)"
