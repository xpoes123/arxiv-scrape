#!/usr/bin/env bash
# arxiv-scrape nightly scout — fetch fresh papers, ideate, BUILD a demo, publish,
# and post a voted 3-paper discussion digest to the SharpLab forum via Sage.
# Run by arxiv-nightly.timer. Fully autonomous headless Claude run.
set -uo pipefail
cd /home/david/code/arxiv-scrape || exit 1
LOGDIR="$HOME/.local/share/arxiv-nightly"; mkdir -p "$LOGDIR"
LOG="$LOGDIR/$(date +%F).log"
DATE="$(date +%F)"
DIGEST="digest_${DATE}.json"
KEYFILE="$HOME/.config/sage/console.key"
{
  echo "=== arxiv nightly start $(date -u +%FT%TZ) ==="

  # Fetch last week's per-tag vote signal so selection can bias toward what the
  # server upvoted. Any failure degrades to an empty object (no bias).
  if [ -f "$KEYFILE" ]; then
    cat "$KEYFILE" | ssh -o BatchMode=yes -o ConnectTimeout=15 vps \
      'read -r KEY; curl -sfS -H "Authorization: Bearer $KEY" "http://localhost:7779/arxiv-votes?days=7"' \
      > votes.json 2>>"$LOG" || echo '{}' > votes.json
  else
    echo '{}' > votes.json
  fi
  [ -s votes.json ] || echo '{}' > votes.json
  echo "votes.json: $(cat votes.json | head -c 400)"

  claude -p "$(cat nightly.md)" --model sonnet --dangerously-skip-permissions
  rc=$?

  # Guardrail: a real run rewrites papers_nightly.json today. If not, the run no-op'd.
  if [ "$DATE" != "$(date -u -r papers_nightly.json +%F 2>/dev/null)" ]; then
    echo "!!! GUARDRAIL: papers_nightly.json not refreshed today — run produced no output. Marking failed."
    rc=1
  fi

  # Post the forum digest on success if the model produced a valid one.
  # NOTIFY_FALLBACK triggers the private /notify path (failure, or no valid digest).
  NOTIFY_FALLBACK=0
  if [ "$rc" -eq 0 ]; then
    if [ -f "$DIGEST" ] && python3 validate_digest.py "$DIGEST" >>"$LOG" 2>&1; then
      { cat "$KEYFILE"; cat "$DIGEST"; } \
        | ssh -o BatchMode=yes -o ConnectTimeout=15 vps 'read -r KEY; curl -sfS -X POST -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" --data-binary @- http://localhost:7779/arxiv-digest >/dev/null' \
        && echo "forum digest posted" \
        || { echo "forum post FAILED — falling back to private notify"; NOTIFY_FALLBACK=1; }
    else
      echo "no valid $DIGEST — falling back to private notify"
      NOTIFY_FALLBACK=1
    fi
  fi

  # Private /notify only on failure or fallback (success posts to the forum instead).
  if [ "$rc" -ne 0 ] || [ "$NOTIFY_FALLBACK" -eq 1 ]; then
    if [ "$rc" -eq 0 ]; then
      NLEVEL=warn; NTITLE="arxiv nightly ⚠️ digest not posted $DATE"
      NBODY="$(awk '/^## /{c++} c==2{exit} c>=1{print}' LOG_nightly.md)"
      [ -z "$NBODY" ] && NBODY="Run finished but no valid $DIGEST was produced — forum post skipped."
    else
      NLEVEL=warn; NTITLE="arxiv nightly ⚠️ no output $DATE"
      NBODY="Guardrail tripped: papers_nightly.json not refreshed today — the run produced nothing. See $LOG on desktop."
    fi
    { cat "$KEYFILE"; \
      printf '%s' "$NBODY" | jq -Rs --arg l "$NLEVEL" --arg t "$NTITLE" '{level:$l,title:$t,body:.}'; } \
    | ssh -o BatchMode=yes -o ConnectTimeout=15 vps 'read -r KEY; curl -sfS -X POST -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" --data-binary @- http://localhost:7779/notify >/dev/null' \
    && echo "sage fallback notify posted" || echo "sage fallback notify FAILED"
  fi

  echo "=== done $(date -u +%FT%TZ) exit=$rc ==="
  exit $rc
} >> "$LOG" 2>&1
