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
  echo "=== done $(date -u +%FT%TZ) exit=$? ==="
} >> "$LOG" 2>&1
