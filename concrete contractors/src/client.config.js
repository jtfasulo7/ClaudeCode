// ═══════════════════════════════════════════════════════════════════════════
//  CLIENT CONFIG  —  the ONLY file you edit per client.
// ───────────────────────────────────────────────────────────────────────────
//  To spin up a new client:
//    1. Duplicate this whole project folder.
//    2. Edit every value below for the new client.
//    3. Drop the client's photos into  public/photos/  and list them in
//       projectPhotos.
//    4. Paste the client's GHL calendar embed URL + inbound-webhook URL.
//    5. Deploy. Nothing client-specific is hardcoded anywhere else.
//
//  The values below are PLACEHOLDER demo data so the template renders on its
//  own. Anything with REPLACE_ME must be swapped before going live.
// ═══════════════════════════════════════════════════════════════════════════

export const config = {
  // ── Identity ──────────────────────────────────────────────────────────────
  businessName:    'Summit Concrete & Paving',
  city:            'Springfield',
  serviceArea:     'Greater Springfield',
  yearEstablished: 2009,

  // ── Trust signals (licenseNumber optional — set to '' to hide it) ─────────
  googleRating:  4.9,
  reviewCount:   127,
  licenseNumber: 'Lic. #CC-100482',

  // ── Contact ───────────────────────────────────────────────────────────────
  phone: '(555) 123-4567',            // tracked number — shown + tel: linked

  // ── Reviews (2–3 shown in the reviews section) ────────────────────────────
  reviews: [
    {
      stars: 5,
      text: 'They poured a new driveway and stamped patio for us. Crew showed up on time, cleaned up every day, and the finish is flawless. Quote was exactly what they charged.',
      name: 'Maria O.',
    },
    {
      stars: 5,
      text: 'Got three estimates — Summit was the only one who actually measured and explained the base prep. No pressure at all. Two weeks later the job was done right.',
      name: 'Dev P.',
    },
    {
      stars: 5,
      text: 'Replaced a cracked walkway and steps that two other companies wouldn’t touch. Fair price, real communication, and it looks better than the original.',
      name: 'Karen L.',
    },
  ],

  // ── Proof photos (drop files in public/photos/, reference by /photos/...) ──
  projectPhotos: [
    '/photos/work-1.svg',
    '/photos/work-2.svg',
    '/photos/work-3.svg',
    '/photos/work-4.svg',
  ],

  // ── GHL wiring ────────────────────────────────────────────────────────────
  // The client's booking calendar (LeadConnector widget embed URL):
  ghlCalendarEmbedUrl: 'https://api.leadconnectorhq.com/widget/booking/REPLACE_ME',
  // Where the Step-4 lead payload is POSTed (GHL inbound webhook, or any
  // endpoint that accepts a JSON body). This fires BEFORE the calendar loads,
  // so the lead is captured even if the visitor never books.
  ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/REPLACE_ME',

  // ── Per-client theming (restyles buttons/accents only — never layout) ─────
  primaryColor: '#b8532a',            // primary action / brand accent
  accentColor:  '#1f6f5c',            // secondary accent (checks, highlights)

  // ── Branding ──────────────────────────────────────────────────────────────
  logoPath: '/logo-placeholder.svg',
}
