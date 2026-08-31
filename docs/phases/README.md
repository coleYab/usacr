# Item Lottery Platform — Phased Implementation Plan

This repo builds **Item Lottery**: a platform where users deposit funds into a wallet and
spend that balance buying tickets in item-based lotteries (raffles).

**Stack:** Laravel 13 · Inertia.js (React + TypeScript) · shadcn/ui · Tailwind CSS ·
MySQL/PostgreSQL.

The product is shipped in **5 sequential phases**. Each phase below is a self-contained
prompt that builds on the previous ones. The foundation (scaffold, shadcn/ui, theme,
route-generation) is already in place — later prompts intentionally reuse it rather than
redefine it.

## How to use the prompts

- Feed one phase prompt at a time to your AI coding assistant, **in order**.
- After each phase, click through the UI and review before starting the next.
- The design quality bar set in Phase 1 is what every later phase inherits; each phase
  repeats the core "reuse existing, don't restyle" directive on purpose to keep the whole
  app visually consistent.

## Phase index

| File                         | Phase                                              | Summary                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`phase-1.md`](./phase-1.md) | Foundation, Auth, Roles & Design System            | Scaffold auth/roles, role middleware, shared `AppLayout`/`AdminLayout` + primitives (`StatCard`, `EmptyState`, `PageHeader`, `DataTable`), landing page, placeholder dashboards. |
| [`phase-2.md`](./phase-2.md) | Wallet, Deposits & Transaction Ledger              | `wallets`, `deposits`, immutable `wallet_transactions` ledger; `WalletService` with row locking; user deposit flow + admin verify queue; `admin_actions` audit table.            |
| [`phase-3.md`](./phase-3.md) | Lotteries, Ticket Purchasing & My Tickets          | `lotteries` + `tickets`; atomic ticket purchase; lottery card grid, detail page, My Tickets hub; admin lottery create/monitor/cancel-refund.                                     |
| [`phase-4.md`](./phase-4.md) | Automated Draws, Results & Notifications           | `DrawService` + scheduled `lotteries:process-draws`; winner/loser marking; mail + in-app notifications; public results archive; admin draw oversight (`draw_logs`).              |
| [`phase-5.md`](./phase-5.md) | Full Admin Suite: Users, Adjustments & Audit Trail | User directory + 360° view, suspend/ban/reactivate, manual wallet adjustments, full audit viewer, real-data dashboards, final hardening pass.                                    |

## Sequencing notes

- **Phase 2 before Phase 3 is deliberate**: tickets can't be purchased safely until the
  wallet ledger and locking pattern exist, since ticket purchases _are_ wallet debits.
- **Phase 4 depends on Phase 3's ticket/lottery schema** but is otherwise fairly
  separable — if you want results/notifications sooner you could reorder 3 and 4, but the
  draw engine needs real tickets to draw from.
- **Phase 5 is intentionally last** since it audits and manages everything built in
  Phases 1–4; running it earlier would mean auditing features that don't exist yet.
