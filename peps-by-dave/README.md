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

**The index, not a card grid.** "What's inside" is an editorial index: title
against description, separated by hairline rules. Four bordered boxes in an
`auto-fit minmax` grid is the single most recognisable generated-page shape
there is; an index reads as edited instead.

It carried 0# numbers at first, and they were removed by decision. They had
been doing two jobs — sequence, and a left gutter that set the alignment — so
removing the markup alone would have left that gutter behind as an empty
column. The grid closed to two columns, the hover nudge moved from the number
to the title, and index titles now hang off the same left edge as the section
heading above them, which is what the numbers had been doing.

**Grain.** A fixed, pointer-inert `feTurbulence` layer at ~3% over both page
types. On a near-black ground a flat fill reads as an empty canvas; grain gives
it a surface. It is static, so it composites once and costs nothing per frame.

**The legal pages share all of it.** They were plainer than the front page,
which is its own kind of tell on a site a platform reviewer reads. Restyling
them changed **presentation only** — the text of both documents is byte-for-byte
what it was, and must stay that way unless the change is a deliberate legal one.

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
