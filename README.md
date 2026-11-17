# Adonis Wallets Ledger

A multi-currency wallet API built on a **double-entry, append-only ledger**, using AdonisJS 7, Lucid ORM and MySQL.

It's a learning project: the goal is to get the accounting rules right, not to move real money.

## How it works

- **Balances are never stored.** A wallet's balance is always calculated from its ledger entries (credits minus debits).
- **Every transfer nets to zero.** A transfer writes a debit on the sender and a matching credit on the receiver, and is checked before it commits.
- **Ledger entries are append-only.** They can't be edited or deleted. A correction is a new entry.
- **Amounts are whole numbers in minor units** (e.g. kobo, cents). Decimals are rejected.
- **Each money movement is one database transaction**, and the sender's wallet row is locked while its balance is checked, so two transfers can't spend the same funds.

## Requirements

- Node.js 22+
- MySQL

## Setup

```bash
npm install
cp .env.example .env
node ace generate:key
```

Fill in the `DB_*` values in `.env`, then create the two databases (one-time):

```sql
CREATE DATABASE adonis_wallets;
CREATE DATABASE adonis_wallets_test;
```

Run the migrations and start the dev server:

```bash
node ace migration:run
npm run dev
```

The API runs on `http://localhost:3333`.

## Tests and checks

```bash
npm test                 # all tests (uses adonis_wallets_test, see .env.test)
npm run typecheck
npm run lint

node ace test --files=tests/functional/wallets/transfer.spec.ts   # one file
```

To check the integrity of the ledger in your database:

```bash
node ace ledger:verify
```

It runs five checks and exits with code `1` if any fails:

| Check | Catches |
|---|---|
| C1 | a transfer whose entries don't net to zero |
| C2 | a wallet with a negative balance |
| C3 | an entry whose currency doesn't match its wallet |
| C4 | a completed transaction with no entries |
| C5 | a transaction stuck in `pending` for more than 5 minutes |

## API

All routes are under `/api/v1`. Wallet and account routes need a bearer token from `login` or `register`.

| Method | Route | What it does |
|---|---|---|
| POST | `/auth/register` | create an account (also creates NGN and USD wallets) |
| POST | `/auth/login` | get an access token |
| GET | `/account/profile` | the current user |
| POST | `/account/logout` | revoke the current token |
| GET | `/wallets` | your wallets with balances |
| GET | `/wallets/:id` | one of your wallets |
| POST | `/wallets/deposit` | add funds (`amount`, `currency`). **Demo only**: disabled in production |
| POST | `/wallets/transfer` | send funds (`receiver` email, `amount`, `currency`) |

Every response has the same shape:

```json
{ "success": true, "message": "Transfer successful", "data": { } }
```

## Status

**Phases 0–2 are done; Phase 3 is in progress.** All 27 tests pass.

| Phase | | |
|---|---|---|
| 0 | Auth (access tokens, logout) | ✅ |
| 1 | Ledger core: wallets, deposits, transfers | ✅ |
| 2 | `ledger:verify` integrity checks | ✅ |
| 3 | Multi-currency: exchange rates | 🟡 table and model done |
| 4 | FX conversion | planned |
| 5 | Idempotency keys | planned |
| 6 | Reversals | planned |
| 7 | Balance cache (optional) | planned |

## Upcoming

**Phase 3 (now)**
- Rate maths with integers only (rates are stored as `DECIMAL`, never converted to floats)
- A "latest rate" lookup that rejects rates that are too old
- Seeded NGN ↔ USD rates

**Next**
- **Transfer by username instead of email**, so a failed transfer doesn't reveal whether an email has an account
- **Phase 4, FX conversion:** converting between your own wallets through a system wallet (a 4-entry transaction), plus a system funding wallet so deposits also net to zero
- **Phase 5, idempotency keys:** a retried request can't create a second transaction
- **Phase 6, reversals:** undo a transaction with a new mirrored one, never by editing the original
- **Phase 7, balance cache:** only if balance queries become measurably slow

**Later**
- Live exchange rates, fetched by a scheduled command that only inserts new rate snapshots
