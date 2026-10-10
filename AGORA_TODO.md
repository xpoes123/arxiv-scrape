
## 2026-10-04 — from the agora forum
- [ ] Harden `nightly.sh`'s guardrail: it only checks that `papers_nightly.json` was refreshed today, so a build-off/publish-stage failure (demo or `digest_<date>.json` never produced) would land as a "success" exit and skip the fallback notify. Add a check that a demo HTML + valid digest exist for `$DATE` before treating the run as OK.
- [ ] Decide and document (e.g. a note in `nightly.md` or `LOG_nightly.md`) whether to keep or drop the per-night security-review pass on generated `ideation_*`/`buildoff_*` artifacts — it's found zero issues across many consecutive runs on code that never executes in prod.
