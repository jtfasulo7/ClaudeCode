/**
 * Where a lead actually came from.
 *
 * WHY THIS EXISTS. On 2026-09-11 the CRM recorded three form submissions and
 * Meta attributed one. The ad had delivered four landing page views that day,
 * so "three of those four converted" was not a credible reading — most of
 * those people arrived by some path Meta was not watching. Nobody could say
 * which, because every contact was written with the same hardcoded
 * `source: "Website — Montara Forge landing page"` and nothing else. The
 * question was unanswerable from the data, so it got answered with theories.
 *
 * This module records the answer at the only moment it is knowable: the first
 * page view of the visit, before any navigation has thrown the referrer away.
 *
 * FIRST TOUCH, NOT LAST. The value is written once per browser session and
 * then left alone. A visitor who lands from an ad, opens the gallery, comes
 * back and submits must still read as an ad click — re-reading the referrer at
 * submit time would show the site's own URL and quietly relabel every paid
 * lead as direct.
 *
 * sessionStorage rather than localStorage: attribution belongs to THIS visit.
 * A localStorage value would still be claiming credit for the ad a fortnight
 * after the click.
 */

const KEY = "mf_attribution_v1";

/** Query parameters worth keeping. Anything else is noise or someone else's tracking. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export interface Attribution {
  /** Meta's click id. Present ONLY on a real click from a Facebook or Instagram ad. */
  fbclid?: string;
  /** Google's equivalent, in case search ads ever run. */
  gclid?: string;
  utm?: Partial<Record<(typeof UTM_KEYS)[number], string>>;
  /** The full referring URL, or "" for a direct arrival. */
  referrer?: string;
  /** Path they landed on, so a future second landing page is distinguishable. */
  landingPath?: string;
  /** ISO timestamp of the first page view of the visit. */
  firstSeen?: string;
  /** One-word verdict — see classify(). */
  channel?: Channel;
}

export type Channel =
  | "meta-paid"
  | "meta-organic"
  | "search"
  | "referral"
  | "direct"
  | "unknown";

const META_HOSTS = /(^|\.)(facebook|instagram|fb|messenger|threads)\.(com|me|net)$/i;
const SEARCH_HOSTS = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave)\./i;

/**
 * The single most useful field, and the one the owner will actually read.
 *
 * The distinction that matters here is meta-paid vs meta-organic. The ad is
 * also a real page post — it has been shared and saved — so a click can come
 * from the post without being a click on the ad. Meta credits only the first
 * kind. `fbclid` is what separates them: Meta appends it to ad clicks and not
 * to organic ones.
 */
export function classify(a: Attribution): Channel {
  if (a.fbclid) return "meta-paid";

  const utmSource = a.utm?.utm_source?.toLowerCase() ?? "";
  if (utmSource) {
    if (/facebook|instagram|meta|ig|fb/.test(utmSource)) {
      // Tagged as Meta but with no click id: an organic post click, or a tag
      // someone applied by hand.
      return /paid|cpc|ppc/.test(a.utm?.utm_medium?.toLowerCase() ?? "")
        ? "meta-paid"
        : "meta-organic";
    }
    if (/google|bing|search/.test(utmSource)) return "search";
    return "referral";
  }

  const ref = a.referrer ?? "";
  if (!ref) return "direct";
  let host = "";
  try {
    host = new URL(ref).hostname;
  } catch {
    return "unknown";
  }
  if (META_HOSTS.test(host)) return "meta-organic";
  if (SEARCH_HOSTS.test(host)) return "search";
  return "referral";
}

/** Reads the current URL and referrer. Browser only. */
function capture(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const take = (k: string) => (params.get(k) || "").trim().slice(0, 300) || undefined;

  const utm: Attribution["utm"] = {};
  for (const k of UTM_KEYS) {
    const v = take(k);
    if (v) utm[k] = v;
  }

  const a: Attribution = {
    fbclid: take("fbclid"),
    gclid: take("gclid"),
    ...(Object.keys(utm).length ? { utm } : {}),
    // Truncated: a referrer can carry a very long query string, and only the
    // origin and path are ever read.
    referrer: (document.referrer || "").slice(0, 500),
    landingPath: window.location.pathname.slice(0, 200),
    firstSeen: new Date().toISOString(),
  };
  a.channel = classify(a);
  return a;
}

/**
 * Records the visit's attribution if it has not been recorded already, and
 * returns it. Safe to call on every page view.
 *
 * Every storage access is wrapped: sessionStorage throws outright in some
 * privacy modes, and losing attribution must never cost the lead itself.
 */
export function rememberAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.sessionStorage.getItem(KEY);
    if (existing) return JSON.parse(existing) as Attribution;
  } catch {
    // Unreadable storage: fall through and capture fresh. Worst case the value
    // is recomputed per page view, which is still right on the landing page.
  }

  const a = capture();
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* Private mode, or storage disabled. The return value is still correct. */
  }
  return a;
}

/** What was recorded for this visit, without recording anything new. */
export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    /* ignored */
  }
  // Not stored yet — the form may be on the landing page itself.
  try {
    return capture();
  } catch {
    return null;
  }
}

/** A short human-readable line for the CRM note. */
export function describe(a: Attribution): string {
  const bits: string[] = [];
  bits.push(`Channel: ${a.channel ?? "unknown"}`);
  if (a.fbclid) bits.push("Meta click id: present");
  if (a.utm && Object.keys(a.utm).length) {
    bits.push(
      "UTM: " +
        UTM_KEYS.filter((k) => a.utm?.[k])
          .map((k) => `${k.replace("utm_", "")}=${a.utm?.[k]}`)
          .join(", "),
    );
  }
  bits.push(`Referrer: ${a.referrer ? a.referrer : "(none — direct)"}`);
  if (a.landingPath && a.landingPath !== "/") bits.push(`Landed on: ${a.landingPath}`);
  if (a.firstSeen) bits.push(`First seen: ${a.firstSeen}`);
  return bits.join("\n");
}
