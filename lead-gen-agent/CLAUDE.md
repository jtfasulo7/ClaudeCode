# Lead Generation Agent

## Project Context
Autonomous lead gen agent for finding businesses that need AI system installation.
Target: small-to-medium businesses with low digital maturity.

## MCP Servers Available
- firecrawl: Web scraping and structured data extraction
- playwright: Browser automation for complex scraping
- (outscraper, hunter.io accessed via Python scripts in scripts/)

## Key Workflows
1. /find-leads [industry] [location] — Scrape Google Maps + directories
2. /enrich-leads [file] — Add emails, phone numbers, contact names
3. /export-leads [file] [format] — Export to CSV/JSON

## Data Schema (Every Lead Must Have)
- business_name (required)
- phone (required)
- email (best effort)
- address (required)
- city, state, zip (required)
- has_website (boolean)
- website_url (if exists)
- contact_name (best effort)
- contact_title (best effort)
- category/industry (required)
- digital_maturity_score (1-10, lower = better lead)
- source (where the data came from)
- scraped_date

## Qualification Signals (What Makes a Good Lead)
Strong signals (low digital maturity = high value lead):
- No website, or website is just a Facebook/Instagram page
- No online ordering/booking system
- Low Google review count (< 20 reviews)
- Business registered recently (< 3 years)
- Manual processes visible (e.g., "call to schedule" vs online booking)

Weak signals (already has some AI/tech):
- Has a chatbot on their website
- Uses modern booking/ordering platforms
- Active social media with automated posting
- High review count with owner responses (engaged digitally)

## Output Rules
- Always deduplicate by phone number AND address
- Verify phone numbers have correct format for the region
- Flag but don't discard leads with missing emails
- Sort output by digital_maturity_score (lowest first = best leads)

## File Organization
- Save raw scraped data to data/raw/
- Save enriched data to data/enriched/
- Save qualified/scored data to data/qualified/
- Save export-ready files to output/

## When Compacting
Always preserve: the current lead count, the search parameters,
and the list of sources already scraped.
