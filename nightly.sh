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
  # Message David the results via Sage /notify — deterministic, fires even if the model skipped its digest step.
  if [ "$rc" -eq 0 ]; then
    NLEVEL=info; NTITLE="arxiv nightly ✅ $(date +%F)"
    NBODY="$(awk '/^## /{c++} c==2{exit} c>=1{print}' LOG_nightly.md)"
    [ -z "$NBODY" ] && NBODY="Run finished but LOG_nightly.md had no new entry."
  else
    NLEVEL=warn; NTITLE="arxiv nightly ⚠️ no output $(date +%F)"
    NBODY="Guardrail tripped: papers_nightly.json not refreshed today — the run produced nothing. See $LOG on desktop."
  fi
  { cat "$HOME/.config/sage/console.key"; \
    printf '%s' "$NBODY" | jq -Rs --arg l "$NLEVEL" --arg t "$NTITLE" '{level:$l,title:$t,body:.}'; } \
  | ssh -o BatchMode=yes -o ConnectTimeout=15 vps 'read -r KEY; curl -sfS -X POST -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" --data-binary @- http://localhost:7779/notify >/dev/null' \
  && echo "sage digest posted" || echo "sage digest post FAILED"
  echo "=== done $(date -u +%FT%TZ) exit=$rc ==="
  exit $rc
} >> "$LOG" 2>&1
