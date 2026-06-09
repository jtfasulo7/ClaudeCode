# Canva MCP Recipes

Reference loaded when executing the Canva portion of the workflow. The Canva MCP tool surface evolves; treat exact parameter names as guidance and inspect tool schemas (via `ToolSearch`) before calling if a tool errors.

## First-time setup (one-time, do this before first carousel)

If `mcp__claude_ai_Canva__list-brand-kits` returns no kit matching the user's brand, instruct the user to create one manually in Canva (the MCP cannot create brand kits programmatically as of writing). Provide these exact values to copy:

**Brand kit name:** Fasulo Brand

**Colors:**
- Primary: `#2d6679` (Teal)
- Neutral 1: `#0a0a0a` (Black)
- Neutral 2: `#ffffff` (White)
- Supporting: `#e8f0f3` (Teal Tint), `#1f4a59` (Teal Dark)

**Fonts (locked — no substitutions):**
- Display (all headlines, stat numbers, pull quotes): **Fraunces** (variable, weights 700-900, axes `soft=0, wonk=0`)
- Body (all running copy): **Inter** (weights 400, 500, 700)
- Mono (page indicators, captions, metadata): **JetBrains Mono** (weight 400)

If Canva's brand kit doesn't accept variable axes for Fraunces, set the static weights `Fraunces 700` and `Fraunces 900` and use the italic variants where called for.

**Logo:** upload user's logo as both light-on-dark and dark-on-light variants.

After setup, every subsequent generation can reference the brand kit by name and Canva auto-applies the palette.

## Tool surface (what's available)

| Tool | Purpose | When to use |
|---|---|---|
| `list-brand-kits` | List user's saved brand kits | Step 1 of every carousel |
| `generate-design` | Generate from a freeform prompt | Quick one-offs |
| `generate-design-structured` | Generate with explicit pages/structure | **Default for carousels** |
| `get-design` | Fetch design metadata + URL | After generation, get the share URL |
| `get-design-pages` | List pages in a multi-page design | Inspect generated carousel structure |
| `get-design-content` | Read text/element content of a design | Verify copy landed correctly |
| `start-editing-transaction` | Open an edit session | Before refinement |
| `perform-editing-operations` | Apply edits in batch | Adjust positions, colors, text |
| `commit-editing-transaction` | Save edit session | Lock in refinements |
| `cancel-editing-transaction` | Discard edits | Roll back if generation got worse |
| `upload-asset-from-url` | Import external image | For nano-banana generated imagery |
| `get-assets` | List uploaded brand assets | Find logo, recurring graphics |
| `export-design` | Render to PNG/JPG/PDF | Final step |
| `get-export-formats` | List available export options | Check before export |
| `resize-design` | Resize for another platform | Repurpose IG portrait → square |
| `merge-designs` | Combine designs into one | Append a CTA slide to existing deck |

When in doubt about parameter names, use `ToolSearch` with `select:mcp__claude_ai_Canva__<toolname>` to load the exact schema.

## Generation prompt template

Pass this structured prompt to `generate-design-structured`. Substitute `{{...}}` placeholders.

```
Design type: instagram_post (1080x1350)
Number of pages: {{slide_count}}
Brand kit: Fasulo Brand
Style: editorial, minimal, high-contrast, scroll-stopping social carousel

Color palette (use ONLY these):
- Primary teal: #2d6679
- Black: #0a0a0a
- White: #ffffff
- Teal tint: #e8f0f3 (subtle backgrounds only)

Typography:
- Display headlines: Fraunces 900 (variable axes soft=0, wonk=0, opsz=144), 140-180pt for cover, sentence case, tracking -2%
- Slide headlines: Fraunces 700 (variable axes soft=0, wonk=0), 72pt, sentence case, tracking -1%
- Body: Inter Regular 400, 36pt, leading 1.4
- Page numbers, captions, source attributions: JetBrains Mono Regular, 24pt, tracking +5%
- Pull quotes: Fraunces 700 Italic (soft=0, wonk=0), 56pt
- Stat numbers: Fraunces 900, 280pt, tracking -3%

Universal elements on every slide:
- Page indicator top-right, format "01 / {{slide_count}}", color matches contrast (teal on light bg, white on dark bg)
- Handle "@{{handle}}" bottom-left, same contrast rule
- 2px teal #2d6679 horizontal accent line at y=1158, only on text-heavy slides
- 96px outer padding on all sides

Background rotation:
- Slide 1: solid teal #2d6679 (cover)
- Slide {{slide_count}}: solid black #0a0a0a (CTA)
- Interior slides: alternate white and teal-tint, with one teal-bg accent slide every 3rd slide

Slide-by-slide content:

Slide 1 (cover, teal background):
  Headline (Fraunces 900, 160pt white, sentence case): {{cover_headline}}
  Subhead (Inter 400, 36pt white): {{cover_subhead}}

Slide 2 (white background):
  Statement (Fraunces 700, 56pt black): {{context_line}}

Slide 3 (white background):
  Slide number "01" (Fraunces 900, 96pt teal)
  Headline (Fraunces 700, 72pt black): {{value_1_headline}}
  Body (Inter 400, 36pt black): {{value_1_body}}

[... repeat for each value slide ...]

Slide {{slide_count}} (black background):
  Decorative teal block 200x200 with white arrow
  CTA (Fraunces 700, 72pt white): {{cta_text}}

Forbidden:
- Drop shadows (except black at 10% on the teal accent block on slide 1, optional)
- Gradients between non-brand colors
- Stock photography unless duotone-treated
- Any font other than Fraunces (display), Inter (body), JetBrains Mono (metadata)
- Specifically: no Anton, Bebas Neue, Montserrat, Poppins, Roboto, Geist, Space Grotesk, Playfair Display
- ALL CAPS headlines (Fraunces is high-contrast — sentence case carries the authority)
- Color accents in red, orange, yellow, green, magenta, or any hue not derived from teal
```

## Editing operations cookbook

After generation, common refinements via `perform-editing-operations`. The exact operation schema depends on the current Canva MCP version — load the schema with `ToolSearch` query `select:mcp__claude_ai_Canva__perform-editing-operations` and adapt these patterns.

### Pattern 1 — Replace a non-brand color globally

```json
{
  "operations": [
    {
      "type": "replace_color",
      "from": "<any non-brand hex>",
      "to": "#2d6679"
    }
  ]
}
```

Apply to every page via `target: "all_pages"` if supported, otherwise loop per-page.

### Pattern 2 — Reposition page indicator

```json
{
  "operations": [
    {
      "type": "update_element",
      "element_id": "<page_indicator_text_id>",
      "properties": {
        "x": 984,
        "y": 96,
        "anchor": "top-right",
        "font": "JetBrains Mono",
        "size": 24,
        "color": "#2d6679"
      }
    }
  ]
}
```

### Pattern 3 — Force cover headline to display size

```json
{
  "operations": [
    {
      "type": "update_text",
      "element_id": "<cover_headline_id>",
      "properties": {
        "font": "Fraunces",
        "size": 160,
        "weight": 900,
        "variation_settings": { "wght": 900, "soft": 0, "wonk": 0, "opsz": 144 },
        "tracking": -0.02,
        "color": "#ffffff",
        "transform": "none"
      }
    }
  ]
}
```

### Pattern 4 — Add accent line to a slide that's missing one

```json
{
  "operations": [
    {
      "type": "add_element",
      "element": {
        "kind": "rectangle",
        "x": 96,
        "y": 1158,
        "width": 888,
        "height": 2,
        "fill": "#2d6679"
      }
    }
  ]
}
```

### Pattern 5 — Swap a generated stock image for a duotone-treated one

1. Generate the image with Nano Banana 2 using duotone prompt suffix.
2. Upload to Canva via `upload-asset-from-url`.
3. Replace the original element:

```json
{
  "operations": [
    {
      "type": "replace_image",
      "element_id": "<image_element_id>",
      "asset_id": "<new_uploaded_asset_id>"
    }
  ]
}
```

## Verification before export

Before calling `export-design`, run a verification pass:

1. `get-design-pages` → confirm correct page count.
2. `get-design-content` for each page → confirm copy matches the approved draft (no Canva-injected lorem ipsum, no truncation).
3. Visual scan via `get-design-thumbnail` on each page → confirm no off-brand colors, page indicator present, handle present.
4. If any check fails, open another editing transaction and fix before exporting.

## Export

```json
{
  "design_id": "<design_id>",
  "format": "png",
  "pages": [1, 2, 3, 4, 5, 6, 7],
  "quality": "high"
}
```

Returns URLs for each page PNG. Download via `mcp__claude_ai_Canva__export-design` response or fetch directly. Save into a project folder structure:

```
{project-root}/carousels/{YYYY-MM-DD}-{topic-slug}/
  01-cover.png
  02-context.png
  03-value-1.png
  ...
  07-cta.png
  source.txt   ← the design URL for future edits
```

## Resizing for other platforms

To repurpose an Instagram portrait carousel as LinkedIn (1200×1500) or square (1080×1080):

```
mcp__claude_ai_Canva__resize-design
  design_id: <id>
  new_dimensions: { width: 1080, height: 1080 }
  preserve_brand: true
```

Always preview the resized version — type sizes that work at 1350 height may overflow at 1080 height. May require an editing pass to shrink headlines.

## Failure modes to watch for

| Symptom | Fix |
|---|---|
| Canva injects gradient backgrounds | `replace_color` operation, then add solid fill |
| Cover headline came out 60pt | Force 160pt via `update_text` |
| Page indicators missing on some slides | Add via `add_element` to each affected page |
| Generated stock photo with wrong colors | Replace with nano-banana duotone version |
| Off-brand teal shade (e.g., `#2c7d99`) | Global `replace_color` to exact `#2d6679` |
| Handle missing on a slide | Add via `add_element` text element bottom-left |
| Text overflows safe zone | `update_element` to constrain width to 888px |
| Too many lines of body text | Cut copy first, then resize text — never just shrink |

## When Canva MCP is unavailable

Fallback path: render slides as HTML/CSS using the `frontend-design` skill, take screenshots with the `browser` skill at exact 1080×1350 viewport, save as PNGs. The brand tokens in `assets/brand-tokens.json` are designed to be drop-in CSS custom properties:

```css
:root {
  --brand-teal: #2d6679;
  --brand-black: #0a0a0a;
  --brand-white: #ffffff;
  --brand-teal-tint: #e8f0f3;
  --pad-outer: 96px;
  --accent-y: 1158px;
}
```
