# SharpLab arxiv discussion forum — design

**Date:** 2026-08-27
**Repos touched:** `arxiv-scrape` (selection + nightly wiring), `sage` (forum posting, vote storage, endpoints)

## Goal

Each night, Sage posts up to **3 discussion-worthy papers** as individual forum
threads in the SharpLab server (guild `1477512815580545197`, forum channel
`1542405543279460383`), each seeded with 👍/👎 reactions so the crowd votes.
Those votes bias the *next* night's paper selection. The forum post **replaces**
the private success digest David currently gets via Sage `/notify`; failure
alerts still go to him privately.

Sage is already a member of the SharpLab guild (`banter_guild_id` in
`sage/config.py` is this exact guild), so it can post directly — no new bot.

## Non-goals

- The nightly demo build/publish pipeline (share.djiang.xyz) is **unchanged**.
  The demo is no longer the forum's focus; its link rides along only when the
  built demo's paper is one of the 3 posted.
- No web UI, no external vote store — votes live as Discord reactions.
- No per-user vote weighting; a vote is a vote.

## Components

### 1. Selection change — arxiv-scrape (`nightly.md`, prompt-level)

Selection of the **forum top-3** is decoupled from the demo-build pick. The
ideation step scores each candidate paper on a **discussion score** blending
four axes (all chosen by David):

- **debate/relatability** — opinion-provoking, "everyone has a take"
- **sharplab-fit** — betting / poker / sports / games / gambling / decision theory
- **surprise** — counterintuitive, "wait, really?"
- **whimsy** — weird-and-delightful (brain-in-a-dish energy)

Pick the **top 3** by discussion score. `max_papers = 3` is a hard cap. Fewer
than 3 is fine on a thin day; never more.

Each pick emits a structured record:

```json
{
  "title": "…",
  "arxiv_id": "2608.11994",
  "url": "https://arxiv.org/abs/2608.11994",
  "tldr": "1–2 sentences, plain English, no jargon.",
  "hot_take": "One spicy provocative line.",
  "why": "Why THIS got picked — names the axis it won on (e.g. 'pure poker-EV catnip, you'll all disagree on sizing').",
  "question": "An explicit open question to the server.",
  "tags": ["poker", "decision-theory"]
}
```

`tags` come from a small controlled vocabulary so vote tallies aggregate
cleanly: `betting, poker, sports, games, gambling, decision-theory, ai, math,
bio, physics, econ, whimsy`. (Add to the list as needed; unknown tags are
tolerated but won't get historical vote signal.)

### 2. Voting feedback loop

- Sage seeds 👍 and 👎 on each paper thread's starter message.
- Sage records `thread_id → {arxiv_id, date, tags}` in a new SQLite table.
- `GET /arxiv-votes?days=7` walks the stored threads in the window, fetches each
  starter message's 👍/👎 counts (subtracting the bot's own seed reaction), and
  returns net score **per tag** plus per-paper rows:

  ```json
  {
    "tags": {"poker": 7, "bio": -3, "whimsy": 5},
    "papers": [{"arxiv_id": "...", "date": "...", "tags": ["poker"], "up": 8, "down": 1}]
  }
  ```

- `nightly.sh` fetches this into `votes.json` before the model runs; the
  selection prompt reads it and **up-weights tags with net-positive votes,
  down-weights net-negative** when scoring candidates. This is a soft bias, not
  a hard filter — a strong paper in an unpopular tag can still make it.

### 3. Posting mechanics — Sage

- New config: `arxiv_forum_channel_id: int = 1542405543279460383`.
- New endpoint `POST /arxiv-digest` (bearer auth, mirrors `/notify`). Body:

  ```json
  { "date": "2026-08-27", "papers": [ <paper record>, … ], "demo_url": "…?" }
  ```

- For each paper: create its **own** forum thread via
  `forum_channel.create_thread(name=<title, trimmed>, content=<formatted body>)`,
  then `add_reaction("👍")` / `add_reaction("👎")` on the starter message, then
  insert the `arxiv_digest_posts` row.
- Thread body (markdown): TL;DR, **why we picked it**, hot-take, the discussion
  question, and the arxiv link. `demo_url` appended only to the thread whose
  `arxiv_id` matches the built demo.
- **One thread per paper, up to 3/day** (design branch A, confirmed).

### 4. nightly.sh wiring

- On **success**: POST the assembled `{date, papers, demo_url}` to
  `http://localhost:7779/arxiv-digest` over the existing `ssh vps → curl` path.
  Drop the private success `/notify`.
- On **failure** (guardrail trips): keep the private `/notify` warn ping so
  David isn't blind to stalls.
- Before the model runs: `curl … /arxiv-votes?days=7 > votes.json` so selection
  can read last week's signal. A failed/empty fetch degrades to no-bias.

## Data model (Sage)

```python
class ArxivDigestPost(Base):
    __tablename__ = "arxiv_digest_posts"
    thread_id: Mapped[int] = mapped_column(primary_key=True)   # Discord thread id
    arxiv_id:  Mapped[str]
    date:      Mapped[str]            # ISO date of the run
    title:     Mapped[str]
    tags_json: Mapped[str]            # JSON array of tag strings
    created_at:Mapped[datetime]
```

Auto-created on startup via `Base.metadata.create_all` (no migration).

## Error handling

- Forum channel unreachable → 503 from `/arxiv-digest`; nightly.sh logs the
  failure and falls back to a private `/notify` warn so the run isn't silent.
- A single paper failing to post doesn't abort the others (post best-effort,
  collect failures, return them in the response).
- `/arxiv-votes` failing or returning nothing → nightly proceeds with no vote
  bias (never blocks selection).
- Reaction-seed failure is non-fatal: the thread still posts; that paper just
  lacks seed reactions (votes still countable, tally handles missing seed).

## Testing

- **Sage**: unit test `/arxiv-digest` with a fake bot (thread creation +
  reaction calls mocked) asserting one thread per paper, correct body, row
  inserted. Unit test `/arxiv-votes` tally math (seed subtraction, per-tag
  aggregation) against a stubbed reaction set.
- **arxiv-scrape**: a small self-check that the selection step emits ≤3
  well-formed paper records with all required fields and known tags.

## Open follow-ups (not in this build)

- Per-user or weighted voting if raw counts get gamed.
- A `/arxiv-digest now` style manual re-post command if needed.
