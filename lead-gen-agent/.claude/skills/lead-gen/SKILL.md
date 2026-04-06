# Lead Generation Agent — Core Skill

## Overview
Autonomous lead gen system for finding businesses that need AI system installation. Scrapes Google Maps, Yelp, Yellow Pages, and business websites to build scored lead lists with contact info.

## Architecture
```
/find-leads → lead-scraper agent → lead-enricher agent → lead-qualifier agent → CSV/JSON export
```

## Data Flow
1. **Scrape** — outscraper_fetch.py hits Google Maps API, or agents use WebSearch/WebFetch as fallback
2. **Enrich** — Scrape business websites for emails, tech signals, owner names. Hunter.io for email lookup.
3. **Qualify** — qualify_leads.py scores digital maturity (1-10), deduplicates, sorts
4. **Export** — export_csv.py outputs clean CSV or JSON to output/

## Digital Maturity Scoring
- 1-3: No website, no social, phone-only → EXCELLENT lead
- 4-6: Basic Wix/Squarespace site, minimal social → GOOD lead
- 7-10: Modern site, chatbot, booking systems → SKIP

## Key Signals to Look For
- No website (or Facebook as "website")
- Low Google review count (< 20)
- "Call to schedule" vs online booking
- Recently registered business (< 3 years)
- No chatbot, no automation tools on site

## API Keys Required
Set these as environment variables:
- `OUTSCRAPER_API_KEY` — Google Maps scraping (outscraper.com, 500 free/mo)
- `HUNTER_API_KEY` — Email finding (hunter.io, 25 free/mo)
- `FIRECRAWL_API_KEY` — Web scraping MCP (firecrawl.dev, 500 free/mo)

## Commands
- `/find-leads [industry] [location]` — Full pipeline: scrape → enrich → qualify → export
- `/enrich-leads [file]` — Enrich raw leads with emails and tech signals
- `/export-leads [file] [format]` — Export to CSV or JSON
