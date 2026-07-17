#!/usr/bin/env bash
# arxiv-scrape nightly scout — fetch fresh papers, ideate, BUILD a demo, publish. Run by arxiv-nightly.timer.
# Fully autonomous headless Claude run. Model = sonnet (cheap enough to run nightly); bump to opus for fancier demos.
set -uo pipefail
cd /home/david/code/arxiv-scrape || exit 1
LOGDIR="$HOME/.local/share/arxiv-nightly"; mkdir -p "$LOGDIR"
LOG="$LOGDIR/$(date +%F).log"
{
  echo "=== arxiv nightly start $(date -u +%FT%TZ) ==="
  claude -p "$(cat nightly.md)" --model sonnet --dangerously-skip-permissions
  rc=$?
  # Guardrail: a real run rewrites papers_nightly.json today. If not, the run no-op'd (e.g. backgrounded
  # the fetch and exited) — fail loudly so systemd marks it failed instead of green.
  if [ "$(date -u +%F)" != "$(date -u -r papers_nightly.json +%F 2>/dev/null)" ]; then
    echo "!!! GUARDRAIL: papers_nightly.json not refreshed today — run produced no output. Marking failed."
    rc=1
  fi
  echo "=== done $(date -u +%FT%TZ) exit=$rc ==="
  exit $rc
} >> "$LOG" 2>&1
