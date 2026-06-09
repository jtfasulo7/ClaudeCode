---
name: Branded Carousel
description: This skill should be used when the user asks to "make a carousel", "create a carousel", "design a carousel", "build an Instagram carousel", "carousel post", "swipe post", "slide deck for Instagram/LinkedIn", or wants multi-slide branded social content. Encodes the user's brand system (#2d6679 teal, black, white) and produces on-brand carousel slides via the Canva MCP.
version: 0.1.0
---

# Branded Carousel

Produce on-brand multi-slide carousel posts (Instagram / LinkedIn / TikTok slides) using the user's brand system. Default output dimensions are 1080×1350 (Instagram portrait). Default tooling is the Canva MCP (`mcp__claude_ai_Canva__*`); fall back to Nano Banana 2 (`mcp__nano-banana-2__*`) for generated imagery and to direct HTML/CSS rendering only when Canva is unavailable.

## Brand system (non-negotiable)

| Token | Value | Usage |
|---|---|---|
| `--brand-teal` | `#2d6679` | Primary brand color. Use for accents, buttons, stat numbers, and 1-of-every-3 slide backgrounds. |
| `--brand-black` | `#0a0a0a` | Headlines on light slides; dramatic backgrounds for CTA slides. Avoid pure `#000`. |
| `--brand-white` | `#ffffff` | Light backgrounds; text on teal/black slides. |
| `--brand-teal-tint` | `#e8f0f3` | Subtle background washes (10% teal). Optional supporting tone. |

**Forbidden:** Other accent colors. No gradients between non-brand hues. No drop shadows with colored tint other than black/teal. No off-brand stock photo color casts — desaturate or duotone-treat any imported imagery toward the teal/black range.

Full color tokens in `assets/brand-tokens.json`.

## Slide architecture

Every carousel follows this structure unless the user specifies otherwise:

```
Slide 1  → COVER (hook)        — biggest type, scroll-stopper, promise
Slide 2  → CONTEXT (why care)  — one-sentence problem or stake
Slide 3-7 → VALUE (1 idea each) — never two ideas on one slide
Slide N  → CTA (action)         — single, specific ask
```

- **Default length:** 7 slides. Cap at 10. Below 5 = better as a single post.
- **One idea per slide.** If a value slide has two paragraphs, split it.
- **The cover earns the swipe.** Headline must finish the sentence "If I read this carousel I will ___."

Detailed copy formulas in `references/copywriting.md`.

## Visual signature (the "tell")

These elements appear on **every** slide so the carousel reads as a set:

1. **Page indicator** — top-right, format `01 / 07`, teal `#2d6679`, 24pt, monospace or condensed sans.
2. **Bottom-left handle/logo** — small, teal or white depending on slide background.
3. **Thin horizontal accent line** — 2px teal, sitting 96px above bottom edge on text slides only (skip on full-bleed image slides).
4. **Consistent margins** — 96px outer padding (8.9% of width). Never let text touch within 80px of edge.
5. **Type hierarchy locked** — headline / body / caption sizes do not vary slide-to-slide.

## Type system

The brand uses exactly three fonts — no exceptions, no Canva-default substitutions.

| Role | Font | Size | Weight / axes | Tracking |
|---|---|---|---|---|
| Cover headline | **Fraunces** | 140-180pt | 900, soft=0, wonk=0, opsz=144 | -2% |
| Slide headline | **Fraunces** | 72pt | 700, soft=0, wonk=0 | -1% |
| Stat number | **Fraunces** | 280pt | 900, soft=0, wonk=0 | -3% |
| Pull quote | **Fraunces** | 56pt | 700 Italic, soft=0, wonk=0 | -1% |
| Body | **Inter** | 36pt | 400 (regular) or 700 (bold) | 0 |
| Caption / page numbers / metadata | **JetBrains Mono** | 24pt | 400 | +5% |

**Architecture rationale:**
- **Fraunces** does all display work — variable axes locked to `soft=0, wonk=0` for the sharpest, most authoritative cut. The 900 weight is the brand's voice.
- **Inter** does all body work. Its job is to disappear so Fraunces leads. Never use Inter for headlines.
- **JetBrains Mono** does all metadata (page numbers, captions, source attributions). Adds technical signature without introducing a second display font.

**Forbidden:** Anton, Bebas Neue, Montserrat, Poppins, Roboto, Geist, Space Grotesk, Playfair Display, or any second serif. If a Canva-generated slide uses one of these, replace it via `update_text` in the editing transaction.

## Slide background rotation

To create visual rhythm, rotate backgrounds:

- Slide 1 (cover) → **teal** `#2d6679` background, white headline
- Slide 2 → **white** background, black text, teal accent line
- Slides 3-N-1 (value) → alternate **white → white → teal** (every third slide is teal-bg with white text)
- Slide N (CTA) → **black** `#0a0a0a` background, teal accent CTA, white supporting text

This gives a dark→light→light→accent→light→light→accent→dark sweep, which is satisfying when scrubbed.

## Production workflow

Follow these steps in order. Do not skip the brand-kit check.

### Step 1 — Confirm brand kit and intent

1. Call `mcp__claude_ai_Canva__list-brand-kits` to confirm the user's "Fasulo Brand" (or equivalent) kit exists with `#2d6679`. If it does, reference it in the design prompt. If not, surface the colors inline and prompt the user to create the kit (one-time setup, see `references/canva-recipes.md` § "First-time setup").
2. Confirm with the user before generating: **topic**, **target slide count** (default 7), **target platform** (Instagram portrait 1080×1350 / square 1080×1080 / LinkedIn 1200×1500). Don't ask if obvious from context.

### Step 2 — Draft copy first

Write all slide copy as plain text **before touching Canva**. Use the structure in `references/copywriting.md`. Output the draft as a numbered list and let the user approve or revise. Do not generate visuals on rough copy.

### Step 3 — Generate the carousel in Canva

Use `mcp__claude_ai_Canva__generate-design-structured` with `design_type: "instagram_post"` (or platform-appropriate) and `num_pages` = slide count. Pass a structured prompt that includes:

- Brand colors with hex values
- Type system (Fraunces 700/900 + Inter + JetBrains Mono — see Type system table above)
- Slide-by-slide copy from Step 2
- Background rotation map
- Visual signature elements (page indicator, accent line, handle)

Full prompt template in `references/canva-recipes.md` § "Generation prompt template".

### Step 4 — Refine via editing transaction

After generation, the layout will be ~70% on-brand. To finish:

1. `start-editing-transaction` on the design ID returned from Step 3
2. Use `perform-editing-operations` to fix: page indicator placement, accent line position, handle placement, font weight overrides, color corrections from any non-brand defaults
3. `commit-editing-transaction` to lock in changes

Common edit operations and their JSON shapes are in `references/canva-recipes.md` § "Editing operations cookbook".

### Step 5 — Generate any supporting imagery

If a slide needs a hero image, mockup, or illustration:

- Use `mcp__nano-banana-2__generate_image` with prompt suffix: *"duotone treatment, teal #2d6679 and black, no other colors, high contrast, editorial photography style"*
- Import via `mcp__claude_ai_Canva__upload-asset-from-url` and place into the relevant slide

### Step 6 — Export

Call `mcp__claude_ai_Canva__export-design` with `format: "png"` and `pages: [1,2,3,...]` to get individual slide files for upload. Save exports to a project-local `carousels/{topic-slug}/` folder.

### Step 7 — Show the user

Display the design URL (from `get-design`) and the exported PNG paths so the user can preview without opening Canva.

## When not to use this skill

- Single-image posts — use a simpler design tool or HTML render.
- Video / Reels — use the `ai-creator-video-style` skill.
- Newsletter / email design — use `frontend-design`.
- If the user's brand differs from #2d6679/black/white — ask them to confirm or update tokens before proceeding.

## Common failures and how to avoid them

1. **Off-brand color drift** — Canva sometimes injects its own palette. After generation, scan every slide and replace any non-token color via the editing transaction.
2. **Cover headline too small** — Default Canva templates use 60-80pt headlines. Force the cover to 140-180pt; it must dominate the thumbnail.
3. **Inconsistent margins** — Canva auto-positions text. Manually set 96px padding via `perform-editing-operations` if any slide has tighter margins.
4. **Skipped page indicators** — Always present on every slide including cover and CTA. Format `01 / 07`, never `1/7`.
5. **CTA without specificity** — "Follow for more" is dead. CTAs must specify the next action and the value of taking it (see `references/copywriting.md` § CTAs).

## Additional Resources

### Reference Files

- **`references/canva-recipes.md`** — First-time brand kit setup, full Canva MCP generation prompt template, editing operations cookbook, common JSON shapes
- **`references/copywriting.md`** — Hook formulas, value-slide structures, CTA patterns, headline length rules
- **`references/slide-templates.md`** — Wireframes for each slide type (cover / context / value / quote / stat / CTA) with exact element positions

### Assets

- **`assets/brand-tokens.json`** — Machine-readable brand palette, type tokens, spacing scale. Reference this when generating prompts so values stay exact.
