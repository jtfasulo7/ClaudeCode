"""
Hunter.io Email Finder
Looks up email addresses for a given domain.
Requires HUNTER_API_KEY environment variable.
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse


API_KEY = os.environ.get('HUNTER_API_KEY', '')


def find_emails(domain):
    if not API_KEY:
        print('ERROR: HUNTER_API_KEY not set. Get a free key at hunter.io')
        sys.exit(1)

    params = urllib.parse.urlencode({
        'domain': domain,
        'api_key': API_KEY,
    })
    url = f'https://api.hunter.io/v2/domain-search?{params}'

    print(f'Looking up emails for: {domain}')

    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f'ERROR: {e}')
        return []

    emails_data = data.get('data', {}).get('emails', [])
    results = []
    for entry in emails_data:
        results.append({
            'email': entry.get('value', ''),
            'first_name': entry.get('first_name', ''),
            'last_name': entry.get('last_name', ''),
            'position': entry.get('position', ''),
            'confidence': entry.get('confidence', 0),
            'type': entry.get('type', ''),
        })

    return results


def verify_email(email):
    if not API_KEY:
        return None

    params = urllib.parse.urlencode({
        'email': email,
        'api_key': API_KEY,
    })
    url = f'https://api.hunter.io/v2/email-verifier?{params}'

    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.loads(resp.read().decode())
        return data.get('data', {}).get('result', 'unknown')
    except Exception:
        return 'unknown'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Find emails for a domain via Hunter.io')
    parser.add_argument('--domain', required=True, help='Domain to search (e.g., example.com)')
    parser.add_argument('--verify', action='store_true', help='Verify found emails')
    args = parser.parse_args()

    emails = find_emails(args.domain)
    if emails:
        for e in emails:
            status = ''
            if args.verify:
                result = verify_email(e['email'])
                status = f' [{result}]'
            print(f"  {e['email']} - {e['first_name']} {e['last_name']} ({e['position']}) confidence: {e['confidence']}%{status}")
        print(json.dumps(emails, indent=2))
    else:
        print('No emails found.')
