"""
Phone Number Validator (phonevalidator.com — v4 "basic" / Line Type Basic API)
Checks scraped leads for valid mobile numbers before qualification.
Requires PHONEVALIDATOR_API_KEY environment variable.

Cost: $0.004 per lookup. Cached in data/phone_cache.json.

Usage:
    python validate_phones.py <input_file.json> [output_file.json]

Adds to each lead:
    phone_valid       : True | False | None (None = API error / unknown)
    phone_line_type   : "mobile" | "landline" | "voip" | "tollfree" | "invalid" | None
    phone_carrier     : str | None  (from PhoneBasic.PhoneCompany)
    phone_raw_response: dict (raw API response — only on fresh lookups)
"""

import os
import re
import sys
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime


API_KEY = os.environ.get('PHONEVALIDATOR_API_KEY', '')
API_URL = 'https://api.phonevalidator.com/api/v4/phonesearch'
API_REGION = '2'  # 1=worldwide, 2=US/Canada, 3=outside US/Canada
CACHE_PATH = 'data/phone_cache.json'
RATE_LIMIT_SECONDS = 0.25


def load_env_file():
    """Load .env from the lead-gen-agent root if API_KEY not already set."""
    global API_KEY
    if API_KEY:
        return
    here = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(os.path.dirname(here), '.env')
    if not os.path.exists(env_path):
        return
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            if k.strip() == 'PHONEVALIDATOR_API_KEY':
                API_KEY = v.strip()
                return


def normalize_phone(phone):
    """Strip to digits, drop leading 1 for US numbers, return 10-digit string or None."""
    if not phone:
        return None
    digits = re.sub(r'\D', '', str(phone))
    if len(digits) == 11 and digits.startswith('1'):
        digits = digits[1:]
    if len(digits) != 10:
        return None
    return digits


def load_cache():
    if not os.path.exists(CACHE_PATH):
        return {}
    try:
        with open(CACHE_PATH, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def save_cache(cache):
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, 'w') as f:
        json.dump(cache, f, indent=2)


def normalize_line_type(raw_line_type):
    """Map phonevalidator's LineType strings to our canonical values."""
    if not raw_line_type:
        return None
    s = str(raw_line_type).strip().upper()
    if 'CELL' in s or 'MOBILE' in s or 'WIRELESS' in s:
        return 'mobile'
    if 'LANDLINE' in s:
        return 'landline'
    if 'VOIP' in s:
        return 'voip'
    if 'TOLL' in s:
        return 'tollfree'
    if 'FAKE' in s or 'UNKNOWN' in s or 'INVALID' in s:
        return 'invalid'
    return None


def validate_phone(phone_digits):
    """Call phonevalidator v4 basic API. Returns (valid, line_type, carrier, raw_response)."""
    params = urllib.parse.urlencode({
        'apikey': API_KEY,
        'phone': phone_digits,
        'type': 'basic',
        'region': API_REGION,
    })
    url = f'{API_URL}?{params}'

    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            raw = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return None, None, None, {'error': f'HTTP {e.code}', 'body': e.read().decode(errors='replace')[:500]}
    except Exception as e:
        return None, None, None, {'error': str(e)}

    status = str(raw.get('StatusCode', ''))
    if status != '200':
        return None, None, None, raw

    basic = raw.get('PhoneBasic') or {}
    line_type = normalize_line_type(basic.get('LineType'))
    carrier = basic.get('PhoneCompany') or None
    is_fake = str(basic.get('FakeNumber', '')).strip().upper() == 'YES'

    if is_fake:
        line_type = 'invalid'

    valid = line_type is not None and line_type != 'invalid'
    return valid, line_type, carrier, raw


def validate_file(input_path, output_path=None):
    if not API_KEY:
        print('ERROR: PHONEVALIDATOR_API_KEY not set in environment or .env')
        sys.exit(1)

    with open(input_path, 'r') as f:
        leads = json.load(f)

    cache = load_cache()
    api_calls = 0
    cache_hits = 0
    no_phone = 0

    print(f'Validating phones for {len(leads)} leads...')

    for i, lead in enumerate(leads, 1):
        normalized = normalize_phone(lead.get('phone'))
        if not normalized:
            lead['phone_valid'] = False
            lead['phone_line_type'] = 'invalid'
            lead['phone_carrier'] = None
            no_phone += 1
            continue

        if normalized in cache:
            cached = cache[normalized]
            lead['phone_valid'] = cached['valid']
            lead['phone_line_type'] = cached['line_type']
            lead['phone_carrier'] = cached['carrier']
            cache_hits += 1
            continue

        valid, line_type, carrier, raw = validate_phone(normalized)
        lead['phone_valid'] = valid
        lead['phone_line_type'] = line_type
        lead['phone_carrier'] = carrier
        lead['phone_raw_response'] = raw

        cache[normalized] = {
            'valid': valid,
            'line_type': line_type,
            'carrier': carrier,
            'checked_at': datetime.now().isoformat(),
        }
        api_calls += 1

        if i % 10 == 0:
            save_cache(cache)
            print(f'  [{i}/{len(leads)}] {api_calls} API calls, {cache_hits} cached, {no_phone} no-phone')

        time.sleep(RATE_LIMIT_SECONDS)

    save_cache(cache)

    mobile = sum(1 for l in leads if l.get('phone_line_type') == 'mobile')
    landline = sum(1 for l in leads if l.get('phone_line_type') == 'landline')
    voip = sum(1 for l in leads if l.get('phone_line_type') == 'voip')
    invalid = sum(1 for l in leads if l.get('phone_valid') is False)
    unknown = sum(1 for l in leads if l.get('phone_valid') is None)

    print(f'\nResults:')
    print(f'  Mobile:   {mobile}')
    print(f'  Landline: {landline}')
    print(f'  VOIP:     {voip}')
    print(f'  Invalid:  {invalid}')
    print(f'  Unknown:  {unknown} (API errors — re-run to retry)')
    print(f'\nAPI calls: {api_calls}  Cache hits: {cache_hits}')

    if not output_path:
        os.makedirs('data/validated', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f'data/validated/validated_{timestamp}.json'

    with open(output_path, 'w') as f:
        json.dump(leads, f, indent=2)

    print(f'\nSaved to {output_path}')
    return leads


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python validate_phones.py <input_file> [output_file]')
        sys.exit(1)

    load_env_file()
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    validate_file(input_file, output_file)
