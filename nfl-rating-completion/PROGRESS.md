# Progress Log

Newest first. See `CLAUDE.md` for the project handoff.

## 2026-07-13 — "Is our model bad?" answered: NO. Better model still can't beat the close 🎯

Built a genuinely better model — Elo-on-EPA-margin (`phase2/epa_data.py` -> game_net; `phase2/epa_ratings.py`),
EPA->points fit on 2011-2014 only, tested 2015-2024:

  BEAT-THE-CLOSE 2015-2024:  EPA model 48.0% (p=1.0) | Elo 50.8% (p=0.9)  -> BOTH dead, EPA no better.
  OPEN vs CLOSE 2020-2024:   corr(EPA edge, line move) = +0.600 (> Elo's 0.515 -> MORE signal)
                             bet at OPEN 55.6% (p=.027) | bet at CLOSE 47.9% (p=1.0)

**Verdict: it's the MARKET, not the model.** The better model has MORE signal (higher corr with line
movement, beats the opener a bit better) yet is NO better — slightly worse — against the close. Reason:
EPA is THE dominant public power-rating signal, so the closing line has fully absorbed it. A better
power rating just means you agree with the close more; your disagreements become more likely to be YOU
being wrong. Improving the model only helps in the capacity-limited opener/CLV game.

**Strategic conclusion (NFL sides thread = DONE):** you cannot beat NFL closing lines with a better
power rating — structurally impossible, now proven three ways (Elo 24-seasons, EPA, completion). The
reusable pipeline + harness should pivot to a market where MODELING beats the PRICE: **player props**
(thinner, less efficiently priced, books can't sharpen thousands of them). This is exactly where the
ideation runs pointed — NBA competing-risks player availability (2607.09431) is the natural next target.

## 2026-07-13 — Phase 2: the OPENER is soft (real CLV signal), but not a robust money edge 🟡

Pulled line-movement trajectories (`pull_odds_movement.py`, 1570 snapshots, 2020-2024, opener->close,
spreads+totals, ~28k credits). Parsed to per-game open/close (`phase2/trajectories.py`, 1343 games,
close vs games.csv corr 0.998). CLV test (`phase2/clv.py`), Elo walk-forward:

- **corr(Elo edge at OPEN, line move to close) = +0.515, p~1e-91.** The close moves ~0.5 pt toward
  Elo's view per pt of disagreement. Betting Elo's side at the open: +68% positive CLV (edge>=1), overwhelmingly sig.
- **Elo ATS vs RESULT: 55.4% at the OPEN vs 49.2% at the CLOSE.** The close is efficient (dead, as
  established); the OPENER is soft.

**But the pressure-test kills the profit claim:** bet-at-open vs result is only p=0.042, and NOT stable:
2020 55.8% / 2021 44.1% / 2022 52.7% / 2023 57.1% / 2024 65.1% — one losing season, propped up by 2024.
**And early-season (wk 1-6) at open = 49.7% — nothing** (the window David cared about shows no edge).

**Honest synthesis:** the real, robust fact is that opening lines are inefficient relative to a power
rating (strong +CLV — this is a known market-microstructure truth, and it vindicates the "early info
isn't priced yet" intuition). But converting it to profit is (a) marginal/unstable on 5 seasons,
(b) absent in early-season specifically, (c) harvestable only by betting OPENERS = low limits + fast
book-limiting. CLV says "the model has signal"; the money test says "too small/noisy to trust on 5 yrs."
Net: a genuine sharp-betting-the-opener signal, small and capacity-limited — not a scalable edge.

## 2026-07-13 — Follow-up: by-week + intra-week both null (`byweek.py`, `intraweek.py`)

Tested two sharper hypotheses:
- **Edge in a specific early week (2/3)?** No. Per-week 2001-2024: wk1 51.5%, wk2 53.8% (p=.35), wk3
  52.3% (p=.54), wk4 48.4%, weeks 2-3 pooled 53.1% (p=.40). Week 5 blips to 55.6% but that's 1 of 16
  tests — multiple-comparisons noise, no mechanism. Nothing significant.
- **Intra-week sequencing** (use Thu + early-Sun results to price late-Sun/Mon games)? No. NOTE the
  harness ALREADY does this — `run_backtest` predicts-then-updates per game in kickoff order, so Elo's
  Monday prediction already ingested that week's earlier results. Direct test: weeks 2-4 LATE slot (most
  same-week info) covers 50.9% vs EARLY slot 52.3% — more info => NOT better.

**Principle:** you can't beat a price with information already baked into that price. The CLOSING line
already incorporates every game that finished before kickoff, so a model using "earlier same-week
results" is using info the close has. The only version that could work is a **CLV / line-movement play**
— bet the later game EARLY (before those results land and move the line), predicting the move. That's a
different, harder strategy and needs OPENING + intraday line data we don't have (snapshots are near-close;
key rotated). Not chaseable without that data + a reason to expect books misprice the move.

## 2026-07-13 — FINAL VERDICT: no significant early-season edge. Project thesis dead. 🪦

Rigorous validation (`phase1/validate.py`), 24 seasons (2001-2024), ATS vs the CLOSING line:

  Elo   EARLY wk1-6:  52.5% cover, 95% CI [49.9%, 55.0%], p=0.49 vs 52.4% breakeven, ROI +0.2%
        PLACEBO wk10+: 50.0%  <- efficient, confirms harness is sound (no leak)
        stability: 13/24 seasons above breakeven (sign-test p=0.42 — coin flip)
  QB-completion EARLY: 51.6%, p=0.74 (also nothing)

**The +4% ROI / 54.5% cover from the 2015-2024 slice was OVERFITTING to a favorable recent window.**
Over the full 24 seasons the early-season edge is statistically indistinguishable from breakeven. The
NFL closing line is efficient, even early season, once you test on enough data. The placebo (late-season
= 50.0%) proves this is a real null, not a harness bug.

**Bottom line:** the whole chain is answered — graph regularization doesn't help (falsified), completion
doesn't beat Elo (tie), and the early-season inefficiency it was all meant to exploit **does not exist at
significance.** Per the project's definition of done ("beat the close on CLV or kill it") — KILL IT.

**What survives (genuinely valuable):** a rigorous, reusable backtest+validation harness *with a working
placebo test* that correctly caught a mirage before any real money — plus the full data pipeline. This
infra evaluates the NEXT betting idea in an afternoon. That's the ROI of this session.

Caveat / only escape hatch: we tested ATS-vs-CLOSE, not true open->close CLV (no opener data; key
rotated). A tiny CLV edge (beating the OPEN, not the result) could still exist and is a different, softer
claim — but it needs opening-line data we don't have. Not worth chasing without a reason to expect it.

## 2026-07-13 — QB-continuity experiment: GRAPH IS DEAD, QB-aware completion ~= Elo 🔴

Added QB-change detection (`build_qb_changes`: week-1 starter vs last season's primary, no leak; ~11
teams/season flagged) and downweighted the prior anchor for changed teams so the graph could pull them
toward division neighbors. Decisive result (2016-2024, ATS vs close):

  QB-CHANGED teams, wk 1-6:   Elo 56.9% | completion+graph 55.9% | completion NO-graph 57.3%
  ALL teams, wk 1-6:          Elo 54.1% | completion+graph 54.6% | completion NO-graph 55.9%

**Verdict on the core hypothesis: FALSIFIED.** The division-graph Laplacian *subtracts* ~1.4 pts of
cover in EVERY slice. Graph regularization — the whole point of GR-RTRMC — does not help NFL
early-season ratings. (Consistent with Phase-0's mis-specification caveat + the deep-dive's #1 risk.)

**Silver lining, unproven:** the QB-aware NO-graph completion is the best model (55.9% early / 57.3% on
changed teams). But significance check: 55.9% on 596 decisions = ~1.7σ above the 52.4% breakeven
(marginal), and its edge OVER Elo is within 1 SE — **not statistically distinguishable from Elo.** So
the honest statement is "a QB-aware low-rank completion is competitive with Elo, and the graph hurts."

**Decision gate (for the human):** the project's headline bet (graph regularization) is dead. Options:
  (a) Validate rigorously whether ANY early-season model beats the close out-of-sample with proper
      significance + TRUE CLV (bet-at-open vs close, using data/raw/odds/historical/) — the model-agnostic
      edge question. This is the honest next step if we want to bet real money.
  (b) Ship Elo (or the QB-aware completion) as the early-season baseline; redirect build effort.
  (c) Pivot to a higher-signal idea from the runs (leak-detector to harden the harness; NBA
      competing-risks player availability; a Polymarket angle).
Cost to reach this kill: one session. Exactly what the cheap-falsification plan was for.

## 2026-07-13 — Phase 1 first result: completion TIES Elo, division graph adds ~nothing ⚠️

Built the real completion model (`phase1/completion.py`) + benchmark (`phase1/benchmark.py`). Per-week
refit (no intra-week leak), prior-season anchor (low confidence) blended with current-season neutral
margins (full confidence), division-graph smoothing, reads completed [home,away]+HFA as the pick.

Early season (wk 1-6, 2016-2024, ATS vs close):
  Elo                   54.1% cover, +3.27% ROI
  Completion (graph)    54.2% cover, +3.44% ROI   <- statistically tied with Elo
  Completion (no graph) 54.1% cover, +3.20% ROI   <- graph adds nothing
All weeks: completion ~52.4% vs Elo 50.1% (completion a bit better late), but MAE worse (10.9 vs 10.2).

**Diagnosis (the key insight):** the prior-season anchor fills the WHOLE matrix at low confidence, so
there are no holes for the graph to fill — prior and graph are substitutes. Confirms the deep-dive's
#1 risk ("ridge/prior already does 80%"). The division graph is also the weakest planned edge (teams
in a division aren't that strength-similar).

**Decision gate.** The graph can only beat the prior where the prior is WRONG — i.e. teams that
changed a lot (new QB, scheme). Next experiment: **QB-continuity graph** — when `home_qb_id`/`away_qb_id`
changed vs last season, cut that team's prior self-confidence and let division/roster-similar neighbors
inform it. If the graph doesn't beat no-graph THERE, the honest call is "completion ≈ Elo, ship Elo."
games.csv has the QB ids to detect changes; this is a ~half-day test.

## 2026-07-13 — Phase 0 PASSED (`phase0/toy.py`) ✅

Tested the core hypothesis on synthetic data (team×team low-rank margin matrix, community-clustered =
smooth over a "division" graph, sparse observations) BEFORE building the real pipeline. numpy Adam GD,
graph term OFF vs ON, held-out RMSE, 6 seeds. Result — **correctly-specified graph prior is a large,
consistent win** across the sparse regime:

    missing%   graph-OFF  graph-ON   improvement
      80%        1.089     0.304      +72.1%
      88%        0.924     0.441      +52.3%
      92%        1.028     0.633      +38.4%
      95%        1.049     0.744      +29.0%

**Key second finding (this shaped the plan):** a FIRST attempt with a *mis-specified* graph (Laplacian
prior on a factor that wasn't actually smooth over it) flipped the win to a LOSS at high sparsity
(−19% @ 95%). So graph construction is genuinely load-bearing — the paper's red-team warning,
reproduced empirically. **Phase 1 must validate each edge type on held-out games, not assume it helps.**
Relative gain peaks mid-range (not at the extreme) because absolute recoverable signal shrinks with
sparsity — expected, and now encoded in the go/no-go asserts.

Decision: **GO to Phase 1.** Premise is real; the risk is graph quality, which is testable.

## 2026-07-13 — Backtest harness (`backtest/`)

Built the walk-forward evaluation scaffold. Any rating model subclasses `Model` (predict-then-update,
no future leak) and is graded on the SAME harness: predictive MAE + ATS-vs-closing-line record + ROI
at -110. **This head-to-head is the project's go/no-go** — GR-RTRMC lands as another `Model` and must
beat these baselines on the early-season slice.

- `backtest/harness.py` — data load, ATS grading (money path), walk-forward engine, metrics.
- `backtest/models.py` — `Elo` (MOV + season carryover), `MarketBaseline` (predicts the line = sanity
  floor), `HomeBias`. GR-RTRMC goes here next.
- `backtest/run.py` — `python -m backtest.run --model elo --seasons 2015-2024 --threshold 1.5 [--early-only] [--by-season]`
- `backtest/test_harness.py` — assert-based self-checks (all pass): ATS grading, spread-sign sanity,
  no-leak, sane MAE.

**Headline finding (validates the whole thesis):** plain Elo, 2015–2024, ATS vs close:
- ALL weeks → 50.8% cover, −2.97% ROI (can't beat the close overall — expected).
- **WEEKS 1–6 → 54.5% cover, +4.07% ROI, +23.5u — ABOVE the 52.4% breakeven.**
The early-season market inefficiency the project bets on shows up even in a dumb baseline. GR-RTRMC's
job is to widen that early-season edge. (587 bets — real signal, modest sample; don't over-trust the exact %.)

TODO on the harness: add a true-CLV mode (bet at opener from `data/raw/odds/historical/`, grade vs
close) once PBP→EPA + the model exist.

**Follow-on worth doing:** run-2 ideation's #1 pick (arXiv 2607.04958, look-ahead-freedom as temporal
non-interference) is a static "your edge isn't fake" leak certifier — directly applicable to THIS
backtest. Cheap V1: stamp each feature column with an availability time and assert `effect ⊑ decision
epoch` at the bet gate (esp. the RAPM/Elo "as-of week N computed from full-season matrix" trap). See
deep dive: share.djiang.xyz/arxiv-scrape/2026-07-13-deep-dives-run2.html (#1).

## 2026-07-13 — Data collection (overnight)

Over-collected raw data into `data/raw/` (gitignored, ~370MB). Strategy per David: grab extra now,
figure out what's useful later. **The Odds API key was used this night and David rotates it after —
do not expect `ODDS_API_KEY` to work in future sessions; re-pull needs a fresh key.**

### What's collected

**nflverse** (`data/raw/nflverse/`, ~326MB, free — pulled via `pull_nflverse.py`):
- `games.csv` — **the centerpiece.** 7,548 games 1999–2026. Has results/margins, **closing** spread/
  total/moneyline (100% coverage on historical seasons), rest days, div flags, roof/surface/temp/wind,
  **QB ids+names** and **coaches** (→ QB-continuity + coaching graph edges). 2026: 272 games scheduled,
  77 with opening spreads already.
- `pbp/play_by_play_{2010..2025}.parquet` — 16 seasons play-by-play w/ EPA (~300MB). For team-game
  EPA aggregates (offensive/defensive fingerprints → EPA-kNN graph edges).
- `rosters/roster_weekly_{y}.parquet`, `snaps/snap_counts_{y}.parquet` (2012+), `depth_charts/` —
  for returning-snap-overlap continuity edges.
- `teams.csv`, `rosters_season.csv`.

**The Odds API** (`data/raw/odds/`):
- `current/` — live 2026 pull (`pull_odds.py`): NFL game lines (75 events, multi-book), preseason,
  Super Bowl futures, NCAAF lines+futures, NBA futures, WNBA. Plus `_all_sports.json`.
- `historical/` — closing-ish multi-book snapshots for 2022–2024, one JSON per unique kickoff
  (`pull_odds_historical.py`, ~20 credits each). **Done: 406 snapshots, 112MB** (2022–2024). Adds
  opener→closer movement + multi-book granularity that games.csv's single closing line lacks.
  Used ~12k credits; 62k remained on the (now-rotated) key.

**Polymarket** (`data/raw/polymarket/`, free — `pull_polymarket.py`):
- `nfl_events.json` — 77 NFL events / 675 markets via gamma `tag_slug=nfl`: division champions,
  AFC/NFC + NFL champion futures, undefeated-season, Week-1 QB starters, trade props. The Polymarket
  application target.

### Not yet done (next steps)

1. **Confirm the historical odds crawl finished** (background task; started 2022–2024). Extend to more
   seasons if useful — but note the key rotation.
2. **Aggregate PBP → team-game EPA** (offensive/defensive EPA/play per team per game). This is the
   main derived table feeding both ratings and the EPA-kNN graph.
3. **Build the M matrix + masks** from games.csv (team×team margin, Ω = games played, per-week).
4. **Build the prior graph / Laplacians**: QB-continuity + roster-continuity (returning snaps) +
   division + EPA-kNN + coaching. Start with QB + division + continuity (highest signal).
5. **Phase 0 toy harness** (`phase0/`) — GR-RTRMC in Pymanopt on synthetic low-rank + graph data;
   confirm graph term beats no-graph at >90% sparsity. Gates the whole project. `pip install pymanopt`.

### Gotchas / notes
- `nfl_data_py` fails to build on Python 3.13 → we pull nflverse parquet/CSV **directly** from
  releases instead. Keep it that way.
- Polymarket gamma blocks default urllib UA (needs `User-Agent: Mozilla/5.0`) and caps `offset` ~2000
  on `/markets` — use the `/events?tag_slug=nfl` endpoint instead.
- pandas 3.0.3 + pyarrow installed in the mise Python 3.13 env.
