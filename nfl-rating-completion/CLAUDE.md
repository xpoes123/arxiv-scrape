# NFL Rating Completion — Session Handoff

Graph-regularized low-rank matrix completion for **early-season power ratings**, NFL first.
This file is the handoff for any new Claude session. Read it, then check `PROGRESS.md` (if it
exists) for where the last session left off.

## What this is (one paragraph)

Every power-rating model is worst in Week 1: the team-vs-team results matrix is ~97% empty and
you're forced onto priors everyone else has too. This project fills that sparse matrix using
**GR-RTRMC** (arXiv:2607.09546) — low-rank completion with a **graph-Laplacian prior** that
soft-ties the ratings of *similar* teams (division, roster/QB continuity, prior-season profile,
coaching tree) so sparse data on one team informs the others. The bet: in the first ~6 NFL weeks,
before the market has data either, a principled neighbor-prior beats the ad-hoc "regress ⅓ to the
mean" every public model uses. Prove it on CLV, or kill it.

## Source material

- **Paper:** *Graph-Regularized Low-Rank Matrix Completion by Variable Projection* — Loucheur,
  Absil, Journée, arXiv:2607.09546. https://arxiv.org/abs/2607.09546
- **Full project writeup** (status quo, NFL rationale, betting application, risks):
  https://share.djiang.xyz/arxiv-scrape/2026-07-13-nfl-rating-completion.html
- **Deep-dive** (technical breakdown of the method + prereqs):
  https://share.djiang.xyz/arxiv-scrape/2026-07-13-deep-dives.html  (section "#2")

## The method in one screen

Minimize over factors `U` (m×r), `W` (r×n):
```
h(U,W) = ½‖C ⊙ (UW − M)‖²_Ω     fit games actually played  (C = confidence weights)
       + (λ²/2)‖UW‖²_Ω̄          shrink predictions where there's no data
       + (λu/2)·Tr(Uᵀ Lu U)     row-graph smoothness  (team similarity)
       + (λw/2)·Tr(W Lw Wᵀ)     column-graph smoothness
```
`Lu, Lw` = graph Laplacians. The row term = `Σ A_ij (U_i − U_j)²` — penalize rating differences
between connected teams. Solved via variable projection (closed-form `W(U)`) + Riemannian
trust-region on the Grassmann manifold. **Do NOT implement the optimizer — use Pymanopt**
(Grassmann + trust-region are built in). The real work is data + graph + honest evaluation.

## Build plan (phases)

- **Phase 0 — toy sanity check (½–1 day).** GR-RTRMC in Pymanopt on synthetic low-rank + graph
  data. Confirm the graph term beats no-graph when you inject >90% sparsity. Gates everything.
- **Phase 1 — NFL data + graph (2–3 days).** Team margin/efficiency matrix per week; build the
  continuity + QB + division + EPA-kNN Laplacians.
- **Phase 2 — integrate + backtest (2–3 days).** Wire completed ratings into spread/total
  features; backtest Weeks 1–6 across seasons; log paper-CLV in SharpLab; Polymarket win-total
  simulator.
- **Phase 3 — honest bake-off (1–2 days).** GR-RTRMC vs. plain ridge/Elo vs. SoftImpute vs.
  current blend, judged on **CLV, not RMSE**. Go / no-go.

Total ≈ 1.5–2 weekends to a real decision. V2 (player-level, learned edge weights, multi-league,
custom Hessian) waits until V1 shows CLV.

## Data sources

- **nba-modeling** (`~/code/nba-modeling`) — existing RAPM+Elo pipeline; reuse patterns, and it's
  the NBA target in Phase "Next".
- **SharpLab** (`~/code/SharpLab`) — odds ingestion + **CLV tracking = the evaluation harness**.
- NFL public data: EPA/DVOA/PFF, snap counts, rosters, schedule. `nfl_data_py` /
  nflverse for play-by-play, rosters, schedules. QB-continuity + returning-snap-overlap → edges.

## V1 scope (build this, skip the rest)

- **Team-level** matrix (rows/cols = 32 teams), NOT player-level.
- Graph = roster-continuity self-edge + QB continuity + division + prior-season EPA k-NN.
- Off-the-shelf Pymanopt.
- Evaluate on RMSE-vs-final-ratings AND paper-CLV on the Weeks 1–6 slice.
- **Baseline to beat = tuned ridge/RAPM + prior-season rating.** Not a strawman.

## Definition of done (V1)

Bets flagged by the completed-rating model beat the closing line on the early-season slice, by more
than a plain ridge/Elo blend does, at bettable size. If not → kill it. No "better RMSE" story
survives a CLV null.

## Honest risks (why this might not work)

1. Failure mode aligns with the money: low-rank+smoothness breaks on non-smooth events (breakout
   rookie QB, injury, scheme change) — exactly the mispricings you want. The prior shrinks you
   toward the crowd when the edge is in deviating.
2. Ridge already does ~80% of this; the graph may add no signal beyond a scalar prior + last-year rating.
3. Paper's gains are marginal, sometimes lost to SoftImpute. A noise-level bump is worthless for betting.
4. Small sample: ~272 games/season × first ~6 weeks → low power; may take several seasons to confirm.

## Stack conventions (match ~/code)

Python 3.12+, type hints on signatures only, minimal abstractions, flat over nested, comments only
when the WHY is non-obvious. No over-engineering for hypothetical futures. pytest for tests.

## Next action

Phase 0. Ask David before scaffolding if unsure, but the obvious first step is a `phase0/` toy
harness: synthetic rank-r matrix + a block/similarity graph, mask >90%, compare completion RMSE
with `λu,λw > 0` vs. `= 0`.
