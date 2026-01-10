# Product Requirements Document — Mogadishu Rentals

Last updated: 2026-01-04

## Overview
- Purpose: Capture how the current web app works, describe desired behaviour, and list requirements to guide development.
- Product: Single-page React + Vite app for browsing and listing rental properties in Mogadishu. Uses Supabase for auth, DB, and storage.

## Current Behavior
- SPA with routes managed in `index.tsx` / `App.tsx`.
- Data sourced from Supabase tables: `listings`, `profiles`, `wishlists`, `listing_photos`.
- Key views: Home listing grid, Product detail, Profile, Create listing, Saved list.
- Auth via Supabase (email/password and OAuth). Session state reflected in UI.
- Known symptom: blank white page can appear when an uncaught runtime exception halts rendering.

## Goals (How we want it)
- Reliable rendering: no blank pages; graceful fallback UI for fatal errors.
- Fast and responsive: quick load and interaction; image placeholders and lazy-loading.
- Resilient: clear UI for network/API failures and offline mode where feasible.
- Clear UX: simple discovery, save/book workflows, and listing management for hosts.
- Secure: enforce access controls and protect secrets; follow least privilege.

## User Personas
- Renter: Browse, save listings, request viewings.
- Host/Lister: Create and manage listings, upload photos.
- Guest: Browse without signing in; limited actions.
- Admin (future): Moderate listings and users.

## Core User Journeys
- Discover → View detail → Save or Book viewing.
- Sign in/up to save listings; optimistic UI with rollback on failure.
- Host creates listing with photos and is redirected to the new detail page.
- Error flow: show inline error with retry; never a full blank page.

## Functional Requirements
- Routing: Deep-linkable routes (/, /saved, /list, /profile, /property/:id).
- Listings API: Return visible, non-deleted items with photos.
- Detail page: Carousel (touch & mouse), host info, save/book actions, badges.
- Auth: Sign in/up + OAuth, session persisted.
- Wishlist: Optimistic save/un-save with server reconciliation.
- Create/Edit/Delete: Hosts may create and mark listings deleted (soft-delete via `is_deleted`).
- Error handling: Catch and surface async and render errors; provide retry.
- Accessibility: Keyboard focusable elements and descriptive labels.

## Non-functional Requirements
- Performance: Aim for low TTI; lazy-load images and split large bundles.
- Resilience: Clear messaging on network issues; retries for transient failures.
- Security: Row-level security and sanitized inputs; no secret keys in frontend.
- Observability: Add error/exception tracking (Sentry or similar) and key analytics.

## Metrics
- Engagement: listings viewed per session, DAU/MAU.
- Conversion: save rate, booking requests per visit.
- Reliability: crash rate (console/runtime errors) should be minimal; blank-page incidents tracked.

## Data & Integrations
- Supabase: Auth, Postgres data, Storage for images. Ensure RLS policies and proper indexes.
- Optional: Google OAuth and analytics provider.

## Security & Privacy
- Secure sessions, avoid exposing admin keys, follow data retention policies, and protect PII.

## Implementation Roadmap (high level)
- Phase 1 — Stabilize rendering
  - Add a global Error Boundary (done).
  - Add unhandled rejection / global error logging.
  - Reproduce and fix any runtime exceptions found in console.
- Phase 2 — UX & performance
  - Image lazy loading, placeholders, and route code-splitting.
  - Improve carousel accessibility and swipe behavior.
- Phase 3 — Hardening
  - Offline UI, retry strategies, and monitoring integration.
  - Unit / integration tests for critical flows.
- Phase 4 — Launch polish
  - Analytics, SEO for share links, admin moderation tools.

## Implementation Notes
- Entry files to check: `index.tsx`, `App.tsx`, `vite.config.ts` (base path).
- Quick wins: friendly error fallback, console logging for unhandled rejections, and defensive null checks in components.

## Next Steps
1. Reproduce the blank-page issue locally; capture browser console stack trace.
2. Fix the offending code path(s) and add tests where practical.
3. Integrate runtime error tracking and alerts.

---
File created by the dev team on 2026-01-04.
