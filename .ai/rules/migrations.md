---
paths:
    - 'database/migrations/**'
---

# Migrations

## Don't re-index morphs() columns

When a migration uses `nullableMorphs('reference')` (or `morphs`), that already creates the index on (reference_type, reference_id). Do NOT add a duplicate `$table->index(['reference_type','reference_id'])` — on SQLite it fails with "index already exists", leaving the table half-created and the migration unrecorded. Let the morphs call own that index.
