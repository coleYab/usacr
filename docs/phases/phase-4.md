# Phase 4 — Automated Draws, Results & Notifications

> **Deliverable:** Fully automated draw pipeline from schedule → random selection →
> winner/loser marking → notifications (mail + in-app) → public results archive, with an
> admin oversight view backed by a shared, testable `DrawService`.

---

## PROMPT — PHASE 4: Automated Draws, Results & Notifications

This is Phase 4 of 5, building on the lottery/ticket system from Phase 3. Reuse all
existing models, WalletService, layouts, and shared components. Maintain visual
consistency with prior phases.

### DRAW AUTOMATION

1. Build an Artisan command (e.g., `lotteries:process-draws`) that:
    - Finds all lotteries with status `active` where `draw_at` <= now.
    - For each, inside a DB transaction with the lottery row locked: if
      tickets_sold is 0, mark it `cancelled` (no valid draw possible) instead of
      drawing — handle this edge case explicitly. Otherwise, randomly select one
      ticket from that lottery's active tickets using a cryptographically
      reasonable random selection (not `ORDER BY RAND()` at scale — fetch ticket
      IDs and use `random_int` / Laravel's `Arr::random` appropriately, or note the
      tradeoff if you do use RAND() for simplicity at small scale).
    - Set winning_ticket_id, mark the winning ticket `won`, mark all other tickets
      for that lottery `lost`, set lottery status `completed`.
    - Write an entry to a new `draw_logs` table: lottery_id, winning_ticket_id,
      total_participants, total_tickets, processed_at, and a hash or seed value used
      for the random selection so the draw is independently verifiable/auditable.
    - Schedule this command to run every minute via Laravel's scheduler
      (`routes/console.php` `Schedule::command(...)->everyMinute()`), and document
      the cron entry needed in production in a code comment.
2. Ensure this whole process is idempotent/safe to run concurrently (use
   `withoutOverlapping()` on the scheduled command) so a slow run never double-draws.

### NOTIFICATIONS

1. Build a Laravel Notification class `LotteryDrawResultNotification` implementing
   both `database` and `mail` channels, sent to every participant of a completed
   lottery right after the draw command processes it (won vs. lost variants — the
   winner gets a distinctly celebratory message, others get a courteous "better luck
   next time" with a link to browse active lotteries).
2. Build a simple, on-brand HTML mail template (reuse the app's color palette in the
   email, don't use Laravel's default blue notification theme) via a Markdown mail
   or a custom Blade mail view.
3. In-app notifications: a bell icon in AppLayout's top nav (badge with unread count),
   opening a Popover/Sheet listing recent notifications (won/lost results, deposit
   approved/rejected from Phase 2 — retrofit those to also use this same notification
   system for consistency), each markable as read, with a "Mark all as read" action.
   Use Laravel's built-in notifications table for this (`notifications` table).
4. Poll for new notifications every ~20–30 seconds client-side (simple interval-based
   Inertia partial reload or a small fetch to a JSON endpoint) — no need for
   WebSockets/Pusher unless you want to note it as an optional enhancement.

### RESULTS & HISTORY

1. Past Results archive (`/app/results` or folded into `/app/lotteries` as a
   "Completed" tab): browsable, searchable list of completed lotteries showing the
   item, the winning ticket code, draw date, and total participants. This should be
   public-friendly (builds trust) — consider allowing logged-out visitors to view
   this page (read-only) since transparency about past winners is a trust signal for
   a platform like this.
2. Each completed lottery's detail page should show the same info plus (for logged-in
   users) whether they personally participated and their outcome.
3. Automated Draw Oversight (`/admin/draws`): admin-facing table backed by
   `draw_logs`, showing every draw that has run, the winning ticket, participant
   count, and the verification seed/hash, so admins can audit that draws are running
   on schedule and fairly. Include a manual "Run Draws Now" button for testing/manual
   triggering that calls the same underlying service the scheduled command uses (do
   not duplicate the draw logic — extract it into a `DrawService` class used by both
   the Artisan command and this admin action).

### DESIGN NOTES

- The winner notification/result reveal is a key emotional moment — give the "You
  Won!" state real visual weight (a distinct celebratory but still on-brand card
  style, not a generic green alert box).
- Keep the results archive page fast and clean to scan — this is a trust/credibility
  page, so favor clarity over decoration here.

### DELIVERABLE

Fully automated draw pipeline from schedule → random selection → winner/loser
marking → notifications (mail + in-app) → public results archive, with an admin
oversight view backed by a shared, testable DrawService.
