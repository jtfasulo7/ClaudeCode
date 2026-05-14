// One-shot generator for the 12 service detail pages.
// Run with `node scripts/generate-service-pages.js` from the project root.
// Each service produces /services/<slug>.html.

const fs = require('fs');
const path = require('path');

const services = [
  {
    slug: 'lawn-cutting',
    title: 'Weekly Lawn Cutting in Rhode Island | J.B. Landscape',
    metaDescription: 'Weekly lawn mowing, edging, and blow-down across Rhode Island. Same crew every week. Free estimates — call (401) 230-4820.',
    bg: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1800&auto=format&fit=crop',
    bgAlt: 'Freshly mowed striped lawn',
    h1: 'Weekly Lawn Cutting Across Rhode Island',
    display: 'Sharp edges. Healthy turf. <em>Same crew every week.</em>',
    lede: 'Weekly mowing, string-trimming, edging, and blow-down for residential and small commercial properties statewide.',
    intro: 'We mow at the right deck height for the season, alternate direction to avoid wear patterns, and string-trim around every bed, fence, and fixture. Hard surfaces get edged. Driveways and walkways get blown clean before we leave.',
    sections: [
      { h: 'Every visit', list: [
        'Mowing at the right deck height for the season',
        'String-trimming around beds, fences, posts',
        'Hard-edge along walks, drives, and curbs',
        'Blow-down on all hardscape surfaces',
        'Bag, mulch, or side-discharge — your call',
        'Quick walk before we leave',
      ]},
      { h: 'Seasonal extras (priced separately)', list: [
        'Spring & fall cleanups',
        'Dethatching and aeration',
        'Overseeding and lime',
        'Bed mulching and weed pull',
        'Shrub trimming and pruning',
      ]},
      { h: 'What you can expect.', body: "You don't need to be home. We text the morning of, mow within our window, and text again when we're done — usually with a photo. Pay weekly or get a monthly invoice. Cancel any time." },
    ],
  },
  {
    slug: 'tree-planting-removal',
    title: 'Tree Planting & Removal in Rhode Island | J.B. Landscape',
    metaDescription: 'Tree planting, removal, and clean-up across Rhode Island. New shade trees, ornamentals, and safe takedowns with full haul-away.',
    bg: 'https://images.unsplash.com/photo-1598335624134-5bceb5de202d?w=1800&auto=format&fit=crop',
    bgAlt: 'Crew planting a young tree',
    h1: 'Tree Planting and Removal Across Rhode Island',
    display: 'New trees in. <em>Old ones safely down.</em>',
    lede: "Plant a new shade or ornamental tree, take down what's overgrown or damaged, or trim out dead wood. We handle the haul-away.",
    intro: "We plant trees that fit your soil, sun, and yard — and remove the ones that don't anymore. Every job leaves the site cleaner than we found it.",
    sections: [
      { h: "What's included on a planting", list: [
        'Hole dug to root-ball depth, soil amendment if needed',
        'Tree set straight, stake or guy-line as required',
        'Mulch ring built around the base',
        'Watering plan reviewed before we leave',
        'All soil, sod, and packaging cleaned up',
        '30-day check-in on establishment',
      ]},
      { h: "What's included on a removal", list: [
        'Site survey for power lines, structures, drop zone',
        'Rigged takedown when needed for tight yards',
        'Stump cut flush or ground out (priced separately)',
        'All wood, brush, and debris hauled away',
        'Final rake and blow-down of the work area',
      ]},
      { h: 'Pricing.', body: 'New plantings range from $250–$600+ per tree, depending on size and species. Removals start around $400 and scale with size, access, and whether stump work is included. Always a fixed number before we touch anything.' },
    ],
  },
  {
    slug: 'bush-planting-trimming',
    title: 'Bush Planting & Trimming in Rhode Island | J.B. Landscape',
    metaDescription: 'Bush planting, shaping, and seasonal trimming across Rhode Island. New installs and existing-shrub maintenance.',
    bg: 'https://plus.unsplash.com/premium_photo-1661347888448-7c792c2d6ce8?w=1800&auto=format&fit=crop',
    bgAlt: 'Hedge trimmer shaping a green bush',
    h1: 'Bush Planting and Trimming Across Rhode Island',
    display: 'New bushes installed. <em>Old ones shaped clean.</em>',
    lede: 'New bush installs and seasonal trimming for hedges, foundation plantings, and ornamental shrubs. Shaped, fed, and ready for the season.',
    intro: 'Whether you need a new privacy hedge planted or your existing foundation bushes pruned back into shape, we handle both ends. Cuts are clean, lines are even, and the cleanup is part of the job.',
    sections: [
      { h: 'New bush installs include', list: [
        'Bed prep and soil amendment',
        'Spacing laid out to your fence or property line',
        'Bushes planted level and watered in',
        'Fresh mulch laid around each plant',
        'Nursery containers and debris cleaned up',
      ]},
      { h: 'Trimming and shaping includes', list: [
        'Hand or power trimming to match the existing shape',
        'Cuts angled for healthy regrowth',
        'Dead wood and crossing branches removed',
        'All clippings bagged and hauled away',
      ]},
      { h: 'When to trim.', body: 'Most ornamental shrubs in Rhode Island get a hard trim in early spring and a cleanup pass in late summer. Hedges may need three passes a season to keep clean lines. We’ll tell you what your yard actually needs.' },
    ],
  },
  {
    slug: 'flower-planting',
    title: 'Flower Planting in Rhode Island | J.B. Landscape',
    metaDescription: 'Annual and perennial flower planting across Rhode Island. Bed prep, planting, and a watering plan you can actually follow.',
    bg: 'https://plus.unsplash.com/premium_photo-1748437648638-0ae512e72f6d?w=1800&auto=format&fit=crop',
    bgAlt: 'Lush flower bed in full bloom against a garden wall',
    h1: 'Flower Planting Across Rhode Island',
    display: 'Seasonal color. <em>Beds prepped, planted, done.</em>',
    lede: 'Annuals, perennials, and seasonal color. Bed prep, soil amendment, planted in, and watered. One flower bed or your whole property.',
    intro: 'We plan beds that bloom across the season, not just on planting day. Plant choice gets matched to your sun, your soil, and how much maintenance you actually want to do.',
    sections: [
      { h: "What's included", list: [
        'Bed prep — weeding, edging, soil amendment',
        'Plant layout walked through with you before we plant',
        'Annuals and/or perennials planted at the right depth',
        'Fresh mulch laid around plantings',
        'Watering schedule reviewed before we leave',
      ]},
      { h: 'Plant types we work with', list: [
        'Annuals — petunias, marigolds, impatiens, begonias',
        'Perennials — hostas, daylilies, coneflowers, black-eyed susans',
        'Spring bulbs — tulips, daffodils, alliums',
        'Container gardens — porches, walkways, balconies',
      ]},
      { h: 'Pricing.', body: 'Most residential flower beds in Rhode Island run $150–$600 depending on size, plant count, and whether soil amendment is needed. Containers and balcony pots are priced per arrangement.' },
    ],
  },
  {
    slug: 'mulch-installation',
    title: 'Mulch Installation in Rhode Island | J.B. Landscape',
    metaDescription: 'Fresh mulch installation across Rhode Island. Bed edging, weed pull, and mulch laid even. Hemlock, black, natural, or playground.',
    bg: 'https://images.unsplash.com/photo-1757838661170-186930ac95db?w=1800&auto=format&fit=crop',
    bgAlt: 'Garden beds with fresh mulch around young plantings',
    h1: 'Mulch Installation Across Rhode Island',
    display: 'Sharp bed edges. <em>Fresh mulch laid even.</em>',
    lede: 'Bed edging, weed pull, and fresh mulch laid 2–3 inches deep. Hemlock, black, natural, or playground — your choice.',
    intro: 'A fresh mulch job is the fastest way to reset how a property looks. Beds get re-edged, weeds get pulled, and the mulch gets laid even — not piled up against trunks or spilling onto the lawn.',
    sections: [
      { h: "What's included", list: [
        'Hard-edge along every bed',
        'Weed pull and bed-bottom prep',
        'Fresh mulch laid 2–3 inches deep',
        'Pulled away from tree trunks (no volcanoes)',
        'Lawn and walks blown clean before we leave',
      ]},
      { h: 'Mulch types', list: [
        'Hemlock — reddish-brown, classic New England look',
        'Black — high contrast against green',
        'Natural — undyed, holds color longer than people expect',
        'Playground — softer fall, around swing sets and play areas',
      ]},
      { h: 'Pricing.', body: 'Mulch is priced by the yard delivered + labor to install. Most residential properties in Rhode Island need 3–8 yards. Fixed-price quote after a quick walk-through — no per-hour billing.' },
    ],
  },
  {
    slug: 'cobblestone-patio',
    title: 'Cobblestone Patio Installation in Rhode Island | J.B. Landscape',
    metaDescription: 'Cobblestone and paver patios in Rhode Island. Proper base, real edge restraint, built to outlast New England winters.',
    bg: 'https://images.unsplash.com/photo-1585351738365-ec1f83026513?w=1800&auto=format&fit=crop',
    bgAlt: 'Tight cobblestone surface laid in a rounded-stone pattern',
    h1: 'Cobblestone Patio Installation in Rhode Island',
    display: 'Stone-on-stone. <em>Built to outlast New England.</em>',
    lede: 'Cobblestone and paver patios on a compacted gravel base with real edge restraint. The base is the part that matters — done right, your patio stays flat for decades.',
    intro: "Most patios that fail in Rhode Island fail because the base wasn't deep enough or the edge wasn't restrained. We dig deeper than we have to, compact in lifts, and use steel or paver-edge restraint on every job.",
    sections: [
      { h: "What's included", list: [
        'Excavation to subgrade (8–10 inches typical)',
        'Geotextile fabric to prevent base migration',
        '6–8 inches of compacted crushed gravel',
        '1 inch of bedding sand',
        'Cobblestones or pavers set tight to pattern',
        'Polymeric sand swept in and activated',
        'Edge restraint installed around the perimeter',
      ]},
      { h: 'Common projects', list: [
        'Backyard patios for seating and grills',
        'Pool surrounds and pool decks',
        'Walkways from driveway to front door',
        'Stoops and stoop landings',
        'Fire pit surrounds',
      ]},
      { h: 'Pricing.', body: 'Cobblestone patios in Rhode Island typically run $25–$45 per square foot installed, depending on stone choice, base depth, and access to the site. We give you a fixed total before we start digging.' },
    ],
  },
  {
    slug: 'gravel-patio',
    title: 'Gravel Patio Installation in Rhode Island | J.B. Landscape',
    metaDescription: 'Gravel patios across Rhode Island. Fire pits, seating areas, weed-barrier base, crisp edges.',
    bg: 'https://images.unsplash.com/photo-1768791211104-7f1c5474f07d?w=1800&auto=format&fit=crop',
    bgAlt: 'Gravel patio with chairs, fire pit, and string lights',
    h1: 'Gravel Patio Installation in Rhode Island',
    display: 'Fire pits. Grills. <em>Crisp edges, compacted base.</em>',
    lede: 'Gravel patios for fire pits, seating, and casual yard space. Excavated, weed-barriered, edged, and filled with the right stone for the use.',
    intro: 'A gravel patio is the fastest way to add usable outdoor space without committing to full hardscape. Done right with a real base and edge, it stays flat and clean for years.',
    sections: [
      { h: "What's included", list: [
        'Excavation to 4–6 inches below grade',
        'Geotextile weed-barrier fabric laid in',
        'Compacted gravel base',
        'Decorative top layer (pea stone, crushed bluestone, river rock — your call)',
        'Metal or wood edging to keep stone in place',
      ]},
      { h: 'Common projects', list: [
        'Fire pit patios',
        'Grill and seating areas off the deck',
        'Side-yard pads for trash bins',
        'AC pads and equipment platforms',
        'Pathways and walking circles',
      ]},
      { h: 'Pricing.', body: 'Gravel patios in Rhode Island typically run $8–$15 per square foot installed, depending on excavation depth, stone choice, and edging type. Always priced by the project, not the hour.' },
    ],
  },
  {
    slug: 'lawn-seeding',
    title: 'Lawn Seeding & Overseeding in Rhode Island | J.B. Landscape',
    metaDescription: 'Lawn seeding and overseeding across Rhode Island. Thin-spot repair, full reseeds, soil prep, watering plan.',
    bg: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?w=1800&auto=format&fit=crop',
    bgAlt: 'Close-up of fresh green grass blades with morning dew',
    h1: 'Lawn Seeding &amp; Overseeding in Rhode Island',
    display: 'Thin spots filled. <em>Full reseeds done right.</em>',
    lede: 'Overseed thin areas or fully reseed a struggling lawn. Soil prep, starter fertilizer, the right seed for shade or sun, and a watering plan you can actually follow.',
    intro: 'The difference between a successful seeding and a wasted bag of seed is the soil prep and the first three weeks of watering. We handle both ends — and we’ll tell you honestly whether your lawn needs seed or whether it needs sod.',
    sections: [
      { h: "What's included", list: [
        'Soil test on full reseeds',
        'Dethatch or rake out dead turf',
        'Loosen top inch of soil where needed',
        'Starter fertilizer and lime if soil test calls for it',
        'Seed mix matched to your sun/shade conditions',
        'Light topdressing to hold moisture',
        'Watering schedule reviewed before we leave',
      ]},
      { h: 'When to seed.', list: [
        'Best window — late August through October',
        'Second window — early to mid-spring (more weed competition)',
        'Avoid mid-summer — too hot to germinate well',
      ]},
      { h: 'Pricing.', body: 'Overseeding starts around $300 for small yards; full reseeds depend on lot size, prep needed, and soil amendments. Fixed total before we touch the lawn.' },
    ],
  },
  {
    slug: 'sod-installation',
    title: 'Sod Roll Installation in Rhode Island | J.B. Landscape',
    metaDescription: 'Sod roll installation across Rhode Island. Grade prep, sod laid tight, rolled, and watering plan included.',
    bg: 'https://plus.unsplash.com/premium_photo-1678677942076-6e27b10ceb82?w=1800&auto=format&fit=crop',
    bgAlt: 'Landscaper laying sod rolls on a freshly graded yard',
    h1: 'Sod Roll Installation Across Rhode Island',
    display: 'Instant lawn. <em>Laid tight, rolled in, watered.</em>',
    lede: 'Grade prep, sod laid tight with staggered seams, rolled, and a watering plan to get it rooted. Same-day green lawn.',
    intro: 'Sod is the fastest way from "dirt lot" to "finished lawn" — but only if the grade prep and the first two weeks of watering are right. We do the prep, lay the sod tight, and walk you through the watering schedule.',
    sections: [
      { h: "What's included", list: [
        'Site grading to drain away from foundation',
        'Removal of debris, rocks, and old turf',
        'Starter fertilizer and lime if needed',
        'Premium-grade sod from a local farm',
        'Staggered seams, rolled tight',
        'Two-week watering schedule walked through',
      ]},
      { h: 'When to install.', list: [
        'Best windows — spring and early fall',
        'Summer install possible — but more watering required',
        'Avoid frozen ground — wait for the thaw',
      ]},
      { h: 'Pricing.', body: 'Sod runs $1.50–$3.50 per square foot installed in Rhode Island, depending on access, grade prep, and sod type. Always a fixed total before we start cutting rolls.' },
    ],
  },
  {
    slug: 'spring-cleanup',
    title: 'Spring Cleanup in Rhode Island | J.B. Landscape',
    metaDescription: 'Spring property cleanup across Rhode Island. Leaf removal, bed prep, edging, dethatching. The reset for the season.',
    bg: 'https://images.unsplash.com/photo-1634081727680-fa43e3237d5a?w=1800&auto=format&fit=crop',
    bgAlt: 'Red rake gathering a pile of leaves',
    h1: 'Spring Cleanup Across Rhode Island',
    display: 'Leaves out. Beds prepped. <em>Season-ready.</em>',
    lede: 'Leaf removal, bed prep, edging, dethatching, and a fresh start for the season. The reset that makes weekly service look great all summer.',
    intro: 'A real spring cleanup is the difference between a lawn that struggles through July and one that fills in by mid-May. We pull last year’s debris off the property and prep the beds before mulch goes down.',
    sections: [
      { h: "What's included", list: [
        'Leaf and debris pickup, lawn and beds',
        'Dead-stem cutback in perennial beds',
        'Light dethatch of the lawn surface',
        'Hard-edge along every bed and walkway',
        'Fertilizer and lime applied if needed',
        'All debris hauled away — nothing left curbside',
      ]},
      { h: 'Add-ons', list: [
        'Mulch installation (most popular pairing)',
        'Overseeding thin areas',
        'Shrub trimming',
        'Pre-emergent crabgrass treatment',
      ]},
      { h: 'When to book.', body: 'We start spring cleanups as soon as the ground thaws — typically mid-March in southern Rhode Island, early April north of Providence. Book early; the calendar fills before the snow is even gone.' },
    ],
  },
  {
    slug: 'snow-removal',
    title: 'Residential Snow Removal in Rhode Island | J.B. Landscape',
    metaDescription: 'Residential snow removal across Rhode Island. Driveways and walks plowed, shoveled, and salted. On call all winter.',
    bg: 'https://images.unsplash.com/photo-1483385573908-0a2108937c4a?w=1800&auto=format&fit=crop',
    bgAlt: 'Person shoveling a snowy residential driveway',
    h1: 'Residential Snow Removal in Rhode Island',
    display: 'Driveways and walks cleared. <em>On call all winter.</em>',
    lede: 'Driveways plowed, walks shoveled, steps salted. Same crew every storm. Seasonal contracts or per-storm pricing — your call.',
    intro: 'We run a small crew of dedicated snow rigs through the winter and stay on call for every storm. No two-day waits, no "we’ll get to you tomorrow" — driveways are cleared by morning so you can get to work.',
    sections: [
      { h: "What's included", list: [
        'Plowing — driveways, parking areas',
        'Shoveling — walks, steps, side entries',
        'Salt application — walks and stoops',
        'Push-back pass after the storm ends',
        'Text updates before and after every visit',
      ]},
      { h: 'How pricing works', list: [
        'Seasonal contracts — flat monthly rate, unlimited storms',
        'Per-storm pricing — pay only when it snows',
        'Priority routing for seasonal customers',
      ]},
      { h: 'When to sign up.', body: 'Seasonal contracts open in October and close when we hit capacity, usually by mid-November. Per-storm customers can call any time — we’ll fit you in if we have route capacity.' },
    ],
  },
  {
    slug: 'junk-removal',
    title: 'Junk & Debris Removal in Rhode Island | J.B. Landscape',
    metaDescription: 'Junk, yard debris, and construction waste removal across Rhode Island. Trucks come to you, site swept clean.',
    bg: 'https://images.unsplash.com/photo-1699947636547-4e02c34163dd?w=1800&auto=format&fit=crop',
    bgAlt: 'Cluttered storage area full of items ready for haul-away',
    h1: 'Junk &amp; Debris Removal in Rhode Island',
    display: 'Old furniture. Yard waste. <em>Hauled clean.</em>',
    lede: 'Old furniture, appliances, yard debris, and construction leftovers — hauled away in our truck, site swept clean before we leave.',
    intro: 'We bring the truck, we load it, and we sweep up after. You point at what needs to go. That’s the whole job.',
    sections: [
      { h: "What we'll take", list: [
        'Old furniture — couches, mattresses, desks',
        'Appliances — fridges, washers, dryers',
        'Yard debris — branches, brush, old fencing',
        'Construction leftovers — drywall, lumber, scrap',
        'Garage and basement cleanouts',
        'Estate cleanouts',
      ]},
      { h: "What we can't take", list: [
        'Hazardous chemicals or paint cans',
        'Tires (we can refer a local recycler)',
        'Anything that requires a permit to dispose',
      ]},
      { h: 'How pricing works.', body: 'Priced by truck load — quarter-load, half-load, three-quarter-load, full load. You’ll see the truck before we start. Fixed quote, no hidden disposal fees.' },
    ],
  },
];

// Footer service list (6 most prominent) — shared across pages
const footerServices = [
  ['Lawn Cutting', '/services/lawn-cutting'],
  ['Tree Planting & Removal', '/services/tree-planting-removal'],
  ['Mulch Installation', '/services/mulch-installation'],
  ['Cobblestone Patio', '/services/cobblestone-patio'],
  ['Spring Cleanup', '/services/spring-cleanup'],
  ['Snow Removal', '/services/snow-removal'],
];

function renderSection(s) {
  if (s.list) {
    return `    <h3>${s.h}</h3>
    <ul class="service-included">
${s.list.map(li => `      <li>${li}</li>`).join('\n')}
    </ul>`;
  }
  return `    <h3>${s.h}</h3>
    <p>${s.body}</p>`;
}

function renderPage(s) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.title}</title>
<meta name="description" content="${s.metaDescription}">
<link rel="canonical" href="https://jblandscape.com/services/${s.slug}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#2d6a3a">
<meta property="og:title" content="${s.title}">
<meta property="og:description" content="${s.metaDescription}">
<meta property="og:image" content="${s.bg}">
<meta property="og:url" content="https://jblandscape.com/services/${s.slug}">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<nav class="nav">
  <a href="/" class="brand" aria-label="J.B. Landscape home">
    <img src="/logo.png" alt="J.B. Landscape" class="brand-logo" width="160" height="160">
    <span class="brand-word">J.B. <em>Landscape</em></span>
  </a>
  <div class="nav-links">
    <a href="/#services">Services</a>
    <a href="/who-we-are">Who We Are</a>
    <a href="/#projects">Projects</a>
    <a href="/#areas">Areas</a>
    <a href="/#contact">Free Estimate</a>
    <a href="tel:+14012304820" class="nav-phone">(401) 230-4820</a>
  </div>
</nav>

<header class="service-hero">
  <div class="service-hero-bg" style="background-image:url('${s.bg}');" aria-hidden="true"></div>
  <div class="service-hero-inner">
    <a href="/#services" class="service-back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> All services</a>
    <h1 class="seo-h1">${s.h1}</h1>
    <p class="hero-display">${s.display}</p>
    <p class="lede">${s.lede}</p>
    <div class="hero-cta-row">
      <a href="/#contact" class="btn-primary">Free Estimate <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="tel:+14012304820" class="btn-ghost">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        (401) 230-4820
      </a>
    </div>
  </div>
</header>

<section class="service-body">
  <div class="service-prose">
    <h2>Overview.</h2>
    <p>${s.intro}</p>

${s.sections.map(renderSection).join('\n\n')}

    <div class="service-cta-row">
      <a href="/#contact" class="btn-primary">Get a free estimate <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      <a href="tel:+14012304820" class="btn-ghost">Call (401) 230-4820</a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="/logo.png" alt="J.B. Landscape" class="brand-logo brand-logo-lg" width="180" height="180">
      <p class="footer-tagline">Family-run landscaping serving Rhode Island and the surrounding region. Free estimates. Licensed &amp; insured.</p>
    </div>
    <div class="footer-cols">
      <div><h5>Services</h5><ul>
${footerServices.map(([n, p]) => `        <li><a href="${p}">${n}</a></li>`).join('\n')}
      </ul></div>
      <div><h5>Contact</h5><ul>
        <li><a href="tel:+14012304820">(401) 230-4820</a></li>
        <li>Providence, RI</li>
        <li>Mon–Sat, 7am–6pm</li>
      </ul></div>
      <div><h5>Company</h5><ul>
        <li><a href="/">Home</a></li>
        <li><a href="/who-we-are">Who We Are</a></li>
        <li><a href="/#process">Process</a></li>
        <li><a href="/#contact">Free Estimate</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
      </ul></div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© <span id="yr"></span> J.B. Landscape · Licensed &amp; Insured in Rhode Island · Free Estimates</p>
  </div>
</footer>
<script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>
`;
}

const outDir = path.join(__dirname, '..', 'services');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const s of services) {
  const file = path.join(outDir, `${s.slug}.html`);
  fs.writeFileSync(file, renderPage(s));
  console.log(`Wrote ${file}`);
}
