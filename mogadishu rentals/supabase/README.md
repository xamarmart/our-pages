# Supabase backend setup (Mogadishu Rentals)

## What you already have
- Migrations: `supabase/migrations/*.sql` (schema, RLS, buckets, triggers).
- Types: `types.ts` generated for the current schema (used by the Supabase client helper).
- Seed data template: `supabase/seeds/demo_rentals.sql` (needs host UUIDs).

## Prereqs
1) Supabase project created.
2) Supabase CLI installed (`npm i -g supabase` or `brew install supabase/tap/supabase`).
3) Service role key and project DB connection string handy (from Supabase dashboard > Project Settings > API / Database).
4) Create at least two host users in Auth (Dashboard > Authentication > Users) so you have their `id` UUIDs for seeding.

## Configure environment
Add these to `.env.local` (already present, fill values):
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Apply migrations (schema + RLS)
Option A: Supabase CLI
```
supabase link --project-ref <project-ref> --password <db-password>
supabase db push
```

Option B: psql
```
psql "$SUPABASE_DB_URL" -f supabase/migrations/20251228204231_131eca3a-e4f8-402d-90c3-8340632f3159.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20251228204241_c34f1347-f52c-41d0-a8aa-b65c8452b13e.sql
```
(Use the connection string from Settings > Database > Connection string.)

## Seed demo rentals (requires host UUIDs)
```
psql "$SUPABASE_DB_URL" \
  -v host1=<host_uuid_1> \
  -v host2=<host_uuid_2> \
  -f supabase/seeds/demo_rentals.sql
```
This inserts six sample listings and primary photos into the `listing-photos` bucket (public URLs).

## Client helper
Use `supabaseClient.ts` which creates a typed client from `types.ts`:
```
import { supabase } from './supabaseClient'
const { data } = await supabase.from('listings').select('*').eq('is_visible', true)
```

## Next
- When you share credentials, I can run the migration/seed commands against your project.
- If you want automated deploys, we can add a GitHub action to run `supabase db push` on main.
