---
description: Find business leads by industry and location
argument-hint: [industry] [location] [radius_miles]
---

Find leads for the following search: $ARGUMENTS

Parse the arguments:
- First argument = industry/business type
- Second argument = location (city, state or ZIP)
- Third argument = radius in miles (default 25)

## Execution Plan

1. **Scrape** — Launch the lead-scraper agent to gather raw business data from Google Maps, Yelp, and Yellow Pages for the given industry and location.

2. **Enrich** — Pass raw results to the lead-enricher agent to add emails, contact names, technology signals, and digital maturity scores.

3. **Qualify** — Run the lead-qualifier agent to score, deduplicate, and sort all leads.

4. **Export** — Save the final lead list to output/ as both CSV and JSON.

## Output Summary
After completion, display:
- Total leads found
- Breakdown by digital maturity score (1-3: excellent, 4-6: good, 7-10: skip)
- Top 20 leads with name, phone, email, score, and qualification notes
- File paths to the exported CSV and JSON
