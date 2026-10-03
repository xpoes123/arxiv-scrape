---
name: nightly-scout
description: arxiv-scrape's nightly autonomous paper-digest pipeline — fetch fresh papers, ideate, 3-way subagent build-off (judged), publish to share.djiang.xyz + the SharpLab Discord forum. Runs headless via arxiv-nightly.timer (03:00 daily). Use this to manually trigger tonight's run early, debug a failed run, or inspect the playbook.
---

# arxiv-scrape nightly scout

This is the same playbook the nightly cron (`arxiv-nightly.timer` →
`nightly.sh`) runs headless every night. **The playbook itself lives in
`nightly.md`** in this repo's root (`~/code/arxiv-scrape/nightly.md`) — read
that file and follow it exactly. This SKILL.md is only a discoverability
wrapper (so the playbook shows up via the Skill tool / `/nightly-scout`
instead of only existing as inline prompt text re-read by cron each night);
it deliberately does not duplicate the steps, to avoid the two drifting apart.

To run it manually right now (same as the cron does):
```bash
cd ~/code/arxiv-scrape && claude -p "$(cat nightly.md)" --model sonnet --dangerously-skip-permissions
```
Or just invoke this skill interactively and follow `nightly.md`'s steps
yourself — useful for debugging without the `--dangerously-skip-permissions`
headless wrapper.

Related: `nightly.sh` (the cron wrapper — vote-fetching, guardrails, digest
posting, notify-on-failure), `LOG_nightly.md` (run history, newest first),
`validate_digest.py` (digest schema check), `votes.json` (last week's forum
vote signal, fetched fresh each run).
