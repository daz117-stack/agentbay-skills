# Firststone: Visual Identity Brief

Built with the `brand-identity` skill from `brand-context.md`, `positioning.md` and `voice.md`. This brief formalises the system already used in the brand film (`src/`, `brand.config.json`, `docs/CREATIVE_DIRECTION.md`), so film and brand stay one system.

## 01 — Identity strategy statement

Firststone sets small businesses up right, so its identity must look **built, not decorated**. It should be precise enough to trust with daily operations and warm enough that a café owner feels it was made for them. The system rests on one idea from the film, **the load-bearing line**: every element is drawn on a grid, with one signal colour used sparingly and plain, generous typography. Affordability shows through restraint, not cheapness. Think well-made everyday objects (Muji, a good tool), not luxury.

## 02 — Logo direction

**Primary direction:** symbol + wordmark lockup, with each part usable alone.

**The symbol (keep the existing mark):** two identical L-shaped strokes, ink and signal orange, interlocking into a square with two open joints. With the name, its meaning becomes exact: **the first stone, a squared building block made of two equal parts** (two founders, one structure). It also inherits the corner meaning of Rokn, the founders' starting idea. Geometry is in `src/film.js` (200-unit box, 34-unit stroke, 44-unit gaps).

**Wordmark:** "Firststone" in Archivo ExtraBold, width ~108%, sentence case, tight but not touching. The "stst" sequence needs custom kerning and no ligature gimmicks. Test at small sizes (WhatsApp avatar, menu footer).

**Character:** solid, exact, quietly confident. It should feel like a stamp of quality on a well-run shop.

**Style notes:** geometric and constructed, square terminals, no gradients, no 3D, no shadows in the mark. The lockup sits the mark at cap height + descender, as in the film's end frame.

**What to avoid:** literal stones or bricks, rocks, mountain or foundation clip-art, "tech" swooshes, circuit lines, gradients, lettermarks "FS" (reads as a generic monogram).

**Arabic logotype (decision needed):**
- **Recommended:** transliteration «فيرست ستون» as the Arabic wordmark, drawn on the same grid. It keeps one name across languages.
- **Avoid as the name:** «حجر الأساس» (translation). It's a common phrase and likely crowded or unregistrable. Use it as a story line instead: «من أول حجر».

**3 logo references:**
- **Muji:** borrow its *restraint*. Proof that affordable can look considered.
- **Teenage Engineering:** borrow its *precision and labels*. Mono annotations, one orange accent, everything on a grid.
- **Stripe** (wordmark era): borrow its *calm clarity*. A wordmark confident enough not to need decoration.

## 03 — Colour palette

| Role | Name | Hex | Notes |
|---|---|---|---|
| Primary (accent) | **Signal Orange** | `#FF4F1A` | Warmth, appetite, energy, "start". Use for the mark, highlights and offer blocks only. |
| Base dark | **Ink** | `#131416` | Text, mark, dark plates |
| Base light | **Paper** | `#F2EFE9` | Default background: warm, not clinical |
| Surface | **Paper High** | `#FBFAF7` | Cards, UI surfaces |
| Neutral | **Graphite** | `#5A5D63` | Secondary text, labels |
| Line | **Rule** | `#D9D4CA` | Grids, dividers, borders |
| Screen | **Screen** | `#17181B` | Dark digital menus and display UIs |

**Colour personality:** warm-neutral and practical, with one confident signal. A workshop, not a nightclub.

**Usage rules:**
- About 70% paper, 25% ink/graphite, **≤5% orange**. Orange is a signal, never a background for long text.
- **Contrast:** orange text on paper is ~3:1, so large display only (≥24 px bold). Ink on orange is ~5.6:1, fine for all sizes. White on orange is ~3:1, large text only.
- Don't add a second accent. Client work uses the client's colours; Firststone's orange appears only in Firststone's own credit.

**Palette type:** neutral + single complementary accent.

## 04 — Typography

| Use | Latin | Arabic (to test) |
|---|---|---|
| Display / headlines | **Archivo** variable (OFL), ExtraBold–Black, width 108–125% | **Alexandria** (OFL, by Mohamed Gaber; designed for Arabic + Latin) or **Readex Pro** (OFL) |
| UI / body | **Inter** variable (OFL) | **IBM Plex Sans Arabic** (OFL) |
| Labels / data / eyebrows | **JetBrains Mono** (OFL), uppercase, +16% tracking | IBM Plex Sans Arabic Medium (no mono needed in Arabic) |

**Type personality:** wide, grounded headlines (load-bearing), neutral readable text, technical labels. Engineered but friendly.

**Hierarchy:** Headline: Archivo 800, tight leading (0.95–1.05). Subhead: Archivo 700, width 104%. Body: Inter 400/500, 1.5 leading. Labels: JetBrains Mono 500, small caps-style uppercase.

**Avoid:** script or hand-lettering (except deliberately in "before" scenes), condensed "sports" fonts, rounded "app" fonts, Arabic calligraphic display faces (they clash with the constructed system).

## 05 — Imagery & photography

**Overall aesthetic:** documentary and warm. Real shops in daylight, hands at work, screens in use.

**Subject matter:** the counter, the kitchen pass, a shelf, the owner and staff using the tools. Product shots of real screens and menus in place. Architectural **line drawings** (as in the film) for explaining spaces and flows.

**Colour treatment:** natural, slightly warm, honest exposure. No heavy filters.

**Avoid:** stock handshakes and suits, people pointing at holograms, neon "tech" scenes, glowing circuits, AI-generated fake shops, and claimed client imagery without written permission.

## 06 — Iconography & illustration

**Style:** line icons on a 24 px grid, 1.75 px stroke, square caps and joins (echoing the mark). Constructed, not hand-drawn.

**Weight:** regular; bold only at very small sizes.

**Personality:** functional first. Illustration = the architectural line drawings from the film (counter, ticket rail, shelving, storefront), drawn on, never filled.

## 07 — Design principles

- **Built on the line.** Every layout sits on a visible or implied 12-column grid. Alignment is the decoration.
- **One signal.** Orange marks the one thing that matters on a page: the price, the new item, the action. If everything is orange, nothing is.
- **Real over polished.** Show real screens, real menus and real shops. The work is the proof.
- **Legible in both languages.** Every piece must read at arm's length on a phone and across a counter, in Arabic and English.

## 08 — Brand expressions

- **Social media:** a mono eyebrow (category) + Archivo headline + one real visual. Offers sit in an orange block with ink text. The profile picture is the mark on paper (WhatsApp, Instagram, Facebook use the same avatar).
- **Website:** paper background, hero "Start here. Start right.", a live demo (digital menu or order screen), clear package prices, a WhatsApp CTA.
- **Business cards:** front: mark + Firststone on paper. Back: name, role, phone, WhatsApp in mono. Arabic on the reverse side, mirrored layout.
- **Presentations / proposals:** paper slides, a grid visible on section dividers, prices in Archivo, scope in mono tables.
- **Product UI (menus, order and stock screens):** uses the client's brand on screen, Firststone's system underneath (type scale, spacing, components), with a small "Made by Firststone" credit.
- **Referral engine:** a small credit on every delivered menu or screen footer plus a window sticker «متجهّز مع Firststone» ("Set up with Firststone"). For an affordable, local business this is the cheapest marketing channel, so make it a design asset.
