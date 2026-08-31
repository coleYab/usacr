# Item Lottery & Raffle Platform

A production-grade, verifiable item-based raffle platform built with **Laravel 13**, **Inertia.js (React + TypeScript)**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🌟 Core Architecture & Invariants

1. **Immutable Double-Entry Wallet Ledger:**
    - Balance changes never occur without a matching `wallet_transactions` row.
    - All balance updates must pass through `App\Services\WalletService::credit()` or `debit()` with database row-level locking (`lockForUpdate`).
    - Overdrafts are strictly prevented with `InsufficientFundsException`.
2. **Atomic Ticket Purchases:**
    - Purchasing locks the lottery row, checks remaining capacity, verifies wallet liquidity, debits the user, creates ticket rows, and increments `tickets_sold` within a single atomic database transaction.
3. **Automated & Verifiable Draw Engine:**
    - Shared draw engine in `App\Services\DrawService` used by both the console scheduler (`php artisan lotteries:process-draws`) and the admin manual trigger.
    - Generates cryptographically secure 16-byte random seeds and SHA-256 hashes (`hash('sha256', "$seed:$winningTicketId:$totalCount")`) stored in `draw_logs` for provable fairness.
    - Emits multi-channel notifications (in-app database bell + branded emails) to all participants upon draw completion.
4. **Immutable Administrative Audit Trail:**
    - Every administrative action (deposit reviews, lottery creation/cancellation, account moderation, and manual wallet adjustments) is recorded in `admin_actions`.
    - `AdminAction` records have model-level guards that strictly block update or delete operations.

---

## 🗄️ Domain Data Model

- **`users`:** Accounts with `role` (`user`, `admin`) and `status` (`active`, `suspended`, `banned`).
- **`wallets`:** 1-to-1 account balance linked to a user.
- **`wallet_transactions`:** Immutable ledger rows (`type`, `amount`, `balance_after`, `reference`, `description`).
- **`deposits`:** User deposit requests with uploaded receipt image proofs, review workflow, and reviewer notes.
- **`lotteries`:** Item raffle records with image galleries, ticket pricing, maximum capacity, draw countdown timers, status (`draft`, `active`, `completed`, `cancelled`), and winning ticket pointers.
- **`tickets`:** Individual entry records with unique 8-character alphanumeric codes (`ticket_code`), purchase price, and status (`active`, `won`, `lost`, `refunded`).
- **`draw_logs`:** Audit log of all completed draws with seed, verification hash, and participant statistics.
- **`admin_actions`:** Comprehensive audit trail of all operational admin events.
- **`notifications`:** Multi-channel notification delivery (in-app header bell + mailers).

---

## 🚀 Production Deployment & Scheduler

To run the automated draws and scheduled routines in production, add Laravel's worker and scheduler to cron:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or run the draw processor directly:

```bash
php artisan lotteries:process-draws
```

---

## 🛠️ Verification & CI Checks

Run the end-to-end quality and testing check before pushing code:

```bash
composer ci:check
```

This verifies:

- `npx vp check`: Frontend formatting and linting
- `npm run types:check`: TypeScript type check
- `vendor/bin/pint`: PHP code formatting
- `vendor/bin/phpstan analyse`: PHPStan static analysis (Level 7)
- `vendor/bin/pest`: Pest test suite
