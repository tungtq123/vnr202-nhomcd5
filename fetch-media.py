import html
import json
import re
import urllib.request
from pathlib import Path
from PIL import Image

root = Path(__file__).parent / 'dist' / 'assets'
pages = {
    'dongkhoi': 'https://dbndnghean.vn/video/phong-trao-dong-khoi-buoc-ngoat-cua-cach-mang-mien-nam--phim-tai-lieu-khang-chien-chong-my-11114.htm',
    'apbac': 'https://nvsk.vnanet.vn/chien-thang-ap-bac-1-124654.vna',
    'mauthan': 'https://vtv.vn/video/phim-tai-lieu-nho-ve-sai-gon-mau-than-1968-tap-1-280304.htm',
    'hanoi': 'https://vtv.vn/video/van-hoc-nghe-thuat-ky-uc-ha-noi-12-ngay-dem-595902.htm',
    'paris': 'https://vtv.vn/video/viet-nam-va-the-gioi-50-nam-hiep-dinh-paris-moc-son-lich-su-600793.htm',
    'saigon': 'https://vtv.vn/video/phim-tai-lieu-30-4-1975-toi-la-cong-dan-dat-nuoc-tu-do-219386.htm',
    'sonmy': 'https://vtv.vn/video/46-nam-vu-tham-sat-son-my-34327.htm',
}
result = {}
for name, url in pages.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=35) as response:
            text = response.read().decode('utf-8', errors='replace')
        poster = re.search(r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)', text)
        player = re.search(r'data-vid=[\"\']([^\"\']*\.mp4[^\"\']*)', text)
        if not player:
            player = re.search(r'(?:src|data-src)=[\"\']([^\"\']*\.mp4[^\"\']*)', text)
        iframe = re.search(r'<iframe[^>]+src=[\"\']([^\"\']+)', text)
        item = {'page': url, 'stream': html.unescape(player.group(1)) if player else None,
                'iframe': html.unescape(iframe.group(1)) if iframe else None}
        if item['stream'] and not item['stream'].startswith('http'):
            item['stream'] = 'https://' + item['stream'].lstrip('/')
        if poster:
            image_url = html.unescape(poster.group(1))
            try:
                with urllib.request.urlopen(image_url, timeout=30) as response:
                    (root / f'video-{name}.jpg').write_bytes(response.read())
                with Image.open(root / f'video-{name}.jpg') as im:
                    im.thumbnail((900, 600))
                    im.convert('RGB').save(root / f'video-{name}.webp', 'WEBP', quality=85)
                item['poster'] = f'/assets/video-{name}.webp'
            except Exception as exc:
                item['poster_error'] = str(exc)
        result[name] = item
    except Exception as exc:
        result[name] = {'page': url, 'error': str(exc)}
(root / 'media.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
hero = 'https://media.vietnamplus.vn/images/9cgL5XPNTuTvOC7riffqUADkYVD3AAzEGVzvd5NlSw25J3v1PDg3DlMdcE2x1Cp-obLnLc1H8BCxXfm3nj-7yA/6_Giai_phong_mien_Nam_1.jpg.avif'
with urllib.request.urlopen(hero, timeout=40) as response:
    (root / 'hero-original.avif').write_bytes(response.read())
with Image.open(root / 'hero-original.avif') as im:
    im.convert('RGB').save(root / 'dinh-doc-lap-1975.webp', 'WEBP', quality=92)
print(json.dumps(result, ensure_ascii=True, indent=2))
