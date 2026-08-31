---
paths:
  - 'resources/js/routes/**'
---

# Routes

## Regenerate Wayfinder routes with --with-form
When adding/changing routes and running `php artisan wayfinder:generate`, ALWAYS pass `--with-form` (the vite plugin uses `formVariants: true`). Without it, generated routes drop the `.form` helper, breaking `tsc` for auth/settings pages that call e.g. `login.form`. Verify by grepping `resources/js/routes/index.ts` for `form`.
