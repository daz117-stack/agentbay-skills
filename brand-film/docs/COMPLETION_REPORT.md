# Completion report

## Deliverables

| # | Deliverable | Location |
|---|---|---|
| 1 | Final film: H.264 High, 1920×1080, 60 fps, 43.75 s, AAC 320 kb/s stereo 48 kHz, BT.709, faststart (29.9 MB) | `output/brand-film_1080p60.mp4` |
| 2 | Editable source: animation, styles, render pipeline, score generator, bundled fonts | `src/`, `scripts/`, `audio/score.py`, `assets/fonts/`, `package.json` |
| 3 | Brand configuration (temporary identity, palette, type, copy, tagline/contact slots) | `brand.config.json` (+ `timeline.json` for timing) |
| 4 | Scene breakdown with timestamps, transitions and sound cues | `docs/SCENE_BREAKDOWN.md` |
| 5 | Re-render instructions | `README.md` |
| 6 | This report + creative direction (reference analysis, three directions, scoring, selection) | `docs/COMPLETION_REPORT.md`, `docs/CREATIVE_DIRECTION.md` |
| – | Standalone score (−16 LUFS WAV), 12 key stills from the final file, two layout-test configs | `output/audio/score.wav`, `output/stills/`, `docs/config-examples/` |

## Production approach (and why)

No video-generation model, 3D package or After Effects is available in this environment. What is available: Chromium + Playwright, ffmpeg, Node and numpy. I chose a **deterministic code-driven film**. Every frame is a pure function of time in HTML/SVG/CSS, screenshotted at exact frame times and encoded with ffmpeg. This gives frame-accurate timing, typography as sharp as the browser can render it, and full editability (every brand element is data). It also needs no stock footage, so there are no licensing questions. The trade-off is that it is not photoreal (see limitations).

## Validation actually performed

| Check | Method | Result |
|---|---|---|
| Renders & plays | Full decode of the delivered MP4 with `ffmpeg -v error … -f null` | No decode errors |
| Format | `ffprobe` | 1920×1080, 60/1 fps, 2625 frames, 43.750 s video and audio, yuv420p, bt709 |
| Duration target (30–45 s) | as above | 43.75 s ✓ |
| Blank / black frames | `blackdetect` over the whole film; per-frame luma-difference scan of the 30 fps draft | 0 black segments. Every large frame-to-frame jump falls inside an intended transition (zoom 9.6–9.9 s, pan 12.5–12.7 s, wipes 26.1 s / 29.9 s). |
| Frozen picture | `freezedetect` (1.5 s) | One hit, 27.9–29.6 s: the STABLE hold, where stillness is the point. Intentional. |
| Page/runtime errors | The render script aborts on any page error, console error or failed request | None during the final render |
| Text legibility, spelling, clipping | Visual review of stills at full resolution and contact sheets of every scene. 10 fps sheets of every transition. Auto-fit report for headline widths. | Fixed during review: story card "Breakfast" clipped; descenders touching the line in the opening question; long wordmark overflowing the frame (now auto-fits, tested with a 27-character placeholder name). |
| Transitions | 10 fps contact sheets of 6 transition windows from the draft | Fixed during review: ghost "STABLE" visible during the paper wipe; cluttered entry to TRUSTED; weak line-to-mark handoff; menu screen black for 0.4 s after the zoom. |
| Story beats readable before the camera leaves | Timing review of each capability cell | Fixed: the order "READY" and the retail "Reorder sent" beats were landing ~0.2 s before the pan out. Moved ≈0.45 s earlier. |
| Audio loudness | EBU R128 (`ebur128`) on the delivered file | −15.9 LUFS integrated, −1.5 dBTP, LRA 7.9 LU (web/YouTube-appropriate) |
| Audio balance | Peak and transient analysis, per-scene RMS, spectrum | Fixed: UI ticks were the loudest transients (the very first click hit the ceiling), so I lowered them about 8 dB. Trimmed the sub-bass pedal on the end frame. |
| A/V sync | Audio onsets vs on-screen change in the delivered file | Dot 0.200 / 0.217 s, groove drop 7.50 s, scan beep 16.25 / 16.22 s, letter landing 27.26 / 27.32 s, mark lock 35.27 s. All within a few frames. |
| Replaceable identity | Rendered end frames with a short and a long **placeholder** name, tagline and contact | Lockup centres and scales correctly. Hidden fields leave no gaps. |
| Reproducibility | The final film was rendered from a clean run of `python3 audio/score.py && node scripts/render.mjs` | 15 min 19 s on 4 vCPU (software GL), ≈4.3 rendered frames/s |

## Not verified / known limitations

1. **I could not listen to the audio.** There is no playback device here. The score was checked only by measurement (loudness, peaks, spectrum, onset timing), so its musical quality and mix taste are unconfirmed. **Please listen on decent headphones and on a phone speaker before approving.** If it doesn't land, a licensed track can replace it (one ffmpeg command) and the sound-design cues can be kept or dropped.
2. **Reference audio** was analysed as a signal only (≈90 BPM bed, steady energy). I did not hear its actual style.
3. **Not photoreal.** Businesses are shown as architectural line drawings plus realistic UI, not filmed places or people. That is a deliberate style, but if you want real café or supermarket footage, it has to be shot or licensed.
4. **No 9:16 version.** The structure supports one (see README), but each scene needs a vertical layout pass. I didn't compromise the 16:9 film to fake it.
5. **Accent colour:** fully config-driven (tints are derived from `palette.accent`; text on accent blocks uses `palette.onAccent`).
6. **UI content is illustrative.** Order numbers, "128 orders, all on time", "Done 41 → 42", prices and SKUs are sample interface states, not claims about clients or results. No client names or performance metrics appear.
7. **Repository location.** The project is committed on branch `claude/brand-film` of `agentbay-skills`, an unrelated skills collection, because that is the only repository attached to this session. It is self-contained in `brand-film/`, so it can be moved to a dedicated repository unchanged. Stills and the source zip are excluded from git because they can be regenerated.

## Decisions that need your input

1. **Company name and logo.** When decided, set `identity.name` and optionally `identity.logoSrc`, then re-render. Until then the symbol-only lockup is shippable as a teaser.
2. **Accent colour.** Decided: cobalt on stone (see the update below).
3. **Copy promises.** "No surprises", "Built to run, every single day" and "Customer notified automatically" are commitments the business will be held to. Keep them only if your service model backs them.
4. **Language / market.** If your customers are primarily Arabic-speaking, an Arabic or bilingual cut needs an Arabic display typeface and RTL layouts. Not built yet.
5. **Music.** Keep the original synthesised score, or license a track and keep only the sound design.
6. **Where to store the project** (new repo, this repo on a branch, or just the downloaded files).

## Update: Firststone version (cobalt on stone)

The film was re-rendered with the working name **Firststone**, the tagline **"Start here. Start right."** and the founders' chosen palette, **cobalt on stone** (`brand.config.json`). Code changes: accent tints now come from the config, a new `onAccent` colour keeps text on cobalt blocks legible (≈6:1), the "before" chat bubble is green so mess never looks on-brand, and the tagline is styled in the display face as the closing line. The score is unchanged because the timing is unchanged. The temporary-identity version remains in git history (commit 7f3b63b).
