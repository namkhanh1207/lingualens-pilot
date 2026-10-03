<!-- reviewer: claude, implementer: codex, round: 1, base: pilot-simple-login, same-vendor: False, 2026-10-03T18:31:49 -->
## Review T001 ΓÇö round 1 (Claude, read-only; implementer: Codex)

**Scope checked:** `git diff pilot-simple-login...HEAD` covers 2 commits (`ee54de6`, `89c316e`) and 3 files.

| File | In `allowed_paths`? |
|---|---|
| `app/workspace.tsx` | Γ£à Yes |
| `.agent-system/handoffs/T001.json` | ΓÜá∩╕Å No, but AGENTS.md step 3 requires this handoff file |
| `.agent-system/tasks/T001.yaml` | ΓÜá∩╕Å No: only `status` and `branch` changed (see Suggestions) |

None of the off-limits areas from AGENTS.md (`route.ts`, `db/schema.ts`, `drizzle/**`, auth, scoring, `requestId`, consent) are touched. No new dependencies, `package-lock.json` is unchanged, and there are no secrets or `.db` files in the diff.

**Correctness check:**
- The fix removes the `useState` initializer that read `window.location.hash`. `page` now always starts as `signedIn ? 'dashboard' : 'discover'`, so the server and the first client render match. This fixes the root cause the task describes.
- Hash routing is still handled by the mount effect that already existed (`app/workspace.tsx:100-124`):
  - `#reading` resumes the unfinished session, and `#reading/<id>` opens only a session the user owns.
  - `#admin` and `#research` are handled through `go()` only when `signedIn`.
  - `#voice` and `#tutor` call `setChatId` and `setChatMode`.
  - Other `nav` pages use `setPage`.
- Behaviour is now stricter, which is good: the old initializer let a guest set `page` to `admin`, `research` or `reading` straight from the hash. Now those go through the existing checks in the effect.
- While loading, the content area shows the "─Éang tß║úi kh├┤ng gian hß╗ìcΓÇª" card (`app/workspace.tsx:297`), so the dashboard content does not flash.
- The handoff reports `check`, `build`, 6 integration suites (128 checks), ui:snapshot before/after (28 ΓåÆ 0 hydration errors) plus a reduced-motion run, and an unchanged ESLint baseline (7 errors, 10 warnings). That matches the acceptance criteria. I did not rerun them; I only compared against the handoff.

### Critical
None.

### Should fix
None.

### Suggestions
1. **`app/workspace.tsx:297`**
   - **Problem:** While `loading` is true, the breadcrumb (`title`) and the active sidebar item still show "Tß╗òng quan" or "Kh├ím ph├í" for a moment before switching to the page from the hash. This is a brief visual glitch, not a hydration error.
   - **Proposal (optional, separate task):** Hide the breadcrumb title or active state while `loading`, or accept it as is.
2. **`app/workspace.tsx:103-104`**
   - **Problem:** If `refresh()` fails (`d` is `undefined`), the effect returns without restoring the hash, so the user stays on dashboard/discover. Before this change they would have stayed on the hash page. An error banner with a reload button is still shown, so the impact is small.
   - **Proposal:** Note it in the handoff `risks`, or have the "Thß╗¡ tß║úi lß║íi" button reapply the hash in a later task.
3. **`.agent-system/tasks/T001.yaml:3,8`**
   - **Problem:** The implementing agent edited a file outside `allowed_paths`. `docs/agent-workflow.md:36` sets a single-writer rule for task YAML. The handoff says the user explicitly requested this, and the change is only process metadata (`status`, `branch`).
   - **Proposal:** The project owner confirms the change is acceptable. Longer term, let `new-task.ps1` or the orchestrator update `branch` and `status` instead of the implementer.
4. **`.agent-system/handoffs/T001.json:6`**
   - **Problem:** The `commit` field points to `ee54de6` (the code commit), while the branch HEAD is `89c316e`.
   - **Proposal:** Write that it is the code commit, or add a `head` field so the reviewer knows exactly what to compare.
5. **`.agent-system/handoffs/T001.json:16`** (and `package.json:17`)
   - **Problem:** The handoff correctly notes that `npm run check` does not run lint, but the AGENTS.md command table describes it as "typecheck + lint + unit".
   - **Proposal:** Open a separate task to update AGENTS.md or add lint to `check`. ESLint debt has to be fixed first, otherwise `check` will fail.
6. **Process:** The handoff says only a same-provider fallback review was done. This review (Claude reviewing Codex) satisfies `reviewer_rule: different-vendor-from-implementer`, so the owner can record that in the handoff or the review file.

APPROVED
