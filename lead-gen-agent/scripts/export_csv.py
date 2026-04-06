"""
Lead Export Utility
Converts qualified lead JSON to clean CSV or JSON for outreach.
"""

import csv
import json
import sys
import os
from datetime import datetime


CSV_HEADERS = [
    'business_name', 'phone', 'email', 'address', 'city', 'state', 'zip',
    'has_website', 'website_url', 'contact_name', 'contact_title',
    'category', 'rating', 'review_count', 'digital_maturity_score',
    'qualification_notes', 'source', 'scraped_date'
]


def export_leads(input_path, output_format='csv', output_path=None):
    with open(input_path, 'r') as f:
        leads = json.load(f)

    if not output_path:
        os.makedirs('output', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        ext = output_format
        output_path = f'output/leads_{timestamp}.{ext}'

    if output_format == 'csv':
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS, extrasaction='ignore')
            writer.writeheader()
            for lead in leads:
                writer.writerow(lead)
    else:
        with open(output_path, 'w') as f:
            json.dump(leads, f, indent=2)

    print(f'Exported {len(leads)} leads to {output_path}')

    # Preview
    print(f'\nPreview (first 5):')
    print(f"{'Name':<30} {'Phone':<16} {'Score':<6} {'Email':<30}")
    print('-' * 82)
    for lead in leads[:5]:
        name = (lead.get('business_name', '') or '')[:28]
        phone = lead.get('phone', '') or 'N/A'
        score = lead.get('digital_maturity_score', '?')
        email = (lead.get('email', '') or 'N/A')[:28]
        print(f'{name:<30} {phone:<16} {score:<6} {email:<30}')

    return output_path


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python export_csv.py <input_file> [csv|json] [output_file]')
        sys.exit(1)

    input_file = sys.argv[1]
    fmt = sys.argv[2] if len(sys.argv) > 2 else 'csv'
    out = sys.argv[3] if len(sys.argv) > 3 else None
    export_leads(input_file, fmt, out)
