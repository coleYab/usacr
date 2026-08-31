# Phase 3 — Lotteries, Ticket Purchasing & My Tickets

> **Deliverable:** End-to-end lottery browsing → ticket purchase → my tickets flow, plus
> full admin lottery lifecycle (create, monitor, cancel/refund), all financially
> consistent with the Phase 2 ledger and visually consistent with Phases 1–2.

---

## PROMPT — PHASE 3: Lotteries, Ticket Purchasing & My Tickets

This is Phase 3 of 5, building on the existing wallet/ledger system from Phase 2 and the
design system from Phase 1. Reuse WalletService, all shared layouts, StatCard,
EmptyState, PageHeader, DataTable, and the currency formatter. Maintain the same visual
language established so far — do not restyle existing pages.

### DATA MODEL

1. `lotteries` table: title, description (text), media (path or JSON array of image
   paths for a small gallery), ticket_price (decimal 10,2), total_tickets (int),
   tickets_sold (int, default 0 — kept denormalized for fast reads but always updated
   inside the same locked transaction as ticket creation), draw_at (timestamp),
   status enum (`draft`, `active`, `completed`, `cancelled`), winning_ticket_id
   (nullable FK, set after draw), created_by (FK admin), timestamps.
2. `tickets` table: lottery_id, user_id, ticket_code (unique random identifier —
   e.g., a ULID or a formatted short code, NOT sequential/guessable), price_paid
   (decimal — snapshot in case admin changes price later), status enum (`active`,
   `won`, `lost`, `refunded`), timestamps.
3. Add a partial unique-safe capacity check: tickets_sold must never exceed
   total_tickets. Enforce with row-level locking on the lottery row during purchase
   (`lockForUpdate`), inside the same DB transaction as the wallet debit and ticket
   row creation — all three must succeed or all roll back.

### STANDARD USER FEATURES

1. Lottery Browsing (`/app/lotteries`): a responsive card grid (not a table) — each
   card shows the item image (or image carousel if multiple), title, truncated
   description, ticket price, a progress bar or "X / Y tickets sold" indicator, and
   a live countdown timer to `draw_at` (client-side ticking, e.g., "2d 4h 12m left" —
   update every second without a page reload). Cards should visually communicate
   urgency as the countdown shrinks (e.g., color shift on the badge under 1 hour).
   Include a filter/segmented control for Active vs. ending-soon, and search by title.
2. Lottery Detail page (`/app/lotteries/{id}`): full image gallery, full description,
   ticket price, remaining capacity, countdown, and a ticket purchase panel: a
   quantity stepper (respecting remaining capacity and the user's wallet balance),
   live total cost calculation, and a "Buy Tickets" button. Disable/gray out
   purchasing with a clear message if the lottery is sold out, past its draw time,
   or the user has insufficient balance (with a CTA linking to the deposit flow).
3. Purchase flow: confirm via AlertDialog showing quantity + total cost, then submit.
   Backend must, atomically: lock the lottery row, verify remaining capacity, lock
   the wallet row, verify sufficient balance, debit the wallet via WalletService
   (writing a `ticket_purchase` ledger entry), generate N ticket rows with unique
   codes, increment tickets_sold. Return the newly generated ticket codes to the
   frontend and show them in a success dialog/toast with a "View My Tickets" link.
4. My Tickets Hub (`/app/tickets`): tabs for Active, Won, Lost — each a card or
   compact list showing lottery title/image thumbnail, ticket code, quantity/tickets
   held for that lottery, price paid, and purchase date. Won tickets get a
   celebratory badge/highlight styling (not overly cartoonish — tasteful, on-brand).

### ADMIN FEATURES

1. Lottery Creation (`/admin/lotteries/create`): form with title, rich-ish description
   (Textarea is fine, no need for a full WYSIWYG unless you want one), multi-image
   upload, ticket price, total tickets cap, and a date-time picker for draw_at
   (shadcn Calendar + time input combo, or a Popover-based datetime picker).
   Save as `draft` or `active`.
2. Active Lottery Monitoring (`/admin/lotteries`): DataTable/card list of all lotteries
   with status badges, tickets sold/remaining, participant count (distinct users),
   and time remaining. Clicking through shows a detail view with a live sales
   breakdown (e.g., a simple bar or the shared chart approach) and a participant list.
3. Cancellation & Refunds: a "Cancel Lottery" action (AlertDialog, requires a reason)
   only available while status is `active`. On confirm: mark lottery `cancelled`,
   then batch-process — for every ticket on that lottery, credit the ticket's
   price_paid back to that user's wallet via WalletService (each in its own locked
   transaction per user, looped safely, ideally dispatched as a queued job if ticket
   counts could be large), mark tickets `refunded`, and write a `refund` ledger entry
   per user referencing the lottery. Log the cancellation to `admin_actions`.

### DESIGN NOTES

- The lottery card grid is the emotional centerpiece of the whole app — invest real
  design effort here: nice image treatment (consistent aspect ratio, subtle gradient
  overlay for text legibility if text sits over images), clear price/progress
  hierarchy, and a countdown that feels alive rather than static text.
- Sold-out and ended lotteries should still be visible but visually "closed" (dimmed,
  badge saying "Sold Out" or "Drawing Soon") rather than disappearing, so users trust
  the numbers they see are real.

### DELIVERABLE

End-to-end lottery browsing → ticket purchase → my tickets flow, plus full admin
lottery lifecycle (create, monitor, cancel/refund), all financially consistent with
the Phase 2 ledger and visually consistent with Phases 1–2.
