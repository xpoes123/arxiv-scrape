# SharpLab arxiv discussion forum — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each night Sage posts up to 3 discussion-worthy arXiv papers as individual voted forum threads in the SharpLab server, and those votes bias the next night's paper selection.

**Architecture:** `arxiv-scrape`'s headless nightly run selects the forum top-3 (prompt-level, biased by last week's votes) and writes `digest_<date>.json`. `nightly.sh` validates that file and POSTs it to a new Sage endpoint, which creates one forum thread per paper (seeded 👍/👎) and stores thread→tags. A second Sage endpoint tallies votes per tag; `nightly.sh` fetches it into `votes.json` before each run.

**Tech Stack:** Python 3.12+, FastAPI, discord.py 2.7, SQLAlchemy 2.0 async (SQLite), pytest (`asyncio_mode = "auto"`). Two repos: `/home/david/code/sage` and `/home/david/code/arxiv-scrape`.

## Global Constraints

- **Forum channel id:** `1542405543279460383` (guild `1477512815580545197`). Sage is already a member of this guild.
- **Max 3 papers/day**, one thread each. Never more than 3.
- **Tag vocabulary (controlled):** `betting, poker, sports, games, gambling, decision-theory, ai, math, bio, physics, econ, whimsy`. Unknown tags tolerated (warning), but only known tags carry historical vote signal.
- **Vote emojis:** 👍 and 👎, seeded by the bot. Net per paper = `(up_count-1) - (down_count-1)` (bot seed cancels).
- **Auth:** all Sage endpoints use the existing `_auth` bearer dependency (`settings.console_api_key`).
- **"Forum only" nuance:** the private `/notify` success ping is dropped; `/notify` still fires on failure OR when no valid digest was produced (so David never goes blind on a stall).
- **Sage tables auto-create** on startup via `Base.metadata.create_all` — no migration needed.
- Forum starter-message id **equals** the thread id (read votes via `thread.fetch_message(thread_id)`).

---

## Task 1: Config field + `ArxivDigestPost` model (Sage)

**Files:**
- Modify: `/home/david/code/sage/sage/config.py` (near `banter_guild_id`, ~line 90)
- Modify: `/home/david/code/sage/sage/db.py` (add model after the `Task` model, ~line 113)
- Test: `/home/david/code/sage/tests/test_arxiv_forum.py` (create)

**Interfaces:**
- Produces: `settings.arxiv_forum_channel_id: int`; `sage.db.ArxivDigestPost` with columns `thread_id (PK, BigInteger), arxiv_id (str), date (str), title (str), tags_json (str), created_at (datetime)`.

- [ ] **Step 1: Add the config field**

In `sage/config.py`, immediately after the line `banter_guild_id: int = 1477512815580545197`:

```python
    # SharpLab discussion forum — Sage posts the nightly arxiv digest here,
    # one thread per paper, seeded with 👍/👎 votes. Same guild as banter.
    arxiv_forum_channel_id: int = 1542405543279460383
```

- [ ] **Step 2: Add the model**

In `sage/db.py`, after the `Task` class (before `class TaskAnomaly`):

```python
class ArxivDigestPost(Base):
    """One posted arxiv-forum thread. Votes live as Discord reactions; this row
    just maps a thread back to its arxiv id, date, and tags for vote tallying."""
    __tablename__ = "arxiv_digest_posts"

    thread_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    arxiv_id: Mapped[str] = mapped_column(String(64), default="")
    date: Mapped[str] = mapped_column(String(10), index=True)   # ISO YYYY-MM-DD
    title: Mapped[str] = mapped_column(Text)
    tags_json: Mapped[str] = mapped_column(Text, default="[]")
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
```

- [ ] **Step 3: Write the failing test** (create `tests/test_arxiv_forum.py`)

```python
"""Tests for the SharpLab arxiv forum poster + vote tally."""
import datetime

import pytest_asyncio

from sage.services import arxiv_forum


# ── Fakes ────────────────────────────────────────────────────────────────
class FakeReaction:
    def __init__(self, emoji, count):
        self.emoji, self.count = emoji, count


class FakeMessage:
    def __init__(self, mid, reactions=None):
        self.id, self.reactions, self.added = mid, reactions or [], []

    async def add_reaction(self, emoji):
        self.added.append(emoji)


class FakeThread:
    def __init__(self, tid, message):
        self.id, self._message = tid, message

    async def fetch_message(self, mid):
        assert mid == self.id
        return self._message


class FakeThreadWithMessage:
    def __init__(self, thread, message):
        self.thread, self.message = thread, message


class FakeForum:
    def __init__(self):
        self.created, self._counter = [], 5000

    async def create_thread(self, name, content):
        self._counter += 1
        msg = FakeMessage(self._counter)
        thread = FakeThread(self._counter, msg)
        self.created.append({"name": name, "content": content, "thread": thread})
        return FakeThreadWithMessage(thread, msg)


class FakeBot:
    def __init__(self, forum, forum_id, threads=None):
        self._forum, self._forum_id, self._threads = forum, forum_id, threads or {}

    def get_channel(self, cid):
        return self._forum if cid == self._forum_id else self._threads.get(cid)

    async def fetch_channel(self, cid):
        ch = self.get_channel(cid)
        if ch is None:
            raise RuntimeError(f"no channel {cid}")
        return ch


@pytest_asyncio.fixture(autouse=True)
async def _setup_db():
    from sage.db import ArxivDigestPost, Base, engine
    async with engine.begin() as conn:
        await conn.run_sync(
            lambda c: Base.metadata.create_all(c, tables=[ArxivDigestPost.__table__])
        )
    yield
    async with engine.begin() as conn:
        await conn.run_sync(lambda c: ArxivDigestPost.__table__.drop(c))


PAPERS = [
    {"title": f"Paper {i}", "arxiv_id": f"260{i}.0000{i}",
     "url": f"https://arxiv.org/abs/260{i}.0000{i}", "tldr": "t",
     "hot_take": "h", "why": "w", "question": "q?", "tags": ["poker"]}
    for i in range(1, 4)
]


async def test_model_table_exists():
    from sage.db import ArxivDigestPost
    assert ArxivDigestPost.__tablename__ == "arxiv_digest_posts"
```

- [ ] **Step 4: Run test to verify it fails**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py::test_model_table_exists -v`
Expected: FAIL — `ImportError`/`ModuleNotFoundError: sage.services.arxiv_forum` (module created in Task 2).

- [ ] **Step 5: Create a stub module so imports resolve**

Create `/home/david/code/sage/sage/services/arxiv_forum.py` with a single line so the test file's top-level import works (real code lands in Task 2):

```python
"""SharpLab arxiv forum poster + vote tally (implemented in Task 2/3)."""
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py::test_model_table_exists -v`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
cd /home/david/code/sage
git checkout -b sharplab-arxiv-forum 2>/dev/null || git checkout sharplab-arxiv-forum
git add sage/config.py sage/db.py sage/services/arxiv_forum.py tests/test_arxiv_forum.py
git commit -m "feat(arxiv-forum): config channel id + ArxivDigestPost model"
```

---

## Task 2: `post_digest` helper (Sage)

**Files:**
- Modify: `/home/david/code/sage/sage/services/arxiv_forum.py`
- Test: `/home/david/code/sage/tests/test_arxiv_forum.py`

**Interfaces:**
- Consumes: `settings.arxiv_forum_channel_id`, `sage.db.ArxivDigestPost`, `sage.db.async_session`.
- Produces: `async def post_digest(bot, date: str, papers: list[dict], demo_url: str | None = None, demo_arxiv_id: str | None = None) -> dict` returning `{"posted": [thread_id, ...], "failed": [{"arxiv_id", "error"}, ...]}`. Each paper dict has keys `title, arxiv_id, url, tldr, hot_take, why, question, tags`.

- [ ] **Step 1: Write the failing tests** (append to `tests/test_arxiv_forum.py`)

```python
async def test_post_digest_one_thread_per_paper_with_seeds():
    from sage.config import settings
    forum = FakeForum()
    bot = FakeBot(forum, settings.arxiv_forum_channel_id)
    result = await arxiv_forum.post_digest(bot, "2026-08-27", PAPERS)
    assert len(result["posted"]) == 3
    assert result["failed"] == []
    assert len(forum.created) == 3
    for c in forum.created:
        assert c["thread"]._message.added == ["👍", "👎"]
    assert "Why we picked it" in forum.created[0]["content"]


async def test_post_digest_caps_at_three():
    from sage.config import settings
    forum = FakeForum()
    bot = FakeBot(forum, settings.arxiv_forum_channel_id)
    extra = dict(PAPERS[0], arxiv_id="9999.99999")
    result = await arxiv_forum.post_digest(bot, "2026-08-27", PAPERS + [extra])
    assert len(result["posted"]) == 3


async def test_post_digest_demo_link_only_on_matching_paper():
    from sage.config import settings
    forum = FakeForum()
    bot = FakeBot(forum, settings.arxiv_forum_channel_id)
    await arxiv_forum.post_digest(
        bot, "2026-08-27", PAPERS,
        demo_url="https://share.djiang.xyz/x.html",
        demo_arxiv_id=PAPERS[1]["arxiv_id"],
    )
    bodies = [c["content"] for c in forum.created]
    assert sum("Playable demo" in b for b in bodies) == 1
    assert "Playable demo" in bodies[1]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py -k post_digest -v`
Expected: FAIL — `AttributeError: module 'sage.services.arxiv_forum' has no attribute 'post_digest'`.

- [ ] **Step 3: Implement `post_digest`** (replace the whole contents of `sage/services/arxiv_forum.py`)

```python
"""Post the nightly arxiv digest to the SharpLab discussion forum and tally the
up/down votes it collects, so the next night's selection can be biased by what
the server actually engaged with.

One Discord thread per paper (max 3/day), each seeded with 👍/👎. In a forum
channel the starter message's id equals the thread id, so votes are read back
by fetching message(thread_id) on the thread.
"""
from __future__ import annotations

import datetime
import json
import logging

from sqlalchemy import select

from sage.config import settings
from sage.db import ArxivDigestPost, async_session

log = logging.getLogger("sage")

UP, DOWN = "👍", "👎"


async def _resolve(bot, cid: int):
    ch = bot.get_channel(cid)
    if ch is None:
        ch = await bot.fetch_channel(cid)
    return ch


def _format_body(p: dict, demo_url: str | None) -> str:
    lines = [
        f"**TL;DR** {p['tldr']}",
        "",
        f"🎯 **Why we picked it:** {p['why']}",
        f"🔥 **Hot take:** {p['hot_take']}",
        "",
        f"💬 {p['question']}",
        "",
        f"📄 <{p['url']}>",
    ]
    if demo_url:
        lines.append(f"🕹️ **Playable demo:** {demo_url}")
    lines += ["", "_React 👍 / 👎 — your votes steer tomorrow's picks._"]
    return "\n".join(lines)


async def post_digest(bot, date: str, papers: list[dict],
                      demo_url: str | None = None,
                      demo_arxiv_id: str | None = None) -> dict:
    """Create one forum thread per paper (max 3), seed 👍/👎, store each row.

    Best-effort: one paper failing doesn't abort the rest.
    """
    forum = await _resolve(bot, settings.arxiv_forum_channel_id)
    posted, failed = [], []
    for p in papers[:3]:
        try:
            demo = demo_url if demo_arxiv_id and p.get("arxiv_id") == demo_arxiv_id else None
            twm = await forum.create_thread(name=p["title"][:100], content=_format_body(p, demo))
            try:
                await twm.message.add_reaction(UP)
                await twm.message.add_reaction(DOWN)
            except Exception:
                log.warning("arxiv_forum: seed reactions failed for %s", p.get("arxiv_id"))
            async with async_session() as s:
                s.add(ArxivDigestPost(
                    thread_id=twm.thread.id, arxiv_id=p.get("arxiv_id", ""),
                    date=date, title=p["title"], tags_json=json.dumps(p.get("tags", [])),
                ))
                await s.commit()
            posted.append(twm.thread.id)
        except Exception as e:
            log.exception("arxiv_forum: failed to post %s", p.get("arxiv_id"))
            failed.append({"arxiv_id": p.get("arxiv_id", ""), "error": str(e)})
    return {"posted": posted, "failed": failed}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py -k post_digest -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd /home/david/code/sage
git add sage/services/arxiv_forum.py tests/test_arxiv_forum.py
git commit -m "feat(arxiv-forum): post_digest — one voted thread per paper"
```

---

## Task 3: `tally_votes` helper (Sage)

**Files:**
- Modify: `/home/david/code/sage/sage/services/arxiv_forum.py`
- Test: `/home/david/code/sage/tests/test_arxiv_forum.py`

**Interfaces:**
- Produces: `async def tally_votes(bot, days: int = 7) -> dict` returning `{"tags": {tag: net_int}, "papers": [{"arxiv_id", "date", "tags", "up", "down"}]}`. `up`/`down` are seed-subtracted counts.

- [ ] **Step 1: Write the failing test** (append to `tests/test_arxiv_forum.py`)

```python
async def test_tally_votes_aggregates_per_tag_minus_seed():
    from sage.config import settings
    today = datetime.date.today().isoformat()
    forum = FakeForum()
    threads = {}
    bot = FakeBot(forum, settings.arxiv_forum_channel_id, threads)
    await arxiv_forum.post_digest(bot, today, PAPERS)
    # (up_raw, down_raw) INCLUDING the bot's own seed of 1 each.
    counts = [(5, 1), (2, 4), (10, 10)]   # net = u-d → 4, -2, 0
    for c, (u, d) in zip(forum.created, counts):
        c["thread"]._message.reactions = [FakeReaction("👍", u), FakeReaction("👎", d)]
        threads[c["thread"].id] = c["thread"]
    out = await arxiv_forum.tally_votes(bot, days=7)
    assert out["tags"]["poker"] == 2          # 4 + (-2) + 0
    assert len(out["papers"]) == 3
    assert any(p["up"] == 4 and p["down"] == 0 for p in out["papers"])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py -k tally -v`
Expected: FAIL — `AttributeError: ... has no attribute 'tally_votes'`.

- [ ] **Step 3: Implement `tally_votes`** (append to `sage/services/arxiv_forum.py`)

```python
async def _read_votes(bot, thread_id: int) -> tuple[int, int]:
    """(up, down) for a thread's starter message, minus the bot's own seed."""
    thread = await _resolve(bot, thread_id)
    msg = await thread.fetch_message(thread_id)   # forum: starter msg id == thread id
    up = down = 0
    for r in msg.reactions:
        if str(r.emoji) == UP:
            up = max(0, r.count - 1)
        elif str(r.emoji) == DOWN:
            down = max(0, r.count - 1)
    return up, down


async def tally_votes(bot, days: int = 7) -> dict:
    """Aggregate net votes (👍−👎) per tag across stored threads in the window."""
    cutoff = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    async with async_session() as s:
        rows = (await s.execute(
            select(ArxivDigestPost).where(ArxivDigestPost.date >= cutoff)
        )).scalars().all()
    tags: dict[str, int] = {}
    papers = []
    for r in rows:
        try:
            up, down = await _read_votes(bot, r.thread_id)
        except Exception:
            log.warning("arxiv_forum: could not read votes for thread %s", r.thread_id)
            continue
        net = up - down
        rtags = json.loads(r.tags_json or "[]")
        for t in rtags:
            tags[t] = tags.get(t, 0) + net
        papers.append({"arxiv_id": r.arxiv_id, "date": r.date,
                       "tags": rtags, "up": up, "down": down})
    return {"tags": tags, "papers": papers}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py -v`
Expected: PASS (all tests in file).

- [ ] **Step 5: Commit**

```bash
cd /home/david/code/sage
git add sage/services/arxiv_forum.py tests/test_arxiv_forum.py
git commit -m "feat(arxiv-forum): tally_votes — per-tag net vote aggregation"
```

---

## Task 4: Sage API endpoints

**Files:**
- Modify: `/home/david/code/sage/sage/api.py` (request models near `NotifyRequest` ~line 70; endpoints near `/notify` ~line 348)

**Interfaces:**
- Consumes: `post_digest`, `tally_votes` (Task 2/3); `_auth`, `SimpleResponse`, `get_bot`.
- Produces HTTP: `POST /arxiv-digest` (body `ArxivDigestRequest`) and `GET /arxiv-votes?days=7`.

- [ ] **Step 1: Confirm `json` is imported in api.py**

Run: `cd /home/david/code/sage && grep -n "^import json\|^import " sage/api.py | head`
If `import json` is absent, add it with the other stdlib imports at the top.

- [ ] **Step 2: Add request models** (in `sage/api.py`, right after the `NotifyRequest` class)

```python
class DigestPaper(BaseModel):
    title: str
    arxiv_id: str = ""
    url: str
    tldr: str = ""
    hot_take: str = ""
    why: str = ""
    question: str = ""
    tags: list[str] = []


class ArxivDigestRequest(BaseModel):
    date: str
    papers: list[DigestPaper]
    demo_url: str | None = None
    demo_arxiv_id: str | None = None
```

- [ ] **Step 3: Add the endpoints** (in `sage/api.py`, immediately after the `notify` function at ~line 380)

```python
@app.post("/arxiv-digest", response_model=SimpleResponse)
async def arxiv_digest(req: ArxivDigestRequest, _: None = Depends(_auth)) -> SimpleResponse:
    """Post the nightly arxiv digest to the SharpLab forum, one thread per paper."""
    from sage.services.arxiv_forum import post_digest
    from sage.services.bot_ref import get_bot

    bot = get_bot()
    if bot is None:
        raise HTTPException(503, "Bot not ready")
    result = await post_digest(
        bot, req.date, [p.model_dump() for p in req.papers],
        demo_url=req.demo_url, demo_arxiv_id=req.demo_arxiv_id,
    )
    if not result["posted"] and result["failed"]:
        raise HTTPException(503, f"All papers failed to post: {result['failed']}")
    return SimpleResponse(response=json.dumps(result))


@app.get("/arxiv-votes")
async def arxiv_votes(days: int = 7, _: None = Depends(_auth)) -> dict:
    """Per-tag net vote tally over the trailing `days` of digest threads."""
    from sage.services.arxiv_forum import tally_votes
    from sage.services.bot_ref import get_bot

    bot = get_bot()
    if bot is None:
        raise HTTPException(503, "Bot not ready")
    return await tally_votes(bot, days=days)
```

- [ ] **Step 4: Verify the module imports cleanly**

Run: `cd /home/david/code/sage && python -c "import sage.api"`
Expected: no output, exit 0 (no syntax/import errors).

- [ ] **Step 5: Run the full arxiv-forum test file (regression check)**

Run: `cd /home/david/code/sage && python -m pytest tests/test_arxiv_forum.py -v`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd /home/david/code/sage
git add sage/api.py
git commit -m "feat(arxiv-forum): POST /arxiv-digest + GET /arxiv-votes endpoints"
```

---

## Task 5: Digest validator (arxiv-scrape)

**Files:**
- Create: `/home/david/code/arxiv-scrape/validate_digest.py`

**Interfaces:**
- Produces: `validate(payload: dict) -> list[str]` (empty = valid). CLI: `python3 validate_digest.py <digest.json>` exits 0/1; `--demo` runs a self-check.

- [ ] **Step 1: Write the validator with an embedded self-check**

Create `/home/david/code/arxiv-scrape/validate_digest.py`:

```python
#!/usr/bin/env python3
"""Validate a nightly forum digest payload before Sage posts it.

Usage:  python3 validate_digest.py digest_YYYY-MM-DD.json
        python3 validate_digest.py --demo
Exit 0 if valid (<=3 papers, all required fields), non-zero otherwise.
Unknown tags are a warning, not an error.
"""
import json
import sys

KNOWN_TAGS = {
    "betting", "poker", "sports", "games", "gambling", "decision-theory",
    "ai", "math", "bio", "physics", "econ", "whimsy",
}
REQUIRED = {"title", "arxiv_id", "url", "tldr", "hot_take", "why", "question", "tags"}


def validate(payload: dict) -> list[str]:
    """Return a list of error strings; empty means valid."""
    papers = payload.get("papers")
    if not isinstance(papers, list):
        return ["'papers' must be a list"]
    errs = []
    if len(papers) > 3:
        errs.append(f"max 3 papers, got {len(papers)}")
    for i, p in enumerate(papers):
        missing = REQUIRED - set(p)
        if missing:
            errs.append(f"paper {i}: missing fields {sorted(missing)}")
            continue
        if not isinstance(p["tags"], list) or not p["tags"]:
            errs.append(f"paper {i}: 'tags' must be a non-empty list")
        for t in set(p.get("tags", [])) - KNOWN_TAGS:
            print(f"warning: paper {i}: unknown tag {t!r}", file=sys.stderr)
    return errs


def demo():
    ok = {"papers": [{"title": "T", "arxiv_id": "1", "url": "u", "tldr": "t",
                      "hot_take": "h", "why": "w", "question": "q", "tags": ["poker"]}]}
    assert validate(ok) == [], validate(ok)
    assert validate({"papers": [{}]}), "empty paper should error"
    assert validate({"papers": [ok["papers"][0]] * 4}), "4 papers should error"
    assert validate({"papers": "x"}) == ["'papers' must be a list"]
    print("validate_digest self-check OK")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--demo":
        demo()
        sys.exit(0)
    if len(sys.argv) != 2:
        print("usage: validate_digest.py <digest.json> | --demo", file=sys.stderr)
        sys.exit(2)
    with open(sys.argv[1]) as f:
        payload = json.load(f)
    errs = validate(payload)
    if errs:
        for e in errs:
            print(f"INVALID: {e}", file=sys.stderr)
        sys.exit(1)
    print(f"OK: {len(payload['papers'])} paper(s)")
```

- [ ] **Step 2: Run the self-check to verify it passes**

Run: `cd /home/david/code/arxiv-scrape && python3 validate_digest.py --demo`
Expected: prints `validate_digest self-check OK`, exit 0.

- [ ] **Step 3: Commit**

```bash
cd /home/david/code/arxiv-scrape
git add validate_digest.py
git commit -m "feat(arxiv-forum): digest payload validator"
```

*(This plan and spec were committed on branch `sharplab-arxiv-forum` in Task 0; stay on it.)*

---

## Task 6: nightly.sh wiring (arxiv-scrape)

**Files:**
- Modify: `/home/david/code/arxiv-scrape/nightly.sh`

**Interfaces:**
- Consumes: Sage `GET /arxiv-votes` (→ `votes.json`), `POST /arxiv-digest` (from `digest_<date>.json`), `validate_digest.py`.

- [ ] **Step 1: Replace nightly.sh with the wired version**

Overwrite `/home/david/code/arxiv-scrape/nightly.sh` with:

```bash
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
```

- [ ] **Step 2: Syntax-check the script**

Run: `cd /home/david/code/arxiv-scrape && bash -n nightly.sh && echo "syntax ok"`
Expected: prints `syntax ok`.

- [ ] **Step 3: Verify validator gate rejects a bad digest (dry check of the gate)**

Run: `cd /home/david/code/arxiv-scrape && echo '{"papers":[{}]}' > /tmp/bad_digest.json && python3 validate_digest.py /tmp/bad_digest.json; echo "exit=$?"`
Expected: prints an `INVALID:` line and `exit=1` (confirms the gate blocks malformed digests before any POST).

- [ ] **Step 4: Commit**

```bash
cd /home/david/code/arxiv-scrape
git add nightly.sh
git commit -m "feat(arxiv-forum): nightly.sh fetches votes, posts forum digest, notify only on failure"
```

---

## Task 7: nightly.md selection rewrite (arxiv-scrape)

**Files:**
- Modify: `/home/david/code/arxiv-scrape/nightly.md`

**Interfaces:**
- Produces (for `nightly.sh`): `digest_<date>.json` with shape `{"date", "papers": [<=3 records], "demo_url"?, "demo_arxiv_id"?}` where each record has `title, arxiv_id, url, tldr, hot_take, why, question, tags`.

- [ ] **Step 1: Add the vote-bias note to the Ideate step**

Edit `nightly.md`. Replace the end of step 2 (the sentence `Reuse the pattern from the earlier ideation runs (see \`ideation_run2.md\`). ~6 batches is plenty.`) with:

```
   Reuse the pattern from the earlier ideation runs (see `ideation_run2.md`). ~6 batches is plenty.
   ALSO score each idea on a **discussion axis** (how much it would spark debate on a betting/poker/
   sports/games Discord): blend (i) debate/relatability, (ii) SharpLab-fit (betting, poker, sports,
   games, gambling, decision-theory), (iii) surprise (counterintuitive "wait, really?"), and
   (iv) whimsy (weird-and-delightful). Read `votes.json` (written by nightly.sh from last week's
   forum votes): up-weight ideas whose tags have a net-positive score in `votes.tags` and down-weight
   net-negative ones. This is a soft bias — a killer paper in an unpopular tag can still make it.
```

- [ ] **Step 2: Add a new step 3.5 that emits the digest** (insert immediately after step 3, before step 4 "BUILD")

```
3.5 **Pick the forum top-3 & write `digest_<date>.json`.** Independently of the demo picks, choose the
   **top 3 by discussion score** (max 3, fewer is fine). Write `digest_<date>.json` (`<date>` = `date +%F`)
   with this exact shape — `nightly.sh` validates it (`validate_digest.py`) and posts it to the SharpLab
   forum via Sage, one thread per paper, each seeded with 👍/👎:
   ```json
   {
     "date": "<date>",
     "papers": [
       {
         "title": "…", "arxiv_id": "2608.11994", "url": "https://arxiv.org/abs/2608.11994",
         "tldr": "1–2 sentences, plain English, no jargon.",
         "hot_take": "One spicy provocative line.",
         "why": "Why THIS got picked — name the axis it won on (e.g. 'pure poker-EV catnip, you'll all disagree on sizing').",
         "question": "An explicit open question to the server.",
         "tags": ["poker", "decision-theory"]
       }
     ],
     "demo_url": "https://share.djiang.xyz/arxiv-scrape/demos/<date>-<slug>.html",
     "demo_arxiv_id": "<arxiv id of the paper the demo was built from, if it is one of the 3>"
   }
   ```
   Use ONLY these tags: betting, poker, sports, games, gambling, decision-theory, ai, math, bio,
   physics, econ, whimsy. Set `demo_url`/`demo_arxiv_id` only if tonight's built demo corresponds to one
   of the 3 forum papers; otherwise omit them (the demo still publishes to share.djiang.xyz regardless).
```

- [ ] **Step 3: Replace the old optional-digest step 7**

Replace step 7 (`7. **Digest (optional):** if Sage's Discord notify is reachable, post a one-line digest with the demo link.`) with:

```
7. **Forum digest:** the digest is posted deterministically by `nightly.sh` from `digest_<date>.json`
   (created in step 3.5) — you do NOT post to Discord yourself. Just make sure `digest_<date>.json`
   exists and is well-formed before the run ends; if you skip it, David gets a private fallback ping instead.
```

- [ ] **Step 4: Sanity-check the file still reads coherently**

Run: `cd /home/david/code/arxiv-scrape && grep -n "digest_<date>.json\|discussion axis\|votes.json\|forum top-3" nightly.md`
Expected: matches in steps 2, 3.5, and 7 (confirms all three edits landed).

- [ ] **Step 5: Commit**

```bash
cd /home/david/code/arxiv-scrape
git add nightly.md
git commit -m "feat(arxiv-forum): select forum top-3 by discussion score, emit digest json"
```

---

## Deploy (manual, after all tasks pass)

Sage is deployed manually (per `~/code/CLAUDE.md`). After merging the Sage branch:

1. `ssh vps`, `git -C /opt/sage pull` (or the repo's deploy path), `pip install -e .` if needed.
2. Smoke-test: `python -c "import sage.api"` on the VPS.
3. `systemctl restart sage` (or the Sage unit name).
4. Verify the endpoint is live: from the desktop,
   `cat ~/.config/sage/console.key | ssh vps 'read -r K; curl -sfS -H "Authorization: Bearer $K" "http://localhost:7779/arxiv-votes?days=7"'`
   → expect `{"tags":{},"papers":[]}` on first run.
5. arxiv-scrape needs no deploy (it runs from the desktop via the timer); its next nightly run picks up the new `nightly.sh`/`nightly.md`/`validate_digest.py`.
6. **First live run:** eyeball the first forum post; confirm the thread posts, 👍/👎 seed appears, and the next night `votes.json` is non-empty.

## Self-review notes

- **Spec coverage:** selection axes + vote bias (Task 7), voting storage/tally (Task 1/3), posting one-thread-per-paper with seeds (Task 2/4), replace-with-forum-but-keep-failure-notify (Task 6), demo link only on matching paper (Task 2), tags vocab (Tasks 5/7). All covered.
- **Type consistency:** `post_digest`/`tally_votes` signatures identical across Tasks 2–4; paper dict keys identical across validator, poster, and nightly.md schema.
- The first Sage forum post can't be unit-tested against the live guild — the Deploy section's step 6 is the real end-to-end check.
