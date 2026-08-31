# Phase 1 — Foundation, Authentication, Roles & Design System

> **Deliverable:** Working registration/login/logout/password reset via Inertia pages,
> role + status columns and middleware enforced, shared `AppLayout`/`AdminLayout` +
> `StatCard`/`EmptyState`/`PageHeader`/`DataTable` built on the existing design system,
> plus a landing page and two placeholder dashboards. No wallet/deposit/lottery logic yet.

---

## PROMPT — PHASE 1: Foundation, Authentication, Roles & Design System

Set up a new Laravel 13 application using Inertia.js with the React (TypeScript) adapter,
and shadcn/ui for all UI components on top of Tailwind CSS. This is Phase 1 of 5 for a
web app called "Item Lottery" — a platform where users deposit funds into a wallet and
spend that balance buying tickets in item-based lotteries (raffles). Do NOT build wallet,
deposit, or lottery logic yet — this phase is strictly foundation, auth, and shared layout.

### IMPORTANT — ALREADY CONFIGURED, DO NOT REDO

This project already has the following set up. Inspect the existing codebase first and
build on top of it exactly as configured — do not reinitialize, reinstall, or introduce a
second/competing setup for any of these:

- shadcn/ui is already installed and initialized (components.json, Tailwind config,
  CSS-variable-based theming, lucide-react icons already wired in).
- The design system/theme (brand colors, typography, light/dark mode CSS variables) is
  already configured in the Tailwind/shadcn theme layer. Use the existing `--primary`,
  `--accent`, and other theme tokens as-is — do not hardcode new colors, do not swap in a
  different font stack, and do not override the existing theme. If any of these tokens
  seem unset or default-looking, flag it back to me rather than silently picking your own
  palette.
- Route generation from Laravel to React is already configured (Ziggy or equivalent route
  helper is installed and working) — use the existing `route()` helper for all links and
  Inertia visits; do not install a second routing helper or hand-write URL strings.

Your job in this phase is auth, roles, and the shared layout/primitive components that
sit on top of this existing foundation — not the foundation itself.

### TECH SETUP

1. Confirm Laravel 13 + Inertia.js + React (TypeScript) is running end-to-end (a basic
   Inertia page renders). If any part of this base scaffold is genuinely missing, add
   only the missing piece — don't reinitialize what's already there.
2. Verify shadcn/ui's existing setup includes these components; install only whichever
   are missing (don't reinit the ones that exist): button, card, input, label, form,
   table, badge, dialog, sheet, dropdown-menu, tabs, avatar, separator, skeleton, sonner
   (toast), select, textarea, alert, alert-dialog, pagination, tooltip, progress,
   checkbox, switch, popover, command, breadcrumb, scroll-area.
3. Configure Laravel's authentication scaffolding (email/password, email verification,
   password reset) rebuilt as Inertia pages, not Blade, styled with the existing theme.
4. Add a `role` enum to the users table via migration: `user`, `admin`. Add
   `status` enum: `active`, `suspended`, `banned`. Default role `user`, status `active`.
5. Build role-based middleware (`EnsureUserIsAdmin`) and route groups: `/app/*` for
   authenticated standard users, `/admin/*` for admin-only, redirecting appropriately.
   A suspended/banned user should be logged out with a clear message on login attempt.
   Register these routes through the existing route-generation setup so they're
   immediately available to `route()` calls in React — don't bypass it.
6. Set up a `.env.example` with placeholder mail config (for later phases) and queue
   config using database driver for now.

### LAYOUTS & SHARED PRIMITIVES — THE MOST IMPORTANT PART OF THIS PHASE

Using the existing shadcn theme and design tokens (do not introduce new ones), build the
shared structure every later phase depends on. The bar is a real SaaS product, not a
generic admin template: generous whitespace, a consistent 8px spacing scale, subtle
border-based separation rather than heavy drop shadows, rounded-xl corners on cards, and
restrained use of color (color communicates status/action, not decoration) — all pulled
from the theme tokens already in place, applied consistently rather than ad hoc per page.

- Build a real layout shell now that all later phases reuse:
    - `AppLayout` (for standard users): top nav with logo, nav links (Dashboard,
      Lotteries, My Tickets, Wallet), a wallet-balance pill always visible in the
      top-right, user avatar dropdown (Profile, Settings, Logout), theme toggle.
    - `AdminLayout`: persistent left sidebar (collapsible), grouped nav sections
      (Overview, Deposits, Lotteries, Users, Audit & System), breadcrumbs in the
      header, admin's own avatar dropdown.
    - Wire up the existing theme toggle mechanism (if one is already configured) into
      both layouts' nav; if no toggle exists yet, add one using the existing CSS-variable
      dark mode setup rather than building a parallel dark-mode system.
- Build reusable primitives now, using the existing theme tokens (not raw unstyled
  shadcn defaults, and not new colors of your own):
    - `StatCard` (icon, label, value, optional trend/delta) for dashboard metrics.
    - `EmptyState` (icon, title, description, optional CTA button) — every list-style
      page in later phases needs this for zero-data states. Design it so it doesn't
      look like an afterthought.
    - `PageHeader` (title, description, right-aligned actions slot).
    - `DataTable` wrapper around shadcn's table primitives with built-in pagination,
      empty state, and loading skeleton rows — later phases will pass columns/data.
- Build a public marketing-style landing page (`/`) for logged-out visitors: hero
  section explaining the concept, how-it-works 3-step section, and CTA to
  register/login. This is the user's first impression — make it polished, not a
  placeholder.
- Build placeholder dashboard pages for both `/app/dashboard` and `/admin/dashboard`
  using `StatCard` with dummy data, so the shell is visibly working end to end.

### DELIVERABLE FOR THIS PHASE

- Working registration/login/logout/password reset via Inertia pages, styled with the
  existing shadcn theme and using the existing route-generation helper throughout.
- Role + status columns and middleware enforced.
- Shared AppLayout, AdminLayout, StatCard, EmptyState, PageHeader, and DataTable built
  on top of the already-configured design system — consistent, not reinvented.
- Landing page + two placeholder dashboards.

Do not implement wallet, deposits, or lotteries yet — stub only what's needed for nav links.
