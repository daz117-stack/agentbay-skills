# Creative direction

## 1. Reference analysis (what was actually inspected)

Source: `1259b12f-vcompress_2.mp4`, 1170×540, 40 fps, mono 16 kHz AAC, 2:24.75 long. It is a **screen recording** of a phone/web player. Frames 0–1.5 s show player controls, there are pillar-box bars with a UI chevron, and the film content runs **≈1.5 s → 44 s**. The remaining ~100 s is a static end card. Method: 2 fps timestamped contact sheets of the film section, scene-cut detection, crop detection, and an audio loudness / onset / tempo analysis. I could not listen to the audio. Tempo, energy and timbre figures come from signal analysis only.

| Aspect | What the reference does |
|---|---|
| Opening hook | Starts mid-motion on a soft-focus field of floating UI cards (content calendars, tables). A provocation follows: *"Your marketing is running." → "But is it a system?"*. The hook is a question, not a logo. |
| Narrative | Problem → brand → *"We build systems into your marketing"* → three outcomes (*Be known / Be measurable / Be trusted*) → product (dashboard: Strategy → Tech → Systems) → tension (*"System broken?"*, glitch) → resolution (*"We fix it."*, revenue line climbs) → *"You know where to come."* → logo end card. |
| Camera & motion | 2.5D: cards float on a perspective plane with slow drift. Whip transitions, a 90° frame rotation, defocus (blur) transitions between beats, fast ease-out snaps. Counters tick up (33.8K → 48.6K, 1.2× → 4.8×, 0 → 2.4M). App nodes connect to a hub with curved lines. |
| Typography | Heavy **extended** grotesk headlines, ink + one accent word. Tiny tracked mono eyebrows ("PERFORMANCE MARKETING"). The wordmark is lowercase with a coloured full stop. |
| Light & colour | Bright off-white stage with a soft lavender/blue radial glow and a vignette. One electric ultramarine accent with one full-bleed accent moment. A halftone/scanline texture appears only in the "broken" beat. |
| Sound | Continuous electronic bed of roughly 90 BPM (onset period ≈0.33/0.67 s) from ≈2 s to 44 s, with no breakdowns. The spectral centroid stays steady at ≈1.3–1.5 kHz. |
| Ending | Logo + "MEDIA" + handle/domain in mono, centred, held. |

**What makes it work:** (1) a question as the hook, (2) every claim is *shown* as a believable UI, not stated, (3) one accent colour used with discipline, (4) a systems metaphor (nodes → hub) that recurs, (5) a tension/resolution beat, (6) relentless but legible pacing, at roughly one idea every 2.5–5 s.

**What we deliberately did not copy:** its wordmark, colours, card designs, copy, "growth-hack" metrics (fake ROAS/revenue numbers, which would also break the brief's "no fictional client results" rule), and the glitch effect. A glitch is a generic trope and contradicts STABLE.

## 2. Three directions

### A. "The Load-Bearing Line" (architectural / editorial) — **selected**
- **Concept & metaphor:** One precise line is the brand's single graphic act. It draws the counter, the grid and the route an order travels. At the end it draws the mark. Good systems are *drawn*, not improvised. The business world appears as architectural line drawings (café counter, ticket rail, shelving, storefront), and the digital work appears as realistic, clean UI on top.
- **Type:** Archivo Expanded (variable width 112–125 %), ExtraBold/Black for headlines (wide = grounded, load-bearing). JetBrains Mono for annotations (drafting-sheet labels, timestamps, SKUs). Inter for UI copy.
- **Palette & light:** warm paper `#F2EFE9`, ink `#131416`, graphite, rule grey, one **signal orange** `#FF4F1A`. Ink plate for STABLE. Soft drifting window light, film grain, crop marks like a drawing sheet.
- **Motion:** draw-on lines, outExpo snaps, masked word reveals that emerge *from* the line, one continuous world plane the camera pans across (directional motion blur), defocus between chapters.
- **Pillars:** TRUSTED = frosted glass clears to a sharp word + a transparent order-status timeline. STABLE = letters fall with weight onto a floor line and then nothing moves. WELL-DESIGNED = letters snap onto a 12-column grid with construction guides and spacing ticks.
- **+** Distinctive against the purple-glow SaaS look. Expresses "well-designed processes" literally. Needs no stock footage. Every element is code, so the brand is fully swappable.
- **−** Line art is less emotional than live-action. Orange is less conventionally "trust" than blue (it is a config value).
- **Fit:** strong for restaurants/retail (physical places), credible for software buyers.

### B. "One Order" (cinematic, dark, single take)
- **Concept:** Follow one order ticket in an unbroken camera move: tapped on a menu → kitchen screen → pickup → receipt → logo. Graphite environment, brushed aluminium and frosted glass, a warm amber "ticket light".
- **Type:** condensed grotesk + receipt mono. **Palette:** near-black, amber, cold white.
- **Motion:** one continuous dolly, depth of field, light sweeps.
- **Pillars:** shown as states of the order (confirmed = trusted, on time = stable, effortless = well-designed).
- **+** Very cinematic, strong narrative thread.
- **−** Restaurant-only story under-sells media and retail. The dark tech aesthetic is the most "generic AI" look. Convincing 3D materials need a 3D pipeline (Blender / AE) that isn't available here, so it would look cheap in code.

### C. "Shopfront Editorial" (poster / print)
- **Concept:** The company as a design studio for main-street businesses. Kinetic posters, price tags and shop windows, colour blocks, halftone photography crops, oversized numerals.
- **Type:** tall condensed display + serif italic accents. **Palette:** multiple saturated brights on cream.
- **Motion:** paper slides, stamp hits, poster wipes.
- **+** Memorable, warm, very "media".
- **−** Reads as an ad agency, which weakens the software and stability story. It needs photography we don't own, and a multi-colour palette is harder to keep consistent across a future brand.

### Evaluation (1–5)

| Criterion | A. Load-Bearing Line | B. One Order | C. Shopfront Editorial |
|---|---|---|---|
| Originality | 4 | 3 | 4 |
| Memorability | 4 | 4 | 4 |
| Trust | 4 | 4 | 3 |
| Stability | **5** | 4 | 2 |
| Design quality (achievable here) | **5** | 2 | 3 |
| Commercial relevance (media + software + ops) | **5** | 3 | 3 |
| Adaptability to an undecided name | **5** | 4 | 3 |
| **Total** | **32** | 24 | 22 |

A wins on the criteria the brief ranks highest and is the only one that can be executed at premium quality with the tools available.

## 3. Temporary identity

- **Mark:** two identical L-shaped strokes, one ink and one orange, interlocking into a square frame with two open joints. It reads as *two partners, one structure*. It also repeats the crop marks that frame the whole film, so the film quietly "contains" the identity from the first second. It is abstract: it encodes no letters and implies no name.
- **Wordmark:** none by default. `identity.name` in `brand.config.json` is empty, so the end frame is a symbol-only lockup with the descriptor "Media · Software · Business Systems" and the pillars line. Setting a name switches to a mark + wordmark lockup that sizes and centres itself automatically.
- **Approved logo:** `identity.logoSrc` lets the drawn mark resolve into a real logo file during the reveal, without touching the animation.
