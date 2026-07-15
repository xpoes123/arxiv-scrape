#!/usr/bin/env python3
"""Publish the arXiv ideation test brief + methodology to share.djiang.xyz."""
import subprocess, os, re, tempfile, sys
from datetime import date

import sys as _sys
PROJECT = "arxiv-scrape"
# Usage: python3 publish.py <brief.md> <slug> "<title>"
BRIEF_FILE = _sys.argv[1] if len(_sys.argv) > 1 else "/home/david/code/arxiv-scrape/brief_test.md"
TODAY = date.today().strftime("%Y-%m-%d")
SLUG = f"{TODAY}-" + (_sys.argv[2] if len(_sys.argv) > 2 else "test-run-methodology")
TITLE = _sys.argv[3] if len(_sys.argv) > 3 else "arXiv Ideation — Test Run + Methodology"
REMOTE_PATH = f"/opt/share/{PROJECT}/{SLUG}.html"
PUBLIC_URL = f"https://share.djiang.xyz/{PROJECT}/{SLUG}.html"

METHODOLOGY = """
## Methodology

The goal: mine fresh arXiv preprints and surface ones that could seed a real project, game, or startup — with a red-team pass so we're not fooled by ideas that only sound good.

### Pipeline

1. **Fetch** (`fetch_papers.py`) — pulls recent papers from the official arXiv API across 16 categories (CS, math, quant/econ, physics/bio), 5 each = 80 papers, sorted newest-first. Respects the API's >=3s rate limit. Writes `papers.json` (title, authors, summary, pdf, category).
2. **Ideate** — one Sonnet agent per 5-paper batch reads the abstracts and brainstorms 2-4 concrete ideas that *apply* the research to something the authors didn't intend. Grounded in what the paper actually enables, not "build an app with AI."
3. **Score** — every idea gets an independent Sonnet reviewer scoring it 0-10 on a rubric: is the research load-bearing or decorative? Is there a real user/market? Can a small team prototype it? Names the biggest risk and the strongest angle.
4. **Rank + synthesize** — ideas ranked by score; the top 6 go to a final Opus agent that writes the brief below with an opinionated "if I had to build one tonight" pick.

All the per-paper work runs in parallel (a workflow pipeline — ideas from one batch get scored while other batches are still ideating), so 80 papers finish in ~15 minutes.

### What this test run was

A 2-batch slice (10 CS papers) to validate the pipeline before the full 80-paper run. It also caught two real bugs worth noting:

- **First attempt killed every idea.** The red-team was prompted to be "ruthless" and default to rejecting — result: 70/70 ideas scored 7-9 on a kill scale and zero survived. A red-teamer that rejects 100% gives no signal. **Fix:** dropped the binary survive/die flag, switched to an honest 0-10 rubric, and always rank + take the top N so the brief can never come back empty.
- The scoring now spreads (this run: 5-6 across the top 6). Nothing cracked 7/10 — but that's an honest read on 5 arbitrary CS papers, and the full 80-paper run should surface a stronger top end.

### Cost

This 10-paper test: 14 agents, ~218k tokens, 3.5 min. The full 80-paper run scales to roughly 1.5-1.8M tokens, ~15 min.

---

*Below is the actual brief this test produced — unedited.*

---

"""

with open(BRIEF_FILE) as f:
    body = f.read().strip()
# The test-run page carries the full methodology; other pages get a short scope line + link.
if "test-run-methodology" in SLUG:
    BRIEF_MD = METHODOLOGY.strip() + "\n\n" + body
else:
    scope = ('<p class="meta">176 papers across 22 arXiv categories (CS, math, quant→prediction-markets/sportsbooks, '
             'bioinformatics, chem, physics). Pipeline + methodology: '
             '<a href="/arxiv-scrape/2026-07-13-test-run-methodology.html">test-run page</a>.</p>')
    BRIEF_MD = body.split("\n", 1)[0] + "\n\n" + scope + "\n\n" + body.split("\n", 1)[1]


def md_to_html(md):
    lines, in_pre = [], False
    for line in md.splitlines():
        if line.startswith("```"):
            if in_pre:
                lines.append("</code></pre>"); in_pre = False
            else:
                lines.append(f'<pre><code class="language-{line[3:].strip()}">'); in_pre = True
            continue
        if in_pre:
            lines.append(line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")); continue
        m = re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            n = len(m.group(1)); lines.append(f"<h{n}>{m.group(2)}</h{n}>"); continue
        if line.startswith("---"):
            lines.append("<hr>"); continue
        if line.startswith("- ") or line.startswith("* "):
            c = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line[2:])
            c = re.sub(r"`([^`]+)`", r"<code>\1</code>", c)
            c = re.sub(r"\*(.+?)\*", r"<em>\1</em>", c)
            lines.append(f"<li>{c}</li>"); continue
        if line.strip() == "":
            lines.append(""); continue
        line = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line)
        line = re.sub(r"`([^`]+)`", r"<code>\1</code>", line)
        line = re.sub(r"\*(.+?)\*", r"<em>\1</em>", line)
        lines.append(f"<p>{line}</p>")
    return "\n".join(lines)


CSS = """
:root{--bg:#0c0f14;--bg-elev:#141821;--fg:#e6e9ef;--fg-dim:#9aa3b2;--accent:#7aa2f7;--accent-soft:#7aa2f733;--rule:#232936;--code-bg:#0a0d12;--code-border:#1d2330;--mono:ui-monospace,"JetBrains Mono","Fira Code",monospace;--sans:-apple-system,BlinkMacSystemFont,"Inter",system-ui,sans-serif}
*{box-sizing:border-box}html,body{margin:0;padding:0;background:var(--bg);color:var(--fg);font-family:var(--sans);-webkit-font-smoothing:antialiased}
body{font-size:16.5px;line-height:1.6}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
main{max-width:760px;margin:0 auto;padding:36px 22px 80px}
h1{font-size:28px;line-height:1.2;margin:0 0 28px;font-weight:700;letter-spacing:-.02em;border-bottom:1px solid var(--rule);padding-bottom:18px}
h2{font-size:20px;margin:38px 0 12px;font-weight:650;letter-spacing:-.01em}
h3{font-size:16.5px;margin:26px 0 10px;font-weight:650;color:var(--fg-dim)}
p,ul,ol{margin:0 0 14px}ul,ol{padding-left:24px}li{margin-bottom:6px}
strong{color:#fff;font-weight:600}em{color:#c0caf5;font-style:italic}
hr{border:none;border-top:1px solid var(--rule);margin:36px 0}
code{font-family:var(--mono);font-size:.88em;background:var(--code-bg);border:1px solid var(--code-border);border-radius:4px;padding:1px 5px;color:#c0caf5;word-break:break-word}
pre{background:var(--code-bg);border:1px solid var(--code-border);border-radius:6px;padding:14px 16px;overflow-x:auto;font-size:.88em;line-height:1.5}
pre code{background:none;border:none;padding:0}
.meta{color:var(--fg-dim);font-size:.9em;margin-bottom:28px}
.back{color:#414868;font-size:.8rem;text-decoration:none;display:block;margin-bottom:12px}
@media(max-width:600px){body{font-size:15.5px}main{padding:22px 16px 60px}h1{font-size:24px}}
"""

html = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{TITLE} — {PROJECT}</title><style>{CSS}</style>
</head><body><main>
<a class="back" href="/{PROJECT}/">← {PROJECT}</a>
<h1>{TITLE}</h1>
<p class="meta">{PROJECT} &bull; {TODAY}</p>
{md_to_html(BRIEF_MD)}
</main></body></html>"""

with tempfile.NamedTemporaryFile(suffix=".html", mode="w", delete=False) as f:
    f.write(html); tmp = f.name

if subprocess.run(["ssh", "root@87.99.136.82", f"mkdir -p /opt/share/{PROJECT}"]).returncode != 0:
    print("SSH mkdir failed"); sys.exit(1)
if subprocess.run(["scp", tmp, f"root@87.99.136.82:{REMOTE_PATH}"]).returncode != 0:
    print("SCP failed"); sys.exit(1)
os.unlink(tmp)
print(f"Published: {PUBLIC_URL}")
