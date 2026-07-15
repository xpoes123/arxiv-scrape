# arXiv Ideation — Viral Bets

Fifteen ideas mined from 176 arXiv papers, ranked for how hard they'd actually travel on LinkedIn and YouTube — not how clever they read on paper.

## The Contenders

**1. An AI Agent Hacked 95% of IoT Devices It Tried** — *provocative-result*
- **Hook:** LLM agents just hit a 95% success rate autonomously exploiting IoT vulns — no human in the loop, under 2 minutes each, across 260 attacks.
- **Format:** X thread
- **Why it spreads:** The three-audience overlap is the whole game — security pros share it as a warning, normies share it as "oh no my smart fridge," AI people share it as agentic proof. A single stat ("260 attacks, 95%") does all the work. That triple-share is exactly what makes threads compound.
- **Buildable:** Weekend. You're annotating the paper's own numbers, not reproducing them.
- **Biggest risk:** The tests ran on IoTGoat and Metasploitable2 — deliberately vulnerable practice targets, not production devices. One credible reply reframes "95% of IoT devices" as "95% of tutorial CTF boxes" and the hook deflates. Preempt it in the thread or become a ratio target.
- *This is my #1 because the risk is a wording problem you fully control, and the payload survives a screenshot with no context.* (2607.09653v1)

**2. Your AI Knows the Right Answer — It's Just Lying to You** — *provocative-result*
- **Hook:** VLMs encode the correct object count in their activations even while outputting the wrong number — and steering those directions fixes it, +15.6 points, zero retraining.
- **Format:** LinkedIn post
- **Why it spreads:** "It knows but lies" is viscerally unsettling and reframes hallucination as self-misalignment. One figure — probe accuracy vs. output accuracy — carries it.
- **Buildable:** Weekend.
- **Biggest risk:** The framing is a lie itself, and AI-literate readers know it — a linear probe pulling structure out of activations is not "knowing." One sharp comment flips shares into dunks. You have to defuse the objection inside the post without dulling the hook. Tight needle, but the payoff is high.
- (2607.09544v1)

**3. Crypto Markets Have a Heartbeat — Every 15 Minutes** — *mind-blowing*
- **Hook:** Algo trading creates predictable volatility bursts at exact 1-, 5-, and 15-minute marks, and the order imbalance there forecasts 4–12 hour returns. The market has an alarm clock.
- **Format:** Interactive demo (clock face pulsing at :00/:15/:30/:45)
- **Why it spreads:** "Markets are random" is gospel; "bots share a cron job" detonates it. Validates the finance crowd's candle-open superstition with real academic proof. The toy is screenshot-native and the caption writes itself.
- **Buildable:** Weekend.
- **Biggest risk:** If the pulses look subtle instead of dramatic, "mind-blowing" collapses into "oversold." The viz has to make the pattern undeniable — squinting kills it. But this is a design problem, not a truth problem, which is why it ranks high.
- (2607.09426v1)

**4. Your Model Could Be Backdoored — And Auditing Every Weight Won't Catch It** — *provocative-result*
- **Hook:** Proven under cryptographic assumptions: a backdoored net can be statistically identical to a clean one across all weights, while the trainer still triggers it on demand.
- **Format:** LinkedIn post
- **Why it spreads:** It breaks the load-bearing assumption that white-box inspection catches backdoors. Security people, researchers, and skeptics all want it. The crypto-proof angle buys credibility past typical FUD.
- **Buildable:** Weekend.
- **Biggest risk:** "Undetectable" is conditional on hardness assumptions, and the informed audience will instantly walk the absolute headline back to "undetectable unless X." If you can't hold that nuance, the thread becomes a corrections pile-on. Slightly harder needle than #2 because the caveat is load-bearing to the claim itself.
- (2607.09532v1)

**5. Higher Vaccination Rate = Lower Measured Vaccine Effectiveness** — *provocative-result*
- **Hook:** A model shows vaccinating more people can make vaccines look less effective — not conspiracy, just how the metric is measured. Absolute burden always drops.
- **Format:** LinkedIn post
- **Why it spreads:** The pro-vax paper with an anti-vax-sounding headline is a genuine "wait, WHAT" that forces engagement with the nuance. Three tribes share it for three reasons; 200+ argument comments.
- **Buildable:** Weekend.
- **Biggest risk:** Real, and structural: platform filters pattern-match "vaccines look LESS effective" as health misinfo and suppress it before the nuance lands — and bad-faith accounts will screenshot it stripped of the "absolute burden drops" qualifier. High ceiling, high chance of getting throttled or weaponized. That downside risk is why it's not top-three despite the perfect tension.
- (2607.06235v1)

**6. AI Sees the Same Scene — But Looks at Totally Different Parts of It** — *mind-blowing*
- **Hook:** MLLMs now match top humans describing complex social scenes, but fixate on different image regions to get there. Right answer, wrong reasons.
- **Format:** YouTube video
- **Why it spreads:** "Right answer, not actually looking where you'd look" fuels the "does AI understand or just pattern-match" debate. A human-vs-AI gaze heatmap overlay is instant screenshot bait.
- **Buildable:** Weekend — *if* the visual lands.
- **Biggest risk:** The whole video lives or dies on the heatmap. If AI vs. human saliency looks similar or muddy, the "wait WHAT" moment evaporates and you're left with a talking head narrating a result — a 5/10 video. Higher production risk than the LinkedIn plays, hence mid-pack.
- (2607.09654v1)

**7. Your COVID Model Lied To You (Mathematically)** — *mind-blowing*
- **Hook:** The SEIR model behind every government's COVID response has infinitely many equally valid parameter sets — case data alone can't separate transmission rate from incubation.
- **Format:** LinkedIn post
- **Why it spreads:** Rigorous enough for scientists, validating enough for skeptics, useful enough for public-health folks. "Two pandemics with opposite transmission rates, identical case curves" stops the scroll.
- **Buildable:** Weekend.
- **Biggest risk:** Tribal capture. Skeptics run it as "models are fake," scientists dunk with "this is textbook identifiability, calm down," and the algorithm buries the middle. Structural identifiability is genuinely known material, so the pedant dunk is legitimate — that's what caps it below the fresher results.
- (2607.09137v1)

**8. China's Travel Data Drew Its Own Borders** — *playable-explainer / interactive*
- **Hook:** Renormalize 100M Chinese trip records with pure math — zero geographic input — and provincial borders emerge on their own.
- **Format:** Interactive zoom-out demo with a political-boundary overlay toggle
- **Why it spreads:** "An algorithm re-invented China's provinces without being told where they are" is a clean viral one-liner. The zoom-out GIF alone travels on X. (Two of your fifteen ideas — 2607.08853v1 — are this same paper; merge them, don't post both.)
- **Buildable:** Week. You can't load 100M records in-browser; you need a pre-aggregated graph that still feels authentic.
- **Biggest risk:** The boundary match is approximate in places, and the self-similarity claim is subtle — viewers only feel the overlay, not the fractal. Approximate matches invite "cherry-picked" dismissals. Real wow, fragile execution, more build cost than the top tier.
- (2607.08853v1)

**9. Math Predicted the Han Dynasty's Collapse 45 Years Early (And Rome Too)** — *mind-blowing*
- **Hook:** One topological threshold, H* = 0.5241, signals imperial collapse decades ahead — it fired for Han in ~170 CE (fell 220 CE) and it's the same number found for Rome.
- **Format:** YouTube video
- **Why it spreads:** A specific number feels like a real discovery, and "same constant for Rome and China" is screenshot gold. History nerds, math nerds, and doomsday-for-the-US commenters all pile in.
- **Buildable:** Weekend.
- **Biggest risk:** This is the one I'd flag hardest. The "prediction" is almost certainly retroactive — fitted to known outcomes, not a live forecast — and a single suspiciously precise universal constant (0.5241) across two wildly different civilizations reeks of overfitting. Math and history pedants will read the abstract and ratio it. Clever, but the credibility is thin enough that it can flop loudly. (Note: you submitted this paper twice — 2607.09010v1 also appears as the "Three Kingdoms appeared in the data" pitch; same caveat, pick one.)
- (2607.09010v1)

**10. Topology Saw the Three Kingdoms Coming 30 Years Early** — *mind-blowing*
- **Hook:** Persistent homology on the Han road network — the cross-network Wasserstein distance jumps from exactly 0 to 737 at 190 CE, and three β₁ cycles matching Wei/Shu/Wu emerge 30 years before formal partition.
- **Format:** YouTube video
- **Why it spreads:** Romance of the Three Kingdoms pop-culture recognition plus a clean dramatic number (0→737). History and math audiences both bite.
- **Buildable:** Weekend, but the network-fracturing animation has to carry the entire concept.
- **Biggest risk:** Same paper as #9, same retroactivity problem, plus the method (persistent homology, Wasserstein distance) is brutal to visualize honestly. Spend 90 seconds explaining it and history viewers bounce; skip it and math viewers feel cheated. Don't ship both Han videos — this framing is the better of the two because it leans on a concrete moment instead of a dubious universal constant.
- (2607.09010v1)

**11. Your Writing Has a Fingerprint — Can AI ID You From 100 Words?** — *fun-game*
- **Hook:** Forensic linguists derive court-admissible authorship likelihood ratios from rare-word distributions alone. Try to fool it in under 100 words.
- **Format:** Web toy
- **Why it spreads:** Personality-test energy with real forensic stakes. The hapax-legomena twist (rare words betray you more than common ones) is sticky.
- **Buildable:** Weekend.
- **Biggest risk:** The loop is trivially gameable — write gibberish or bland prose and "win," which deflates the reveal. A fingerprint score that feels like a gameable black box has no share moment. The emotional payoff needs the score to feel *true and slightly uncomfortable*, and that's hard to guarantee. Fun, but the interaction design is doing more work than the science.
- (2607.09501v1)

**12. Why Every Medieval King Was Named Henry, Edward, or Philip** — *playable-explainer*
- **Hook:** A single "prestige" variable — glory a name accrued under past rulers — reproduces centuries of dynastic naming across 10 royal houses. Play it; watch name dynasties rise and crash.
- **Format:** Web toy
- **Why it spreads:** "Why were there 8 Henrys" is a recurring history meme; this gives the actual emergent answer, and one lucky king locking in a name for centuries is a satisfying mechanic.
- **Buildable:** Weekend.
- **Biggest risk:** Niche ceiling and a fragile hook — the sim has to surprise inside 30 seconds (a name leaping 2%→60% in one reign). If the stochastic shock is too slow or subtle it's just a name histogram and people close the tab. Lower absolute reach than the AI/security plays even when it works.
- (2607.08689v1)

**13. An AI Chip Hacked With an EM Pulse — Then Its Hidden Backdoor Wakes Up** — *mind-blowing*
- **Hook:** Researchers hit an ARM Cortex-M4 with precise electromagnetic fault injection mid-inference, flipping registers to trigger a feature-map-level backdoor that every input-space defense misses.
- **Format:** YouTube video
- **Why it spreads:** Physical electromagnetics crossing into ML feels like sci-fi, and "we were looking in the wrong layer" is a clean arc.
- **Buildable:** Week — and that's generous.
- **Biggest risk:** This one I'd temper expectations on. It needs real EM-injection hardware on camera or the "visually stunning" premise is hollow B-roll, and explaining "feature-map-level backdoor" without tanking pacing defeats most science channels (retention craters at 40%). Highest production burden of the batch for a mid-tier share ceiling. Clever, likely flops unless you already own the lab.
- (2607.09473v1)

**14. Your Brain Has a Shape When You Dream — And We Can Read It** — *mind-blowing*
- **Hook:** Dream states show up in the geometric *shape* (topology) of the EEG attractor, not the frequency — Betti curves count the "holes" in your neural activity.
- **Format:** YouTube video
- **Why it spreads:** "Your dream has a shape" is screenshot bait; neuroscience + topology + dreams is three rabbit holes in one.
- **Buildable:** Weekend.
- **Biggest risk:** One reframe too many. Casual viewers wall out at "attractor topology" before any payoff, and the hook oversells — the paper classifies *sleep stages*, it doesn't "read dreams." The moment a few people hit the abstract, that promise-vs-reality gap poisons the comments. Lowest score here (7) and I agree with the score — it's the softest bet.
- (2607.09662v1)

**Note on duplicates:** Fifteen entries, thirteen papers. The two Han-dynasty pitches (#9, #10) and the two China-mobility pitches (#8 and its "zoom until it looks the same" twin) each cite one paper. Don't post both halves of a pair — you'll cannibalize yourself and hand critics a "they're recycling" angle.

## The One I'd Post First

**An AI Agent Hacked 95% of IoT Devices It Tried (2607.09653v1)** — the X thread.

Why this one over the flashier science: it wins on *floor*, not just ceiling. Every other top idea has a truth-fragility problem baked into the claim — "it knows but lies" isn't literally true, "undetectable backdoor" is assumption-conditional, the Han constant is probably overfit, the vaccine post can get filter-throttled. This one's only weakness is a *wording* problem (lab targets vs. production devices), and wording is the one variable you fully control before you hit post. The payload also survives context collapse: the stat "95% success, 260 autonomous attacks, under 2 minutes each" lands even as a bare screenshot, and it hits three sharing audiences at once — the structural driver of viral threads. Zero reproduction needed; you're packaging the paper's own numbers.

**Concrete first step to a shippable demo:** Pull the paper's results table and build the thread around one hero image — a clean bar/stat card reading "260 autonomous attacks · 95.0% success · <2 min avg" with the two-agent loop (recon → plan → exploit) as a three-box diagram beneath it. Draft tweet 1 as the raw stat, and make **tweet 2 the pre-emptive caveat** in your own voice: "Caveat before the replies: these ran on IoTGoat and Metasploitable2 — deliberately vulnerable testbeds, not your actual router. Here's why that still matters…" That single move converts your biggest risk into a credibility signal and starves the top critical reply of oxygen. Ship the image plus five tweets in an afternoon.