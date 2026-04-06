---
description: Export qualified leads to CSV or JSON
argument-hint: [file_path] [format:csv|json]
---

Export leads from: $ARGUMENTS

If no file path provided, use the most recent file in data/qualified/.
Default format is CSV.

1. Read the qualified lead data
2. Format into clean CSV or JSON with proper headers
3. Save to output/ with a descriptive filename: {industry}_{location}_{date}.{format}
4. Display the file path and a preview of the first 10 rows
