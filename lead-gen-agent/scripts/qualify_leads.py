"""
Lead Qualification & Scoring
Takes enriched leads and assigns digital maturity scores.
"""

import json
import sys
import os
from datetime import datetime


def score_lead(lead):
    """Calculate digital maturity score (1-10, lower = better lead)."""
    score = 5  # Start neutral

    # Website signals
    if not lead.get('has_website'):
        score -= 3  # No website = great lead
    elif lead.get('website_url', ''):
        url = lead['website_url'].lower()
        if 'facebook.com' in url or 'instagram.com' in url:
            score -= 2  # Social media as "website" = good lead
        elif any(cms in url for cms in ['wix.com', 'squarespace.com', 'godaddy.com']):
            score -= 1  # Basic website builder

    # Review count signals
    reviews = lead.get('review_count', 0) or 0
    if reviews < 5:
        score -= 1
    elif reviews < 20:
        score -= 0.5
    elif reviews > 100:
        score += 1.5
    elif reviews > 50:
        score += 1

    # Technology signals (from enrichment)
    tech = lead.get('tech_signals', {})
    if tech.get('has_chatbot'):
        score += 2
    if tech.get('has_booking'):
        score += 1
    if tech.get('has_ecommerce'):
        score += 1.5
    if tech.get('has_analytics'):
        score += 0.5

    # Social media signals
    if lead.get('facebook_url') and not lead.get('has_website'):
        score -= 1  # Facebook but no website = good lead

    # Clamp to 1-10
    score = max(1, min(10, round(score)))

    # Generate qualification notes
    notes = []
    if not lead.get('has_website'):
        notes.append('No website')
    if reviews < 10:
        notes.append(f'Low reviews ({reviews})')
    if tech.get('has_chatbot'):
        notes.append('Has chatbot (skip signal)')
    if lead.get('facebook_url') and not lead.get('has_website'):
        notes.append('Uses Facebook as website')

    return score, '; '.join(notes) if notes else 'Standard lead'


def qualify_file(input_path, output_path=None):
    with open(input_path, 'r') as f:
        leads = json.load(f)

    print(f'Qualifying {len(leads)} leads...')

    # Score all leads
    for lead in leads:
        score, notes = score_lead(lead)
        lead['digital_maturity_score'] = score
        lead['qualification_notes'] = notes

    # Deduplicate by phone + address
    seen = set()
    unique_leads = []
    for lead in leads:
        key = (lead.get('phone', ''), lead.get('address', ''))
        if key not in seen and key != ('', ''):
            seen.add(key)
            unique_leads.append(lead)

    # Sort by score (lowest first = best leads)
    unique_leads.sort(key=lambda x: x.get('digital_maturity_score', 10))

    # Score distribution
    dist = {}
    for lead in unique_leads:
        s = lead['digital_maturity_score']
        bucket = '1-3 (excellent)' if s <= 3 else '4-6 (good)' if s <= 6 else '7-10 (skip)'
        dist[bucket] = dist.get(bucket, 0) + 1

    print(f'\nResults: {len(unique_leads)} unique leads (removed {len(leads) - len(unique_leads)} duplicates)')
    print('\nScore Distribution:')
    for bucket, count in sorted(dist.items()):
        print(f'  {bucket}: {count}')

    print(f'\nTop 10 Leads:')
    for lead in unique_leads[:10]:
        print(f"  [{lead['digital_maturity_score']}] {lead['business_name']} — {lead.get('phone', 'no phone')} — {lead.get('qualification_notes', '')}")

    # Save
    if not output_path:
        os.makedirs('data/qualified', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f'data/qualified/qualified_{timestamp}.json'

    with open(output_path, 'w') as f:
        json.dump(unique_leads, f, indent=2)

    print(f'\nSaved to {output_path}')
    return unique_leads


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python qualify_leads.py <input_file> [output_file]')
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    qualify_file(input_file, output_file)
