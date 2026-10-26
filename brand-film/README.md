# Brand film — "The Load-Bearing Line"

A ~44 s, 1920×1080 brand introduction film for a new media + software + business-systems company (founding partners: Fady and Hamdy). The company name is **not decided**, so the film ships with a replaceable temporary identity.

Everything is original: the animation is deterministic HTML/SVG/CSS driven by one timeline, rendered frame by frame through headless Chromium into ffmpeg. The score and sound design are synthesised in numpy, with no samples, stock footage or licensed music. Fonts are bundled OFL variable fonts.

```
brand-film/
├── brand.config.json        ← name, descriptor, tagline, contact, palette, copy, pillars (edit this)
├── timeline.json            ← scene start times, fps, size, tempo (shared by picture and sound)
├── src/
│   ├── index.html           ← stage + preview player
│   ├── film.css             ← type system, UI components
│   ├── lib.js               ← easing / timeline helpers
│   └── film.js              ← all scenes (each a pure function of time)
├── audio/score.py           ← music + sound design → output/audio/score.wav
├── scripts/
│   ├── serve.mjs            ← local server for live preview
│   └── render.mjs           ← stills, drafts and the final render
├── assets/fonts/            ← Archivo, Inter, JetBrains Mono (woff2 + OFL licences)
├── docs/                    ← creative direction, scene breakdown, completion report
└── output/                  ← rendered film, audio, stills
```

## Requirements

- Node 18+ and Playwright's Chromium (`npm install && npx playwright install chromium`, or any environment where `require('playwright')` already works)
- Python 3.9+ with **numpy**
- **ffmpeg** (with libx264 and AAC)

## Edit → preview → render

```bash
# 1. Edit brand.config.json (and timeline.json if you retime scenes)

# 2. Live preview with scrubbing and sound (http://localhost:8080/src/index.html, add ?t=12.5 to jump)
npm run preview

# 3. Check specific moments as PNG stills → output/stills/
node scripts/render.mjs --stills 3.6,14.2,36.8

# 4. Rebuild audio (needed only if timeline.json or audio/score.py changed) — ~30 s
python3 audio/score.py

# 5. Final render → output/brand-film_1080p60.mp4
node scripts/render.mjs
```

Useful render flags: `--fps 30` (draft), `--workers 4`, `--from 10 --to 15` (render a range), `--crf 14`, `--preset slow`, `--noaudio`, `--out name.mp4`.

Try a name or logo without touching the main config: copy `brand.config.json`, edit the copy, then `node scripts/render.mjs --stills 41 --config my-test.json` (or open `/src/index.html?config=../my-test.json` in preview). `docs/config-examples/` holds two layout-test configs with **placeholder** names (a short one and a long one). They are not name proposals.

Render time measured in this environment (4 vCPU, software GL): see `docs/COMPLETION_REPORT.md`.

## Replacing the temporary identity

All of these live in `brand.config.json`. No animation code changes are needed.

| Want to… | Change |
|---|---|
| Add the approved company name | `identity.name`. The end frame becomes mark + wordmark, auto-centred and auto-sized. |
| Use the approved logo | `identity.logoSrc` → path relative to `src/` (e.g. `"../assets/logo.svg"`). The drawn mark resolves into it. |
| Tagline | `identity.tagline` (hidden while empty) |
| Website / email / phone / social | `identity.contact.*` (any non-empty values form one line on the end frame) |
| Colours | `palette.*`. `accent` is the single signal colour; `ink` / `paper` are the base. |
| Headline voice | `typography.displayStretch` / `displayWeight` (Archivo width 62–125 %) |
| Any on-screen sentence | `copy.*` and `pillars[].word / .line` (`*word*` = accent colour, `|` = line break). Long text auto-shrinks to fit its column. |

If the accent colour changes, also update the hard-coded `rgba(255,79,26,…)` glow values in `src/film.js` (search for `255,79,26`). They are used for translucent highlights only.

## Vertical 9:16

The scenes are composed for 16:9 and were not adapted to 9:16 (see the completion report). The structure supports it: each scene is an isolated block with absolute coordinates, `timeline.json` carries the frame size, and the capabilities world is a camera over a plane, which re-frames well. A vertical cut needs per-scene layout overrides for the type positions and a 1080×1920 stage. Budget it as a separate pass.
