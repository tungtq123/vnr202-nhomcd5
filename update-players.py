"""Replace retired VTV CDN players with official, publicly indexed VTV uploads."""
import json
from pathlib import Path

path = Path('dist/assets/media.json')
data = json.loads(path.read_text(encoding='utf-8'))
youtube = {
    'mauthan': '-VPGVS0VKas',
    'hanoi': 'ysS-HHHzRBw',
    'paris': '8hj7twvfkvw',
    'saigon': 'ecJSxFzvSKk',
}
for key, video_id in youtube.items():
    data[key] = {
        'page': f'https://www.youtube.com/watch?v={video_id}',
        'iframe': f'https://www.youtube.com/embed/{video_id}?rel=0',
        'stream': None,
        'publisher': 'HTV Tin Tức' if key == 'mauthan' else 'VTV24',
    }
path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
