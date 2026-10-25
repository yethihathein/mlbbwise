import os
import sys
import json
import re
import urllib.parse
import urllib.request
import subprocess
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('audio/voices', exist_ok=True)

with open('data/heroes.json', encoding='utf-8') as f:
    heroes = json.load(f)

print(f"Total heroes to process: {len(heroes)}")

# Step 1: Parse audio page wikitext for all heroes
hero_audio_info = {}

def get_hero_wikitext(hero):
    name = hero['name']
    enc_name = urllib.parse.quote(name.replace(' ', '_'))
    cmd = [
        'curl.exe', '-s', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        f'https://mobile-legends.fandom.com/api.php?action=parse&page={enc_name}/Audio&prop=wikitext&format=json'
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    try:
        data = json.loads(res.stdout)
        wt = data.get('parse', {}).get('wikitext', {}).get('*', '')
        if not wt:
            # Fallback try without /Audio (some might have it in Cosmetics or main page)
            return hero, None, None
            
        aq_matches = re.findall(r'\{\{[Aa]q\|([^\|\}]+)\|([^\|\}]+)\}\}', wt)
        
        chosen_file = None
        chosen_quote = None
        
        # Priority 1: select
        for file_name, quote in aq_matches:
            if 'select' in file_name.lower():
                chosen_file = file_name.strip()
                chosen_quote = quote.strip()
                break
        
        # Priority 2: spawn
        if not chosen_file:
            for file_name, quote in aq_matches:
                if 'spawn' in file_name.lower():
                    chosen_file = file_name.strip()
                    chosen_quote = quote.strip()
                    break
                    
        # Priority 3: first quote
        if not chosen_file and aq_matches:
            chosen_file = aq_matches[0][0].strip()
            chosen_quote = aq_matches[0][1].strip()
            
        return hero, chosen_file, chosen_quote
    except Exception as e:
        return hero, None, None

print("Fetching wikitext for all heroes in parallel...")
with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(get_hero_wikitext, heroes))

file_to_heroes = {}
for hero, f_name, quote in results:
    if f_name:
        # Standardize file title
        if not f_name.startswith('File:'):
            f_title = 'File:' + f_name
        else:
            f_title = f_name
        hero_audio_info[hero['id']] = {
            'hero_id': hero['id'],
            'name': hero['name'],
            'file_name': f_name,
            'file_title': f_title,
            'quote': quote or (hero.get('story', {}).get('quotes', [''])[0] if hero.get('story') else '')
        }
        file_to_heroes.setdefault(f_title, []).append(hero['id'])
    else:
        print(f"No audio file found for {hero['name']}")

print(f"Matched {len(hero_audio_info)}/{len(heroes)} heroes with audio files.")

# Step 2: Query MediaWiki API imageinfo for all file titles in batches of 40
titles_list = list(file_to_heroes.keys())
batch_size = 40
file_urls = {}

for i in range(0, len(titles_list), batch_size):
    batch = titles_list[i:i+batch_size]
    joined_titles = '|'.join(batch)
    enc_titles = urllib.parse.quote(joined_titles)
    cmd = [
        'curl.exe', '-s', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        f'https://mobile-legends.fandom.com/api.php?action=query&titles={enc_titles}&prop=imageinfo&iiprop=url&format=json'
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    try:
        data = json.loads(res.stdout)
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            title = pdata.get('title', '')
            ii = pdata.get('imageinfo', [])
            if ii and 'url' in ii[0]:
                file_urls[title] = ii[0]['url']
        # Handle normalized
        norm = data.get('query', {}).get('normalized', [])
        for n in norm:
            orig = n.get('from', '')
            to = n.get('to', '')
            if to in file_urls:
                file_urls[orig] = file_urls[to]
    except Exception as e:
        print(f"Batch {i} query error: {e}")

print(f"Resolved direct URLs for {len(file_urls)} unique audio files.")

# Step 3: Download audio files in parallel and save as audio/voices/{hero_id}.ogg
def download_voice(hero_id):
    info = hero_audio_info.get(hero_id)
    if not info:
        return hero_id, False, 'No info'
    
    f_title = info['file_title']
    url = file_urls.get(f_title)
    if not url:
        # Check case-insensitive
        for k, v in file_urls.items():
            if k.lower() == f_title.lower():
                url = v
                break
    
    if not url:
        return hero_id, False, f'No URL for {f_title}'
    
    info['remote_url'] = url
    out_path = f"audio/voices/{hero_id}.ogg"
    
    cmd = [
        'curl.exe', '-s', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        url, '-o', out_path
    ]
    res = subprocess.run(cmd, capture_output=True)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return hero_id, True, f"OK ({os.path.getsize(out_path)} bytes)"
    else:
        return hero_id, False, 'Download failed or file empty'

print("Downloading audio files in parallel...")
with ThreadPoolExecutor(max_workers=10) as ex:
    dl_results = list(ex.map(download_voice, list(hero_audio_info.keys())))

success_count = sum(1 for r in dl_results if r[1])
print(f"Downloaded {success_count}/{len(hero_audio_info)} hero voice files successfully!")

# Save voices index
voices_db = {}
for h_id, info in hero_audio_info.items():
    p = f"audio/voices/{h_id}.ogg"
    if os.path.exists(p) and os.path.getsize(p) > 1000:
        voices_db[h_id] = {
            'file': f"audio/voices/{h_id}.ogg",
            'quote': info['quote'],
            'remoteUrl': info.get('remote_url', '')
        }

with open('audio/voices/voices.json', 'w', encoding='utf-8') as f:
    json.dump(voices_db, f, indent=2, ensure_ascii=False)

print(f"Saved voices.json with {len(voices_db)} active original voice lines.")
