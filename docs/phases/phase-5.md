# Phase 5 — Full Admin Suite: Users, Manual Adjustments & Audit Trail

> **Deliverable:** A complete, production-shaped admin suite (users, adjustments, audit
> trail), two fully realized real-data dashboards, and a final consistency/hardening pass
> across the entire application, ready to demo or deploy.

---

## PROMPT — PHASE 5: User Management, Manual Wallet Adjustments & Audit Trail

This is Phase 5 of 5, the final phase, completing the admin suite on top of
Phases 1–4. Reuse everything already built — WalletService, DrawService,
admin_actions logging pattern from Phase 2, layouts, and shared components.

### USER MANAGEMENT

1. User Directory (`/admin/users`): DataTable of all registered users — name, email,
   role, status badge (active/suspended/banned, color-coded), current wallet
   balance, lifetime deposit total, join date. Include search (name/email), and
   filters by role and status.
2. 360-Degree User View (`/admin/users/{id}`): a detail page with tabs or sections for:
    - Profile summary (StatCards: current balance, lifetime deposits, tickets
      purchased, lotteries won).
    - Full ticket history (reuse the DataTable pattern from My Tickets, admin view).
    - Full wallet transaction ledger for this user (reuse Phase 2's ledger table).
    - Win/loss record summary.
3. Account Moderation: Suspend / Ban / Reactivate actions (AlertDialog, requiring a
   reason for suspend/ban) that update the `status` column. Suspended/banned users
   should be blocked from logging in (already covered by Phase 1 middleware — verify
   it's wired up) and from any deposit/purchase actions if somehow still logged in
   via an active session (add a check in relevant controllers too, not just login).
4. Manual Wallet Adjustments: a "Credit / Debit Wallet" action on the user detail
   page, opening a Dialog with amount, direction (credit/debit), and a REQUIRED
   reason text field. This goes through the same `WalletService` methods (so it
   respects locking and never allows a debit below zero) and writes an
   `admin_credit`/`admin_debit` ledger entry referencing the admin who made it and
   their stated reason. Log to `admin_actions` as well.

### AUDIT TRAIL

1. Build the full audit viewer (`/admin/audit`) reading from the `admin_actions`
   table established in Phase 2: DataTable showing admin name, action type
   (deposit approved/rejected, lottery created/cancelled, user suspended/banned,
   manual wallet credit/debit, etc.), the affected subject (linked — e.g., clicking
   takes you to that user/deposit/lottery), a human-readable description, and
   timestamp. Filters by action type, admin, and date range.
2. Make this log genuinely immutable: no update/delete routes or UI for it at all,
   and ideally add a model-level guard/observer that prevents updates or deletes on
   `AdminAction` records outside of factory/seeding contexts.
3. Retroactively verify every admin action across all previous phases writes to this
   table if it doesn't already (deposit approve/reject, lottery create/cancel, draw
   processing already has its own `draw_logs` — link to it from here rather than
   duplicating, ban/suspend/reactivate, manual wallet adjustments).

### SYSTEM POLISH & HARDENING (final pass across the whole app)

1. Admin dashboard (`/admin/dashboard`) — replace the Phase 1 placeholder with real
   StatCards: total users, total wallet balance across the platform, pending
   deposits count (with a quick link), active lotteries count, tickets sold today/
   this week, and a simple recent-activity feed (latest admin_actions + latest draws).
2. Standard user dashboard (`/app/dashboard`) — replace the Phase 1 placeholder with
   real content: wallet balance StatCard with a quick "Deposit" CTA, active tickets
   count, lotteries won count, and a "Lotteries ending soon" preview row pulling
   from Phase 3 data.
3. Run through every page built across all 5 phases and verify: loading states use
   Skeleton components (not blank flashes), every list has a proper EmptyState,
   every destructive action (cancel, ban, reject, debit) is behind an AlertDialog
   confirmation, form validation errors surface clearly and accessibly (associated
   with their fields, not just a toast), and mobile responsiveness works down to a
   ~375px viewport for the standard user pages at minimum (admin pages can assume
   desktop but shouldn't outright break on tablet).
4. Add basic authorization policies (Laravel Policies) for every admin action so
   route-level middleware isn't the only gate — this matters for defense in depth.
5. Write a short README section (or a `/docs` markdown file in the repo) summarizing
   the data model, the WalletService/DrawService contracts, and the scheduled
   command setup needed in production, so the project is handoff-ready.

### DELIVERABLE

A complete, production-shaped admin suite (users, adjustments, audit trail), two
fully realized real-data dashboards, and a final consistency/hardening pass across
the entire application, ready to demo or deploy.
