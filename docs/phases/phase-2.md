# Phase 2 — Wallet, Deposits & Transaction Ledger

> **Deliverable:** Full deposit request → admin review → wallet credit loop working
> end-to-end with an accurate, race-condition-safe ledger, and a polished, consistent UI
> matching Phase 1's design system.

---

## PROMPT — PHASE 2: Wallet, Deposits & Transaction Ledger

This is Phase 2 of 5, building on the existing Laravel 13 + Inertia + React (TypeScript)

- shadcn/ui foundation from Phase 1. Reuse the existing AppLayout, AdminLayout, StatCard,
  EmptyState, PageHeader, and DataTable components — do not recreate them. Keep using the
  established color system and typography; do not introduce a different visual style.

### DATA MODEL

1. `wallets` table: user_id (FK, unique), balance (decimal 12,2, default 0), timestamps.
   Create a wallet automatically when a user registers (model event or observer).
2. `deposits` table: user_id, amount (decimal 12,2), receipt_path (string, nullable
   until uploaded), status enum (`pending`, `approved`, `rejected`), rejection_reason
   (nullable text), reviewed_by (nullable FK to users), reviewed_at (nullable timestamp),
   timestamps.
3. `wallet_transactions` table (immutable ledger — never update or delete rows):
   wallet_id, type enum (`deposit_credit`, `ticket_purchase`, `admin_credit`,
   `admin_debit`, `refund`), amount (decimal 12,2, signed — positive for credits,
   negative for debits), balance_after (decimal 12,2 — snapshot for audit),
   reference_type + reference_id (polymorphic, so it can point to a Deposit, a
   future Ticket, or a manual adjustment), description, timestamps.
4. Wrap every balance-changing operation in a DB transaction with row locking
   (`lockForUpdate`) on the wallet row to prevent race conditions, and always insert
   a corresponding wallet_transactions row in the same transaction. Never mutate
   `wallets.balance` without also writing a ledger row — build a small
   `WalletService` class with `credit()` and `debit()` methods that enforce this
   and throw a custom `InsufficientFundsException` when a debit would go negative.

### STANDARD USER FEATURES

1. Wallet Dashboard (`/app/wallet`): current balance in a prominent hero-style
   StatCard, a "Request Deposit" primary button, and tabs or a segmented control for
   "Pending Deposits", "Transaction History", and "Deposit History" — each a DataTable.
2. Deposit Initiation: a dialog or dedicated page with an amount field (min deposit
   validation) and a drag-and-drop file upload (image/PDF, size-limited) for the
   proof-of-payment receipt, using shadcn's Input/Form components styled as a clean
   dropzone (not a bare `<input type=file>`). Store the file via Laravel's storage
   (local disk is fine, structured as `receipts/{user_id}/{uuid}.ext`). Show a
   pending-status badge immediately after submission.
3. Transactions page: full ledger table with type badges (color-coded: green for
   credits, red/neutral for debits), running balance column, filters by type and
   date range, and pagination. Rejected deposits show their rejection reason inline
   (e.g., an expandable row or tooltip).
4. Use shadcn's `sonner` toast for all success/error feedback (deposit submitted,
   validation errors, etc.) — no plain alert() calls.

### ADMIN FEATURES

1. Verification Queue (`/admin/deposits`): DataTable of pending deposits — user name/
   email, amount, submitted date, a "View Receipt" action that opens the uploaded
   image/PDF in a shadcn Dialog or new tab, and Approve/Reject buttons.
2. Approve flow: single click confirmation (AlertDialog) → marks deposit `approved`,
   sets reviewed_by/reviewed_at, and calls `WalletService::credit()` for the exact
   deposit amount, writing a `deposit_credit` ledger entry referencing the deposit.
3. Reject flow: opens a dialog requiring a mandatory rejection reason (Textarea,
   required, min length validation) before confirming — no wallet change happens,
   deposit marked `rejected` with the reason stored and shown to the user.
4. Show an "Approved" and "Rejected" tab/filter alongside "Pending" on the same page
   so admins have full deposit history in one place, not just the queue.
5. All deposit approvals/rejections must also be recorded for the Phase 5 audit trail
   — for now, create a simple `admin_actions` table (admin_id, action_type, subject_type,
   subject_id, description, timestamps) and log every approve/reject here. Phase 5
   will build the full audit viewer UI on top of this table.

### DESIGN NOTES

- Empty states matter here: no pending deposits, no transactions yet, etc. — use the
  EmptyState component from Phase 1 with contextual copy and a relevant icon, not a
  generic "No data" message.
- Money should always be formatted consistently (currency symbol, 2 decimals,
  thousands separators) via a small shared helper/formatter, used everywhere amounts
  appear across the whole app going forward.

### DELIVERABLE

Full deposit request → admin review → wallet credit loop working end-to-end with an
accurate, race-condition-safe ledger, and a polished, consistent UI matching Phase 1's
design system.
