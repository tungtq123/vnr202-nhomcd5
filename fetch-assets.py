"""Download unaltered archival photographs from their verified publishers."""
import json
import re
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent / 'dist' / 'assets'
ASSETS = {
    'dinh-doc-lap-1975': 'https://baotanglichsu.vn/DataFiles/Uploaded/image/data%20Hung/thang%205%20nam%202015/ve%20buc%20anh%20xe%20tang%20tien%20vao%20dinh%20doc%20lap/1.jpg',
    'xe-tho-1954': 'https://xdcs.cdnchinhphu.vn/446259493575335936/2023/5/7/7-094914-040518-13-1683430140496-16834301409981115793302.jpg',
    'dien-bien-1954': 'https://xdcs.cdnchinhphu.vn/446259493575335936/2023/5/7/28-094914-040518-24-1683430150746-16834301509091116173728.jpg',
    'kham-thien-1972': 'https://special.nhandan.vn/50namkyuckhamthien/assets/0kWKZeg3qd/ttxvn_pho_kham_thien-620x378.jpg',
    'nguoi-dan-kham-thien': 'https://special.nhandan.vn/50namkyuckhamthien/assets/fXHzWmdP1q/44-copy-471x682.jpg',
    'paris-1973': 'https://imagevietnam.vnanet.vn/Upload//2013/1/26/10BaoAnh2612013111931374.jpg',
}

for name, url in ASSETS.items():
    target = ROOT / f'{name}.jpg'
    if not target.exists():
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=40) as response:
            target.write_bytes(response.read())
    with Image.open(target) as im:
        im.convert('RGB').save(ROOT / f'{name}.webp', 'WEBP', quality=90)
        print(name, im.size)

# Inspect only publicly published player metadata; do not download video files.
pages = {
    '1975': 'https://vtv.vn/video/phim-tai-lieu-30-4-1975-toi-la-cong-dan-dat-nuoc-tu-do-219386.htm',
    '1972': 'https://vtv.vn/video/van-hoc-nghe-thuat-ky-uc-ha-noi-12-ngay-dem-595902.htm',
    'apbac': 'https://nvsk.vnanet.vn/chien-thang-ap-bac-1-124654.vna',
}
for name, url in pages.items():
    try:
        with urllib.request.urlopen(url, timeout=35) as response:
            html = response.read().decode('utf-8', errors='replace')
        matches = re.findall(r'.{0,90}(?:\.mp4|\.m3u8|iframe|data-vid|data-src|data-embed).{0,220}', html)
        print(name, '\n'.join(matches[:12]))
    except Exception as exc:
        print(name, str(exc))
