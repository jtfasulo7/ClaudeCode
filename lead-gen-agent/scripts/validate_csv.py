"""
CSV adapter for validate_phones.py.
Reads a CSV with a phone column, validates each number via phonevalidator.com,
and writes two CSVs: full results (with new columns appended) and mobile-only.

Usage:
    python validate_csv.py <input.csv> [--phone-col phone] [--output out.csv]

Reuses cache and API logic from validate_phones.py — re-runs are free for
numbers already checked.
"""

import os
import sys
import csv
import time
import argparse
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import validate_phones as vp


def validate_csv(input_path, output_path=None, phone_col='phone'):
    vp.load_env_file()
    if not vp.API_KEY:
        print('ERROR: PHONEVALIDATOR_API_KEY not set in environment or .env')
        sys.exit(1)

    with open(input_path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = list(reader.fieldnames or [])

    if phone_col not in fieldnames:
        print(f'ERROR: column "{phone_col}" not found. Available: {fieldnames}')
        sys.exit(1)

    cache = vp.load_cache()
    api_calls = 0
    cache_hits = 0
    no_phone = 0

    new_cols = ['phone_valid', 'phone_line_type', 'phone_carrier']
    out_fields = fieldnames + [c for c in new_cols if c not in fieldnames]

    print(f'Validating {len(rows)} rows from {input_path}...')

    for i, row in enumerate(rows, 1):
        normalized = vp.normalize_phone(row.get(phone_col))
        if not normalized:
            row['phone_valid'] = False
            row['phone_line_type'] = 'invalid'
            row['phone_carrier'] = ''
            no_phone += 1
            continue

        if normalized in cache:
            cached = cache[normalized]
            row['phone_valid'] = cached['valid']
            row['phone_line_type'] = cached['line_type'] or ''
            row['phone_carrier'] = cached['carrier'] or ''
            cache_hits += 1
            continue

        valid, line_type, carrier, raw = vp.validate_phone(normalized)
        row['phone_valid'] = valid
        row['phone_line_type'] = line_type or ''
        row['phone_carrier'] = carrier or ''

        cache[normalized] = {
            'valid': valid,
            'line_type': line_type,
            'carrier': carrier,
            'checked_at': datetime.now().isoformat(),
        }
        api_calls += 1

        if i % 10 == 0:
            vp.save_cache(cache)
            print(f'  [{i}/{len(rows)}] api={api_calls} cached={cache_hits} no_phone={no_phone}')

        time.sleep(vp.RATE_LIMIT_SECONDS)

    vp.save_cache(cache)

    mobile = sum(1 for r in rows if r.get('phone_line_type') == 'mobile')
    landline = sum(1 for r in rows if r.get('phone_line_type') == 'landline')
    voip = sum(1 for r in rows if r.get('phone_line_type') == 'voip')
    tollfree = sum(1 for r in rows if r.get('phone_line_type') == 'tollfree')
    invalid = sum(1 for r in rows if r.get('phone_valid') is False)
    unknown = sum(1 for r in rows if r.get('phone_valid') is None)

    print('\nResults:')
    print(f'  Mobile:   {mobile}')
    print(f'  Landline: {landline}')
    print(f'  VOIP:     {voip}')
    print(f'  Tollfree: {tollfree}')
    print(f'  Invalid:  {invalid}')
    print(f'  Unknown:  {unknown} (API errors — re-run to retry)')
    print(f'\nAPI calls: {api_calls}  Cache hits: {cache_hits}  Cost: ${api_calls * 0.004:.2f}')

    if not output_path:
        os.makedirs('data/validated', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f'data/validated/validated_{timestamp}.csv'

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=out_fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)

    mobile_rows = [r for r in rows if r.get('phone_line_type') == 'mobile']
    mobile_path = output_path.replace('.csv', '_mobile_only.csv')
    with open(mobile_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=out_fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(mobile_rows)

    print(f'\nFull results: {output_path}')
    print(f'Mobile-only:  {mobile_path}  ({len(mobile_rows)} rows)')
    return rows


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Validate phone numbers in a CSV')
    parser.add_argument('input', help='Input CSV path')
    parser.add_argument('--phone-col', default='phone', help='Column holding phone number (default: phone)')
    parser.add_argument('--output', help='Output CSV path (default: data/validated/validated_<ts>.csv)')
    args = parser.parse_args()
    validate_csv(args.input, args.output, args.phone_col)
