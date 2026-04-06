"""
Outscraper Google Maps Scraper
Fetches business listings from Google Maps by industry and location.
Requires OUTSCRAPER_API_KEY environment variable.
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse
from datetime import datetime


API_KEY = os.environ.get('OUTSCRAPER_API_KEY', '')
BASE_URL = 'https://api.app.outscraper.com/maps/search-v3'


def fetch_leads(industry, location, limit=100):
    if not API_KEY:
        print('ERROR: OUTSCRAPER_API_KEY not set. Get a free key at outscraper.com')
        sys.exit(1)

    query = f'{industry} in {location}'
    params = urllib.parse.urlencode({
        'query': query,
        'limit': limit,
        'async': 'false',
        'fields': ','.join([
            'name', 'full_address', 'city', 'state', 'postal_code',
            'phone', 'site', 'type', 'rating', 'reviews',
            'working_hours', 'facebook', 'instagram'
        ])
    })

    url = f'{BASE_URL}?{params}'
    req = urllib.request.Request(url, headers={
        'X-API-KEY': API_KEY,
        'Accept': 'application/json'
    })

    print(f'Searching: "{query}" (limit: {limit})')

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f'ERROR: API request failed: {e}')
        sys.exit(1)

    results = data.get('data', [[]])[0] if isinstance(data.get('data'), list) else []

    leads = []
    for biz in results:
        if not biz.get('name'):
            continue

        site = biz.get('site', '') or ''
        has_website = bool(site) and 'facebook.com' not in site and 'instagram.com' not in site

        leads.append({
            'business_name': biz.get('name', ''),
            'phone': biz.get('phone', ''),
            'email': None,
            'address': biz.get('full_address', ''),
            'city': biz.get('city', ''),
            'state': biz.get('state', ''),
            'zip': biz.get('postal_code', ''),
            'has_website': has_website,
            'website_url': site if has_website else None,
            'facebook_url': biz.get('facebook', '') or site if 'facebook.com' in site else None,
            'contact_name': None,
            'contact_title': None,
            'category': biz.get('type', ''),
            'rating': biz.get('rating', None),
            'review_count': biz.get('reviews', 0),
            'digital_maturity_score': None,
            'source': 'google_maps_outscraper',
            'scraped_date': datetime.now().isoformat(),
        })

    return leads


def save_results(leads, industry, location):
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    slug = f"{industry.replace(' ', '_')}_{location.replace(' ', '_').replace(',', '')}"
    filename = f"data/raw/{slug}_{timestamp}.json"

    os.makedirs('data/raw', exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(leads, f, indent=2)

    print(f'Saved {len(leads)} leads to {filename}')
    return filename


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Fetch leads from Google Maps via Outscraper')
    parser.add_argument('--industry', required=True, help='Business type/industry to search')
    parser.add_argument('--location', required=True, help='City, state or ZIP code')
    parser.add_argument('--limit', type=int, default=100, help='Max results per search (default 100)')
    args = parser.parse_args()

    leads = fetch_leads(args.industry, args.location, args.limit)
    if leads:
        save_results(leads, args.industry, args.location)
    else:
        print('No leads found.')
