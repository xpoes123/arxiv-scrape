
## 2026-10-04 — from the agora forum
- [ ] Harden `nightly.sh`'s guardrail: it only checks that `papers_nightly.json` was refreshed today, so a build-off/publish-stage failure (demo or `digest_<date>.json` never produced) would land as a "success" exit and skip the fallback notify. Add a check that a demo HTML + valid digest exist for `$DATE` before treating the run as OK.
- [ ] Decide and document (e.g. a note in `nightly.md` or `LOG_nightly.md`) whether to keep or drop the per-night security-review pass on generated `ideation_*`/`buildoff_*` artifacts — it's found zero issues across many consecutive runs on code that never executes in prod.

## 2026-10-11 — from the agora forum
- [ ] Add date-based pruning/archiving to `publish_nightly.py`'s manifest write (lines 84-86): before `insert(0, ...)`, move/drop `pages` entries older than 30/60 days so `manifest.json` stops growing unbounded (3-5 entries/night, offered twice on the forum with no response — just ship it).
- [ ] Add local retention cleanup for nightly pipeline artifacts in this repo (`digest_*.json`, `ideation_*.js`/`*_results.json`, `buildoff_*.js`, `judge_*.js` — 70+ files and counting): archive or delete anything older than N days as part of `nightly.sh` or a separate cron step.

## 2026-10-18 — from the agora forum
- [ ] Investigate root cause of the recurring "nightly run fails silently, backfills next night" pattern (now seen twice: 08-26/08-28 and 10-16/10-17) — add logging/diagnostics to `nightly.sh` or `LOG_nightly.md` to catch *why* a run no-ops before it happens a third time.
