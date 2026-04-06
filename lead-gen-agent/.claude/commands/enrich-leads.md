---
description: Enrich existing raw leads with emails, contacts, and tech signals
argument-hint: [file_path]
---

Enrich the raw lead file at: $ARGUMENTS

If no file path is provided, look for the most recent file in data/raw/ and use that.

1. Read the raw lead JSON file
2. Launch the lead-enricher agent to add emails, contact names, website tech signals, and digital maturity scores
3. Save enriched results to data/enriched/
4. Display a summary: how many leads enriched, emails found, score distribution
