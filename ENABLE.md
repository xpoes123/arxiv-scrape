# Enable the arxiv-scrape nightly (one-time setup)

The nightly scout (`nightly.sh` → `nightly.md`) fetches fresh arXiv papers, ideates across
project/startup/youtube/demo, **builds one demo**, and publishes to share.djiang.xyz via git push.
Two things make it fully zero-touch: (1) a **user systemd timer** that runs the scout each night,
and (2) a **VPS cron** that pulls the pushed artifacts so they go live. Run each block once.

---

## 1. Nightly scout timer (this machine)

Writes two unit files to `~/.config/systemd/user/`, then enables the timer. Paste the whole block:

```bash
mkdir -p ~/.config/systemd/user

cat > ~/.config/systemd/user/arxiv-nightly.service <<'EOF'
[Unit]
Description=arxiv-scrape nightly scout (fetch -> ideate -> build demo -> publish)

[Service]
Type=oneshot
WorkingDirectory=/home/david/code/arxiv-scrape
ExecStart=/home/david/code/arxiv-scrape/nightly.sh
EOF

cat > ~/.config/systemd/user/arxiv-nightly.timer <<'EOF'
[Unit]
Description=Run arxiv-scrape nightly scout at 03:00

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl --user daemon-reload
systemctl --user enable --now arxiv-nightly.timer
loginctl enable-linger david          # so it fires while you're logged out
systemctl --user list-timers arxiv-nightly.timer
```

- **Test it now (foreground, watch the run):** `bash ~/code/arxiv-scrape/nightly.sh` then
  `tail -f ~/.local/share/arxiv-nightly/$(date +%F).log`
- **Trigger the timer's job once:** `systemctl --user start arxiv-nightly.service`
- **Logs:** `~/.local/share/arxiv-nightly/<date>.log`

> The scout runs headless `claude -p ... --dangerously-skip-permissions` on **sonnet** (cheap enough
> nightly). Bump the model in `nightly.sh` to `opus` if you want fancier demos.

---

## 2. VPS auto-pull cron (makes pushes go live)

The nightly only **pushes** to GitHub (`xpoes123/david-share`) — it never SSHes to prod. This cron on
the VPS pulls `/opt/share` every 5 min, so each push (nightly or manual) goes live within 5 minutes.
Run from **your** shell (`!`-prefix in Claude Code, or a normal terminal). Idempotent — de-dupes first:

```bash
ssh root@87.99.136.82 '(crontab -l 2>/dev/null | grep -v "opt/share pull"; echo "*/5 * * * * cd /opt/share && git pull -q origin main >/dev/null 2>&1") | crontab - && echo INSTALLED && crontab -l | grep share'
```

**Deploy tonight's artifact immediately** (before the cron's first tick):

```bash
ssh root@87.99.136.82 'git -C /opt/share pull'
```

- 5-min poll is deliberate — the nightly runs once/night, so polling beats standing up a webhook.
  Swap to a GitHub webhook → `git pull` only if the lag ever matters.
- Claude can't install this cron itself — root SSH write + persistence to prod is gated to you.

---

## The loop, once both are on

```
03:00 nightly.timer -> nightly.sh -> claude scout: fetch 44 papers -> ideate -> build demo
      -> git push david-share        (this machine)
~5min VPS cron: git -C /opt/share pull   -> LIVE at share.djiang.xyz/arxiv-scrape/
```

Zero touch. Check results at https://share.djiang.xyz/arxiv-scrape/ or in `LOG_nightly.md`.
