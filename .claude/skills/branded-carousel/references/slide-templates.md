# Slide Templates

Wireframes and exact element positions for each slide type. Coordinates assume Instagram portrait (1080×1350). For square (1080×1080), reduce vertical positions proportionally; the horizontal margins stay the same.

**Brand fonts (no substitutions):**
- **Fraunces** — all display work (cover headlines, slide headlines, stat numbers, pull quotes). Variable axes locked to `wght=700-900, soft=0, wonk=0`.
- **Inter** — all body and supporting copy.
- **JetBrains Mono** — all metadata (page numbers, captions, source attributions).

## Coordinate system

- Origin `(0, 0)` is top-left.
- All measurements in pixels.
- Outer padding: 96px on all sides (safe zone for text: x ∈ [96, 984], y ∈ [96, 1254]).
- Page indicator anchor: top-right corner, `(984, 96)` right-aligned.
- Handle anchor: bottom-left corner, `(96, 1254)` left-aligned baseline.
- Accent line (when used): horizontal at y=1158, x ∈ [96, 984], 2px thick.

## Template A — Cover slide

**Background:** solid teal `#2d6679`
**Page indicator:** top-right, white `#ffffff`, format `01 / 07`, JetBrains Mono 24pt
**Handle:** bottom-left, white, Inter Regular 24pt

```
┌──────────────────────────────────────┐
│                            01 / 07   │  ← page indicator (JetBrains Mono, white)
│                                      │
│                                      │
│                                      │
│   Stop posting                       │  ← Fraunces 900, soft=0, wonk=0
│   daily.                             │     160pt, white, sentence case
│                                      │     left-aligned, leading 0.95
│                                      │
│   Here's the cadence that            │  ← Inter 400, 36pt, white
│   actually grows accounts.           │     leading 1.2, max 2 lines
│                                      │
│                                      │
│   ────────────                       │  ← optional 80px teal-tint accent bar
│                                      │
│                                      │
│  @yourhandle                         │  ← handle (Inter Regular, white)
└──────────────────────────────────────┘
```

**Headline placement:** y starts at 480, left edge x=96.
**Subhead placement:** y starts at 820, 64px below headline block.

**Note on case:** Fraunces is a high-contrast serif — use sentence case for headlines. ALL CAPS undermines the editorial authority. The font is doing the work; you don't need to shout.

## Template B — Context / single-statement slide

**Background:** white `#ffffff`
**Page indicator:** top-right, teal `#2d6679`, JetBrains Mono 24pt
**Handle:** bottom-left, teal, Inter Regular 24pt
**Accent line:** 2px teal at y=1158

```
┌──────────────────────────────────────┐
│                            02 / 07   │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│   Most creators post daily.          │  ← Fraunces 700, soft=0, wonk=0
│   Their reach is collapsing.         │     56pt, black, leading 1.15
│                                      │     centered vertically
│                                      │
│                                      │
│                                      │
│                                      │
│   ──────────────────────────         │  ← teal accent line
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

## Template C — Value slide (text-only)

**Background:** white `#ffffff` (or teal for every-3rd slide)
**Page indicator + handle + accent line:** standard

```
┌──────────────────────────────────────┐
│                            03 / 07   │
│                                      │
│   01                                 │  ← Fraunces 900, 96pt, teal
│                                      │     (white on teal background)
│                                      │
│   Post less, say more                │  ← Fraunces 700, 72pt
│                                      │     black (white on teal bg)
│                                      │
│   Three carousels per week beats     │  ← Inter 400, 36pt
│   seven posts. Density of value      │     leading 1.4, max 4 lines
│   beats frequency of presence.       │
│                                      │
│   The algorithm rewards the swipes,  │
│   not the publishes.                 │
│                                      │
│                                      │
│   ──────────────────────────         │
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

**Slide number ("01"):** y=240. Use Fraunces 900 — same family as headlines, just bigger and color-shifted to teal. Anchors the eye.
**Headline:** y=400, Fraunces 700.
**Body:** y=560, Inter 400, max 4 lines at 36pt × 1.4 leading.

## Template D — Stat slide

**Background:** teal `#2d6679`
**Page indicator + handle:** white

```
┌──────────────────────────────────────┐
│                            04 / 07   │
│                                      │
│                                      │
│                                      │
│                                      │
│      342%                            │  ← Fraunces 900, 280pt, white
│                                      │     left-aligned at x=96
│                                      │     tracking -3%
│                                      │
│   increase in saves when             │  ← Inter 400, 40pt, white
│   posting carousels vs. single       │     leading 1.3, max 3 lines
│   images.                            │
│                                      │
│                                      │
│   Source: Later, 2025                │  ← JetBrains Mono 400, 24pt
│                                      │     teal-tint #d1e2e7
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

The stat number is the design. Fraunces at 280pt with the variable axes set tight (`wght=900, soft=0`) is a single visual punch. Everything else supports it.

## Template E — Pull quote slide

**Background:** white `#ffffff`
**Page indicator + handle:** teal

```
┌──────────────────────────────────────┐
│                            05 / 07   │
│                                      │
│                                      │
│   "                                  │  ← Fraunces 900 italic, 200pt
│                                      │     teal, opening quote only
│                                      │
│   Frequency without depth            │  ← Fraunces 700 italic, 56pt
│   is just noise.                     │     black, leading 1.2
│                                      │
│                                      │
│   — Jane Doe, Creator                │  ← Inter 400, 28pt
│                                      │     teal, em-dash attribution
│                                      │
│                                      │
│   ──────────────────────────         │
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

The Fraunces italic is what sells this slide — it's the most distinctive cut in the family. Use it for pull quotes specifically.

## Template F — Image / mockup slide

**Background:** teal-tint `#e8f0f3` or white
**Image area:** centered, max 800×800, rounded corners 16px
**Caption:** Inter 400, 28pt below image, max 2 lines

```
┌──────────────────────────────────────┐
│                            06 / 07   │
│                                      │
│   ┌──────────────────────────┐       │
│   │                          │       │
│   │                          │       │
│   │     [duotone image]      │       │
│   │                          │       │
│   │                          │       │
│   └──────────────────────────┘       │
│                                      │
│   Caption naming what the reader     │
│   is looking at.                     │
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

**Always duotone-treat photos:** teal `#2d6679` for shadows, white for highlights, no other hues. Use `mcp__nano-banana-2__edit_image` with prompt: *"convert to duotone using #2d6679 for shadows and #ffffff for highlights, no other colors"*.

## Template G — CTA slide (last slide)

**Background:** black `#0a0a0a`
**Page indicator:** top-right, teal, JetBrains Mono 24pt
**Handle:** bottom-left, white, Inter Regular 24pt

```
┌──────────────────────────────────────┐
│                            07 / 07   │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│   ┌────────────┐                     │  ← teal block, 200×200, rounded 24
│   │            │                     │     decorative anchor
│   │     →      │                     │     white arrow inside
│   │            │                     │
│   └────────────┘                     │
│                                      │
│   Save this carousel.                │  ← Fraunces 700, 72pt, white
│   You'll need it Monday.             │     leading 1.1, max 2 lines
│                                      │
│                                      │
│  @yourhandle                         │
└──────────────────────────────────────┘
```

The teal block is a visual anchor; alternatively use a horizontal teal bar `(96, 700) → (984, 720)` as the accent.

## Universal element positions (cheat sheet)

| Element | Font | x | y | Notes |
|---|---|---|---|---|
| Page indicator | JetBrains Mono 24pt | 984 (right edge) | 96 | right-aligned, format `NN / NN` |
| Handle | Inter 400, 24pt | 96 | 1254 (baseline) | left-aligned |
| Accent line | — | 96 → 984 | 1158 | 2px thick, only on text slides |
| Outer safe zone | — | 96 → 984 | 96 → 1254 | text never crosses these |
| Content vertical center | — | — | 675 | use for centered single-line slides |

## Slide-by-slide background map (default 7-slide carousel)

| Slide | Template | Background | Notes |
|---|---|---|---|
| 1 | A — Cover | teal | Always teal cover. |
| 2 | B — Context | white | Sets up the problem. |
| 3 | C — Value | white | First idea. |
| 4 | C or D — Value/Stat | teal | Mid-carousel teal break. |
| 5 | C — Value | white | Next idea. |
| 6 | C, E, or F | white | Vary template for rhythm. |
| 7 | G — CTA | black | Always black CTA. |

Variations are fine, but the **first slide is always teal** and the **last is always black**. Those two anchors define the brand silhouette of the carousel in the feed grid.

## Font weight cheat sheet

When in doubt about which Fraunces weight to use:

| Use case | Fraunces weight | Variable axes |
|---|---|---|
| Cover headline (slide 1) | 900 | soft=0, wonk=0, opsz=144 |
| Slide headlines (slides 2-N-1) | 700 | soft=0, wonk=0, opsz=72 |
| Stat numbers | 900 | soft=0, wonk=0, opsz=144 |
| Pull quotes | 700 italic | soft=0, wonk=0, opsz=72 |
| CTA headline | 700 | soft=0, wonk=0, opsz=72 |
| Slide section numbers ("01") | 900 | soft=0, wonk=0, opsz=144 |

Never use Fraunces below weight 700 on a slide. The brand voice lives in the heavier end of the family.
