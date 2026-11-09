import concurrent.futures
import json
import urllib.request
from pathlib import Path

entries = json.loads(Path('dist/assets/media.json').read_text(encoding='utf-8'))
def check(pair):
    name, item = pair
    url = item.get('stream') or item.get('iframe')
    if not url:
        return name, 'no player'
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0', 'Referer': item['page']})
        with urllib.request.urlopen(req, timeout=30) as response:
            return name, response.status, response.headers.get('Content-Type'), response.headers.get('Content-Length')
    except Exception as exc:
        return name, str(exc)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    for result in executor.map(check, entries.items()):
        print(result)
