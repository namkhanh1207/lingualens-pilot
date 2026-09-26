# LinguaLens pilot implementation

## Decision D-005 — constrained remote pilot

The source pack proposes Next.js + FastAPI/NestJS + PostgreSQL for the long-term release. This separate pilot uses React/TypeScript with the Vinext Next-compatible runtime, typed/validated server API and Cloudflare D1 (SQLite) managed by Sites. This deliberate deviation makes durable remote deployment possible without first requiring hosting/database accounts. The original static demo is preserved untouched. It is not a claim of PostgreSQL/NestJS parity; a production migration remains future work.

Authentication is dispatch-owned Sign in with ChatGPT, explicitly accepted by the project owner. Admin permissions come only from server environment ADMIN_EMAILS; no client-side role switcher. Runtime provider secrets never ship to the browser.

## Implemented pilot flows

- Five original reading passages (A2–B2 estimates), searchable by title/topic/level; server-held answer keys.
- Persistent reading sessions, paragraph highlights, notes, drafts, hints, MCQ checking and evidence; open answers explicitly self-reviewed.
- Bookmarks, session history, vocabulary notebook, review scheduling and progress based on actual attempts.
- Tutor and conversation adapters; prepared fallback explicitly labeled. Optional Gemini text API with per-user/global daily call limits; no API credentials configured by default.
- Browser speech recognition/synthesis with opt-in and text fallback; no raw audio storage.
- Instructional articulation diagram and camera preview. Nine-point gaze walkthrough explicitly does not measure gaze. No pronunciation scores invented.
- Forum posts/edit/delete/comments/reports, moderation; support tickets and replies; pilot feedback.
- Separate research and AI consent, consent history, pseudonymous research export filtering current consent, per-user export/deletion.
- Research protocol drafts. No actual randomization, cohort assignment or validated adaptive model yet.

## Important limitations

- No real LLM until GEMINI_API_KEY is configured. GEMINI_MODEL defaults to gemini-2.5-flash-lite; verify model availability when adding the key.
- Five sample passages and twenty fixed questions; no validated dynamic question generation or full dictionary provider.
- New sessions retain answer/hint history and first results separately. Legacy sessions retain incomplete history; no attempt trajectory is reconstructed. See docs/product/phase-1-data.md. Neither metric is a pre/post learning-gain measure.
- Behavior telemetry records active dwell approximations, scroll, lookup, highlights and answer-change counts only after consent. Not gaze, attention, emotion or exact rereading.
- Experiment forms save proposals only. All pilot participants currently use the same staged hints.
- Retention is an explicitly disclosed manual policy; no automatic purge job. Previously downloaded exports cannot be remotely recalled.
- Budget limits are requests/tokens safeguards, not an automatic guarantee on a paid provider invoice. Keep free tier and paid billing disabled unless deliberately configured.
- Data is user-isolated by query ownership. There is no real-time collaborative session editing; use one active tab per reading session.

## Validation

- TypeScript `tsc --noEmit`.
- Production Worker build.
- `tests/pilot.integration.mjs`: localhost-only integration tests against a built Worker with disposable header identities; rejects any non-local URL. Tests auth, ownership, CSRF, consent, persistence, grading, review, moderation, support, export and fallback.
- Browser walkthrough on local preview. Production identity is supplied by Sites dispatch; local built-Worker header injection is solely a test boundary and is never exposed as an authentication mechanism in the deployed app.

## Local operation

Node 22.13+; install from the checked-in package lock. `npm run dev` starts the portable preview on localhost:5173. The bundled Windows npm shim had a path error in this environment; `node scripts/run-framework.mjs dev` and `node scripts/run-framework.mjs build` are equivalent direct commands.

Generate schema with `npm run db:generate`; use generated migration files exactly once for each local database. The initial schema is `drizzle/0000_safe_blue_marvel.sql`. Hosted migrations are applied by Sites when publishing.

For integration testing, run a built Worker on localhost:8787 with ADMIN_EMAILS=test-admin@sites.test, then `node tests/pilot.integration.mjs`. Never point tests at the live site.

## Requirement traceability (pilot)

| Requirements | Implementation | Verification |
| --- | --- | --- |
| FR-AUTH-003 | server role allowlist + platform identity | integration role/anonymous checks |
| FR-READ-004/006/008 | highlights/bookmarks/resumable sessions | browser + integration persistence |
| FR-AIQ-003/005 | curated evidence and staged hints | integration evidence/hint checks |
| FR-VOC-003/004 | notebook, flashcards, spaced review | integration schedule + browser |
| FR-ADA-003/004 | transparent rule-based practice suggestion | browser; not validated adaptation |
| FR-BEH | consent-gated event endpoint | consent withdrawal tests |
| FR-GAZ/FR-PRO | opt-in camera + labeled educational prototype | UI; measurement deferred |
| FR-VOI | persona text/browser speech with prepared/real adapter labels | fallback test + UI; live API pending key |
| FR-FOR/FR-SUP | forum and private ticket flows | integration ownership/moderation/support |
| FR-RES-003/004 | versioned consent + filtered research export | integration export/withdrawal |
| FR-PRI-002/003 | per-user export/delete | integration cleanup + ownership |

## Pilot handoff

Participants: sign in with ChatGPT → set nickname and optional research consent in Hồ sơ & riêng tư → complete one reading → save/review words → explore labs → submit Hỗ trợ & góp ý.

Owner: sign in with the configured admin email → Quản trị for support/feedback → Nghiên cứu for consented export. Do not report fictional seed passages, prepared chat responses or walkthrough calibration as measured AI performance.

## September 20 expansion

Added a persisted-data pilot checklist, A2/B2 fictional reading packs, and a consent-filtered research summary with explicit response denominators. Gemini configuration remains deferred.

## Phase 1 data foundation

Stable research identities, versioned reading snapshots, transactional idempotent answer/hint ledger, event deduplication, and consent-aware paginated export are implemented. Export aborts on revision changes rather than mixing pages. Tests: 43 pilot + 32 Phase 1 checks and a migration preservation dry-run. See docs/product/phase-1-data.md for limitations and browser validation.
