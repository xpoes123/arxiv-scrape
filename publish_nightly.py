#!/usr/bin/env python3
"""Publish tonight's arxiv-nightly demo + brief into ~/code/david-share (manifest-driven)."""
import json, shutil, subprocess, os

SHARE = "/home/david/code/david-share"
DATE = "2026-07-15"
DEMO_SRC = "/home/david/code/arxiv-scrape/hawk_wing_composer.html"
DEMO_FILE = f"arxiv-scrape/{DATE}-hawk-wing-composer.html"
BRIEF_FILE = f"arxiv-scrape/{DATE}-nightly.html"
DEMO_TITLE = "Hawk Wing Composer — fly a bird with 4 DMD modes"
BRIEF_TITLE = "arXiv Nightly — 4 modes, one hawk (Jul 15)"

# 1. copy demo verbatim (already self-contained)
shutil.copyfile(DEMO_SRC, f"{SHARE}/{DEMO_FILE}")

# 2. build the brief page
CSS = """:root{--bg:#0c0f14;--fg:#e6e9ef;--dim:#9aa3b2;--accent:#7aa2f7;--accent2:#bb9af7;--gold:#e0af68;--rule:#232936;--elev:#141821;--mono:ui-monospace,"JetBrains Mono",monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:15px;line-height:1.6}
main{max-width:760px;margin:0 auto;padding:40px 22px 90px}
h1{font-size:26px;letter-spacing:-.02em;margin:0 0 6px;border-bottom:1px solid var(--rule);padding-bottom:16px}
.meta{color:var(--dim);font-size:12.5px;margin:6px 0 26px}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin:34px 0 10px}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
ul{padding-left:20px;margin:0 0 14px}li{margin-bottom:9px}
b{color:#fff}i{color:var(--gold);font-style:normal}
.cta{display:block;margin:22px 0 8px;padding:18px 20px;background:linear-gradient(120deg,#182136,#1c1830);border:1px solid var(--accent2);border-radius:14px}
.cta .k{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--gold)}
.cta .t{font-size:19px;color:#fff;margin:6px 0 4px}.cta .d{color:var(--dim);font-size:13px}
.cta:hover{text-decoration:none;border-color:var(--accent)}
code{background:var(--elev);border:1px solid var(--rule);border-radius:4px;padding:1px 5px;font-size:.9em;color:#c0caf5}
.foot{margin-top:40px;padding-top:16px;border-top:1px solid var(--rule);color:var(--dim);font-size:12px}"""

BODY = f"""
<h2>Built tonight</h2>
<a class="cta" href="/{DEMO_FILE}">
  <div class="k">▶ interactive demo</div>
  <div class="t">Hawk Wing Composer</div>
  <div class="d">Four dynamic-mode-decomposition sliders drive a procedurally-flying red-tailed hawk — flap, glide, and bank all emerge from a low-dimensional attractor. Grounded in <b>arXiv:2602.19196</b>. Try dropping Mode 1 to 0, raising Mode 3 for a pure glide, then pushing Mode 4 to carve a turn.</div>
</a>

<h2>Projects</h2>
<ul>
<li><b>Prediction Alpha Decay Dashboard</b> — LOBFrame-based tool separating ML forecast accuracy (F1) from real trading alpha, flagging "illusory performance" models (<a href="https://arxiv.org/abs/2403.09267">arXiv:2403.09267</a>).</li>
<li><b>Metamaterial Genome</b> — treat network irregularity as a design knob: tune node-degree variance and watch simulated stiffness / wave transmission shift (<a href="https://arxiv.org/abs/2606.02695">arXiv:2606.02695</a>).</li>
</ul>

<h2>Startups</h2>
<ul>
<li><b>LLM Memory Surgery</b> — certified, adversarially-verified fact removal for GDPR/CCPA "right to erasure," since knowledge editing only <i>suppresses</i> facts (<a href="https://arxiv.org/abs/2606.23276">arXiv:2606.23276</a>).</li>
<li><b>Vaccination Coverage Lie Detector</b> — mark-recapture on immunization records + tally sheets to estimate true coverage, replacing slow gold-standard surveys (<a href="https://arxiv.org/abs/2511.12536">arXiv:2511.12536</a>).</li>
</ul>

<h2>YouTube</h2>
<ul>
<li><b>Why Your AI Can't Actually Forget</b> — recover a "deleted" fact live via indirect prompting; low-rank edits hide facts in anisotropic loss valleys, not remove them (<a href="https://arxiv.org/abs/2606.23276">arXiv:2606.23276</a>).</li>
<li><b>The Molecule That Remembers Its Spin</b> — ortho vs para ammonia behave differently in an optical cavity; nuclear spin + Pauli exclusion reshape light-matter coupling (<a href="https://arxiv.org/abs/2605.00149">arXiv:2605.00149</a>).</li>
</ul>

<h2>Runner-up demos</h2>
<ul>
<li><b>The HFT Paradox Simulator</b> — Kyle-model sandbox where cranking HFT speed/precision <i>shrinks</i> HFT profit and helps the slow informed trader (<a href="https://arxiv.org/abs/2403.08202">arXiv:2403.08202</a>).</li>
<li><b>Ising Spin Flip Paradox</b> — dual live MCMC lattices reveal non-monotone edge-alignment vs coupling J (<a href="https://arxiv.org/abs/2606.13648">arXiv:2606.13648</a>).</li>
<li><b>Pearl's Ladder</b> — build a causal graph, watch association vs do-calculus vs counterfactual diverge; Simpson's paradox baked in (<a href="https://arxiv.org/abs/2607.08093">arXiv:2607.08093</a>).</li>
</ul>

<div class="foot">Scouted 44 fresh arXiv preprints across CS/math/quant/bio/chem/physics · 37 ideas generated, 21 demo-grade · picked by cool×buildable. Nightly run by <code>arxiv-scrape</code>.</div>
"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{BRIEF_TITLE}</title><style>{CSS}</style></head>
<body><main>
<h1>arXiv Nightly</h1>
<div class="meta">arXiv Ideation · {DATE} · projects / startups / youtube / demos + one thing built</div>
{BODY}
</main></body></html>"""

with open(f"{SHARE}/{BRIEF_FILE}", "w") as f:
    f.write(html)

# 3. add manifest entries (idempotent — replace if file already present)
mpath = f"{SHARE}/manifest.json"
m = json.load(open(mpath))
m["pages"] = [p for p in m["pages"] if p["file"] not in (DEMO_FILE, BRIEF_FILE)]
m["pages"].insert(0, {"file": BRIEF_FILE, "project": "arxiv-scrape", "date": DATE, "title": BRIEF_TITLE, "tag": "brief", "redirect_from": []})
m["pages"].insert(0, {"file": DEMO_FILE, "project": "arxiv-scrape", "date": DATE, "title": DEMO_TITLE, "tag": "demo", "redirect_from": []})
json.dump(m, open(mpath, "w"), indent=2)

print("wrote:", DEMO_FILE, "+", BRIEF_FILE, "+ manifest")
print("public:")
print(f"  https://share.djiang.xyz/{DEMO_FILE}")
print(f"  https://share.djiang.xyz/{BRIEF_FILE}")
