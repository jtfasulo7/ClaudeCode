# Peps by Dave — website

Static site for the Peps by Dave community. Three pages, no build step, no
dependencies: `index.html`, `terms.html`, `privacy-policy.html`.

## Deploying

Its **own Vercel project**, root directory `peps-by-dave`, on its own
`*.vercel.app` URL. It is not part of jtfasulo.com and does not need a custom
domain to work — every link on the site is root-relative (`/terms`,
`/privacy-policy`, `/media/...`), so it is correct on whatever hostname Vercel
gives it. A custom domain can be added later without touching the markup.

> **Turn the Build and Install Command overrides OFF.** A new Vercel project
> created from this monorepo inherits the repo-root `vercel.json`, which builds
> `jtfasulo-website`. Left on, this project deploys the wrong site. Switch them
> off, then push a real change — Vercel does not always rebuild on a settings
> change alone.

`cleanUrls` is on, so the pages serve at `/`, `/terms` and `/privacy-policy`.
Those paths are what the legal links and the TikTok app submission point at, so
do not rename the files.

## The design system

Every page shares one set of decisions. That shared restraint is the design —
a page reads expensive when nothing on it is arbitrary, and cheap the moment
two things disagree for no reason.

**Type.** `Fraunces` for display, `Manrope` for everything else. Both variable,
both from Google Fonts, one request.

- **`opsz` is the whole point of Fraunces.** Its optical-size axis is pushed to
  144 at headline sizes and dropped to 40–60 for smaller headings. The same
  font at `opsz 14` is a duller typeface — the thick/thin contrast that makes
  the hero look typeset rather than typed only exists at the top of that axis.
- **`WONK` is pinned to 0.** The playful axis undercuts a page whose subject is
  reading research honestly.
- **Inter was removed deliberately.** It is the default that makes a page look
  generated rather than designed.

**Scale.** Six fluid steps (`--step--1` … `--step-4`), each a `clamp()` on the
same ratio. Nothing on any page sets a font size outside them.

**Motion.** One easing curve, `--ease: cubic-bezier(.22,1,.36,1)`, on
everything. Mixed curves read as several hands at work, which is most of what
separates "smooth" from "silky".

- The hero plays **on load** with staggered delays — an orchestrated entrance
  rather than a scroll reveal that has already finished before anyone sees it.
  The headline animates line by line out of `overflow:hidden` wrappers.
- Everything below plays on scroll via `IntersectionObserver`, and each section
  is **unobserved once it fires**. Nothing keeps watching what has already run.
- **Only `transform` and `opacity` are ever animated.** Both composite. Nothing
  animates `box-shadow`, `filter` or `backdrop-filter` — those three are what
  turn a reveal into a stutter, and the nav's `backdrop-filter` is on an
  element that never moves.
- `prefers-reduced-motion` collapses every duration to `.001ms` and lands the
  reveal elements at their final state rather than leaving them invisible.

**The cards are cards on purpose, and none of it is default.** "What’s inside"
went index, then back to cards by decision. What made the FIRST set of cards
read as stock was every value being a default: a 14px radius, 1.3rem of
padding, one flat fill, an even 1px border, a small literal icon above the
heading, and `auto-fit minmax` choosing the columns. The current set changes
each of those deliberately:

- **Light has a direction.** A gradient runs down the surface and the TOP edge
  is lit while the other three stay dark. A flat fill inside an even border is
  a rectangle; this reads as a panel with something above it.
- **Padding is roughly doubled.** Cramped padding is the clearest tell of a
  cheap card, and space is the cheapest luxury on the page.
- **The icon is a watermark**, large and faint and bled off the corner, not a
  badge above the heading.
- **The category label is the utility half.** Four cards of prose get read in
  order; four labelled cards get scanned, which is what someone deciding
  whether to join is actually doing.
- **Two explicit columns, never `auto-fit`** — the layout is chosen rather
  than derived from the viewport.

Hover fades a pseudo-element and translates the card. **Do not move the gold
wash onto the card’s own `background` or animate its `box-shadow`** — those
repaint every frame, where opacity and transform composite.

**Grain.** A fixed, pointer-inert `feTurbulence` layer at ~3% over both page
types. On a near-black ground a flat fill reads as an empty canvas; grain gives
it a surface. It is static, so it composites once and costs nothing per frame.

**The legal pages share all of it.** They were plainer than the front page,
which is its own kind of tell on a site a platform reviewer reads. Restyling
them changed **presentation only** — the text of both documents is byte-for-byte
what it was, and must stay that way unless the change is a deliberate legal one.

## Where the join lives

Three touchpoints, and each is placed for a reason:

1. **The sticky nav.** The only persistent one. Below 560px the two section
   links are hidden and the button is kept — losing a shortcut to a section
   costs a scroll, losing the join costs the visit.
2. **The hero**, at `.btn-lg`. Its neighbour "See what’s inside" is a quiet
   borderless link on purpose: it points at a section on this same page, so it
   has no business competing with the button that leaves for the community.
3. **The closing band**, which is a panel rather than a loose button. It sits
   directly under the medical disclaimer, and anything unframed placed after a
   wall of caveats reads as a footnote to them.

The sheen sweep belongs to `.btn-primary` and nothing else, so the gold is the
only thing on the page that moves that way.

## The research list is real, and has to stay real

`#studies` carries five citations, each linking to PubMed. **Every one was
resolved against PubMed’s own API** — author, journal, year and title read back
from the record rather than recalled — and every link was followed to confirm
it loads. On a page whose whole argument is that you should not take claims on
trust, an invented citation is the worst thing that could be published.

**If you add a row, verify it the same way.** Do not write a citation from
memory, and do not link a publisher page when the abstract is paywalled —
PubMed is free to read, which is the point of listing it at all.

The five disagree with each other on purpose: three large trials, one peptide
approved for a single narrow indication, and BPC-157, whose systematic review
found 35 preclinical studies against one clinical. That last row is the section
working — it shows a peptide can be everywhere online and still have almost no
human evidence. Keep a row like it if the list ever changes.

| PMID | Peptide |
|---|---|
| 37366315 | Retatrutide, NEJM 2023, phase 2 |
| 35658024 | Tirzepatide, NEJM 2022, SURMOUNT-1 |
| 33567185 | Semaglutide, NEJM 2021, STEP 1 |
| 41545261 | Tesamorelin, Obes Res Clin Pract 2026 |
| 40756949 | BPC-157, HSS J 2025, systematic review |

The standing note under the list says that listing a study is not a
recommendation. Keep it.

## Two things not to undo

**The headline lines have padding that looks wrong and is not.** Each line sits
in an `overflow:hidden` wrapper so it can slide up on load. That clip box is
only as tall as the line box, and at `line-height:1.02` it lands just under the
baseline, shaving the descenders off — the p in "peptide", the y in
"yourself". `.ln` therefore carries `padding-bottom:.36em` with an equal
negative margin: the box opens below the baseline, the space is given straight
back, and every gap on the page is unchanged. The .36em is measured, not
guessed — the ink of this face drops .225em below the baseline roman and
.238em italic. **If you remove the padding the descenders get cut again, and if
you change it, change the 145% offset in `@keyframes lineIn` too** — that
offset exists to clear the taller box, and at 105% the tops of the glyphs sit
visible inside the padding before the reveal runs.

**The disclaimer is not written for tone.** Every other line of copy on the page
was rewritten to sound like a person rather than a generator. The three
paragraphs inside `.notice` were deliberately left alone. They are the one
place where being plain and repetitive beats being well written, and this is a
health-adjacent business.

## The details, as published

| | |
|---|---|
| Legal entity | Sybago LLC |
| Notice address | 116 W 9th St, Wilmington, DE 19801 |
| Contact | pepsbydave@gmail.com |
| Governing law | the State of Delaware |
| Effective date | September 7, 2026 |
| Join link | https://www.skool.com/pepsbydave-3539/about |

**Delaware because the entity is a Delaware LLC** — the Wilmington address is a
registered-agent one, so its home jurisdiction is the natural governing law. If
Sybago LLC is actually operated from another state, a lawyer may prefer that
state instead; it is a one-line change in Terms §13.

The date is spelled out rather than written 9/7/2026, which is September to one
reader and July to another.

## Nothing states a price

By decision, no page says the community is free OR paid. The site refers to
joining and nothing else; Terms §4 says membership is managed on Skool and
defers any charges, renewal and cancellation to whatever is shown at the point
of joining. That is true either way, so it cannot go stale if the model
changes.

If a price is ever stated on the site, it has to be stated in Terms §4 too.

## These are drafts, not legal advice

They are written to be honest and readable, and they cover what the business
actually does. They have **not** been reviewed by a lawyer, and this is a
health-adjacent business in a regulated area — get them looked at before
relying on them.

Two points worth raising with whoever reviews them:

1. **Anything involving vendor access.** If the community connects members to
   suppliers in any way, that is the highest-risk part of the whole operation
   and is not currently described in either document, because how it works has
   not been established. It cannot be left undescribed if it happens.
2. **The medical disclaimer.** It is deliberately prominent and repeated. Resist
   the urge to soften it for tone.

## The social publishing section

Both documents describe the internal tool that posts to the business's own
social accounts:

- `terms.html` §7 — what it does, that it posts only our own content to our own
  accounts, and that platform rules apply.
- `privacy-policy.html` §4 — what it stores (encrypted account tokens), what it
  reads from each platform, that video frames go to Anthropic for caption
  drafting, and that nothing publishes without a person pressing publish.

**These are the URLs the TikTok app review points at.** They describe the tool
built in `../sybago-website` (`lib/social/`, `api/social-publish.js`,
`api/tiktok-auth.js`). If that tool changes what it stores or who it sends data
to, these two sections have to change with it — a privacy policy that describes
last month's behaviour is worse than none.
