import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { sources, introScenes, introChapters, usPresidentsSummary } from './dist/data.mjs';
import {
  UPRISING_MAP_NOTE,
  UPRISING_PROVINCES,
  UPRISING_CITIES,
  UPRISING_ARCHIPELAGOS,
  UPRISING_REGION_MAP,
} from './dist/uprising-map-data.mjs';

assert.equal(Object.keys(sources).length, 20);
for (const source of Object.values(sources)) {
  assert.ok(new URL(source.url).protocol === 'https:');
}

assert.equal(introScenes.length, 25);
assert.equal(introScenes[0].duration, 3);
assert.equal(introScenes[0].image, '/assets/intro-dinh-doc-lap-30-4.jpg');
assert.equal(introScenes[1].image, '/assets/intro-nhat-dau-hang-1945.jpg');
assert.equal(introScenes[1].duration, 6);
assert.equal(introScenes[2].layout, 'sequence');
assert.equal(introScenes[2].frameDuration, 2);
assert.equal(introScenes[2].frames.length, 12);
assert.equal(introScenes[2].duration, 24);
assert.equal(introScenes[2].credit, 'Nguồn: Báo nhân dân điện tử');
assert.equal(introScenes[3].duration, 6);
assert.equal(introScenes[3].image, '/assets/intro-tuyen-ngon-doc-lap-1945.jpg');
assert.equal(introScenes[4].sceneNumber, 3);
assert.equal(introScenes[4].duration, 3);
assert.equal(introScenes[5].sceneNumber, 4);
assert.equal(introScenes[5].duration, 5);
assert.equal(introScenes[5].layout, 'spotlight');
assert.equal(introScenes[5].image, '/assets/loi-keu-goi-toan-quoc-khang-chien-1946.jpg');
assert.equal(introScenes[6].sceneNumber, 5);
assert.equal(introScenes[6].duration, 10);
assert.equal(introScenes[6].layout, 'river');
assert.equal(introScenes[6].cards.length, 4);
assert.equal(introScenes[7].sceneNumber, 6);
assert.equal(introScenes[7].duration, 5);
assert.equal(introScenes[7].layout, 'spotlight');
assert.equal(introScenes[7].image, '/assets/dien-bien-1954.webp');
assert.equal(introScenes[8].sceneNumber, 7);
assert.equal(introScenes[8].duration, 8);
assert.equal(introScenes[8].layout, 'gallery');
assert.equal(introScenes[8].exhibits.length, 2);
assert.equal(introScenes[8].exhibits[0].image, '/assets/intro-hiep-dinh-geneva-1954.jpg');
assert.equal(introScenes[8].exhibits[1].image, '/assets/intro-vi-tuyen-17-1954.jpg');
assert.equal(introScenes[9].sceneNumber, 8);
assert.equal(introScenes[9].duration, 7);
assert.equal(introScenes[9].layout, 'split');
assert.equal(introScenes[9].sides.length, 2);
assert.equal(introScenes[9].image, '/assets/intro-chia-cat-2-mien-1954.jpg');
assert.equal(introScenes[10].sceneNumber, 9);
assert.equal(introScenes[10].duration, 7);
assert.equal(introScenes[10].layout, 'phases');
assert.equal(introScenes[10].phases.length, 2);
assert.equal(introScenes[10].impacts.length, 4);
assert.ok(introScenes[10].flagFinale && introScenes[10].flagFinale.title);
assert.equal(introScenes[10].flagFinale.image, '/assets/intro-co-mat-tran-giai-phong-mn.png');
assert.equal(introScenes[11].sceneNumber, 10);
assert.equal(introScenes[11].slideIndex, 1);
assert.equal(introScenes[11].duration, 6);
assert.equal(introScenes[11].layout, 'versus');
assert.equal(introScenes[11].columns.length, 2);
assert.deepEqual(introScenes[11].splitBg.left, ['/assets/intro-co-my.svg', '/assets/intro-co-vnch-1955.png']);
assert.deepEqual(introScenes[11].splitBg.right, ['/assets/intro-co-viet-nam.svg', '/assets/intro-co-mat-tran-giai-phong-mn.png']);
assert.equal(introScenes[12].sceneNumber, 10);
assert.equal(introScenes[12].slideIndex, 2);
assert.equal(introScenes[12].duration, 7);
assert.equal(introScenes[12].layout, 'slide');
assert.equal(introScenes[12].image, '/assets/intro-co-mat-tran-giai-phong-mn.png');
assert.equal(introScenes[12].cards.length, 3);
assert.equal(introScenes[12].credit, '');
assert.equal(introScenes[13].sceneNumber, 11);
assert.equal(introScenes[13].slideIndex, 1);
assert.equal(introScenes[13].duration, 6);
assert.equal(introScenes[13].layout, 'slide');
assert.deepEqual(introScenes[13].splitBg.left, ['/assets/intro-co-my.svg', '/assets/intro-co-vnch-1955.png']);
assert.deepEqual(introScenes[13].splitBg.right, [
  '/assets/intro-co-han-quoc.svg',
  '/assets/intro-co-thai-lan.svg',
  '/assets/intro-co-philippines.svg',
  '/assets/intro-co-australia.svg',
]);
assert.equal(introScenes[13].cards.length, 3);
assert.equal(introScenes[13].credit, '');
assert.equal(introScenes[14].sceneNumber, 11);
assert.equal(introScenes[14].slideIndex, 2);
assert.equal(introScenes[14].duration, 9);
assert.equal(introScenes[14].layout, 'slide');
assert.equal(introScenes[14].image, '/assets/intro-co-mat-tran-giai-phong-mn.png');
assert.equal(introScenes[14].cards.length, 3);
assert.equal(introScenes[14].credit, '');
assert.equal(introScenes[15].sceneNumber, 11);
assert.equal(introScenes[15].slideIndex, 3);
assert.equal(introScenes[15].duration, 8);
assert.equal(introScenes[15].layout, 'briefing');
assert.equal(introScenes[15].splitBg.left, '/assets/intro-co-my.svg');
assert.equal(introScenes[15].splitBg.right, '/assets/intro-co-viet-nam.svg');
assert.equal(introScenes[15].statsPanel.metrics.length, 2);
assert.equal(introScenes[16].sceneNumber, 12);
assert.equal(introScenes[16].slideIndex, 1);
assert.equal(introScenes[16].slideTotal, 4);
assert.equal(introScenes[16].duration, 7);
assert.equal(introScenes[16].layout, 'slide');
assert.equal(introScenes[16].splitBg.left, '/assets/intro-co-my.svg');
assert.equal(introScenes[16].splitBg.right, '/assets/intro-co-vnch-1955.png');
assert.equal(introScenes[16].cards.length, 3);
assert.equal(introScenes[17].sceneNumber, 12);
assert.equal(introScenes[17].slideIndex, 2);
assert.equal(introScenes[17].slideTotal, 4);
assert.equal(introScenes[17].duration, 9);
assert.equal(introScenes[17].layout, 'slide');
assert.equal(introScenes[17].image, '/assets/paris-1973.webp');
assert.equal(introScenes[17].cards.length, 3);
assert.equal(introScenes[18].sceneNumber, 12);
assert.equal(introScenes[18].slideIndex, 3);
assert.equal(introScenes[18].slideTotal, 4);
assert.equal(introScenes[18].duration, 8);
assert.equal(introScenes[18].layout, 'briefing');
assert.equal(introScenes[18].image, '/assets/kham-thien-1972.webp');
assert.equal(introScenes[18].statsPanel.metrics.length, 2);
assert.equal(introScenes[19].sceneNumber, 12);
assert.equal(introScenes[19].slideIndex, 4);
assert.equal(introScenes[19].slideTotal, 4);
assert.equal(introScenes[19].duration, 8);
assert.equal(introScenes[19].layout, 'gallery');
assert.equal(introScenes[19].exhibits.length, 2);
assert.equal(introScenes[19].exhibits[0].image, '/assets/intro-hiep-dinh-paris-1973.jpg');
assert.equal(introScenes[19].exhibits[1].image, '/assets/intro-chu-ky-paris-1973.jpg');
assert.equal(introScenes[20].sceneNumber, 13);
assert.equal(introScenes[20].duration, 8);
assert.equal(introScenes[20].layout, 'slide');
assert.equal(introScenes[20].splitBg.left, '/assets/intro-co-vnch-1955.png');
assert.deepEqual(introScenes[20].splitBg.right, ['/assets/intro-co-viet-nam.svg', '/assets/intro-co-mat-tran-giai-phong-mn.png']);
assert.equal(introScenes[20].cards.length, 3);
assert.equal(introScenes[21].sceneNumber, 14);
assert.equal(introScenes[21].slideIndex, 1);
assert.equal(introScenes[21].slideTotal, 3);
assert.equal(introScenes[21].duration, 7);
assert.equal(introScenes[21].layout, 'spotlight');
assert.equal(introScenes[21].highlights.length, 3);
assert.equal(introScenes[21].image, '/assets/intro-chien-dich-tay-nguyen-1975.jpg');
assert.equal(introScenes[22].sceneNumber, 14);
assert.equal(introScenes[22].slideIndex, 2);
assert.equal(introScenes[22].slideTotal, 3);
assert.equal(introScenes[22].duration, 6);
assert.equal(introScenes[22].layout, 'spotlight');
assert.equal(introScenes[22].highlights.length, 3);
assert.equal(introScenes[22].image, '/assets/intro-chien-dich-hue-da-nang-1975.jpg');
assert.equal(introScenes[23].sceneNumber, 14);
assert.equal(introScenes[23].slideIndex, 3);
assert.equal(introScenes[23].slideTotal, 3);
assert.equal(introScenes[23].duration, 7);
assert.equal(introScenes[23].layout, 'spotlight');
assert.equal(introScenes[23].highlights.length, 3);
assert.equal(introScenes[23].image, '/assets/intro-chien-dich-ho-chi-minh-1975.jpg');
assert.equal(introScenes[23].secondaryImage, '/assets/dinh-doc-lap-1975.webp');
assert.equal(introScenes[24].sceneNumber, 15);
assert.equal(introScenes[24].duration, 10);
assert.equal(introScenes[24].layout, 'slide');
assert.equal(introScenes[24].bgStyle, 'map');
assert.equal(introScenes[24].image, '/assets/intro-ban-do-viet-nam-thong-nhat.png');
assert.equal(introScenes[24].cards.length, 3);
assert.equal(introScenes[24].credit, '');
assert.equal(introScenes.reduce((sum, scene) => sum + scene.duration, 0), 190);

for (const scene of introScenes) {
  assert.ok(scene.duration > 0);
  assert.ok(scene.title && (scene.text || scene.lead));
  for (const field of [scene.eyebrow, scene.title, scene.lead, scene.text, scene.note, scene.meta, scene.caption, scene.credit]) {
    if (field) assert.doesNotMatch(field, /\b(?:cảnh|slide)\s*\d/i);
  }
  if (scene.image) await access('dist' + scene.image);
  if (scene.secondaryImage) await access('dist' + scene.secondaryImage);
  if (scene.flagFinale?.image) await access('dist' + scene.flagFinale.image);
  for (const side of [scene.splitBg?.left, scene.splitBg?.right]) {
    const list = Array.isArray(side) ? side : side ? [side] : [];
    for (const src of list) await access('dist' + src);
  }
  if (scene.frames) {
    for (const frame of scene.frames) await access('dist' + frame.image);
  }
  if (scene.exhibits) {
    for (const exhibit of scene.exhibits) await access('dist' + exhibit.image);
  }
}

assert.equal(introChapters.length, 12);
assert.equal(introChapters[0].available, true);
assert.equal(introChapters[0].href, '/chuong.html?c=1');
assert.ok(introChapters[0].detail);
assert.ok(introChapters[0].detail.sections.length >= 3);
assert.ok(sources[introChapters[0].detail.imageSource]);
await access('dist' + introChapters[0].detail.image);
for (const sec of introChapters[0].detail.sections) {
  assert.ok(sources[sec.source]);
  if (sec.extraSource) assert.ok(sources[sec.extraSource]);
}
for (const srcKey of introChapters[0].detail.sources) assert.ok(sources[srcKey]);

assert.equal(introChapters[1].available, true);
assert.equal(introChapters[1].href, '/chuong.html?c=2');
assert.equal(introChapters[1].detail?.layout, 'three-parts');
assert.equal(introChapters[1].detail?.parts.length, 3);
assert.deepEqual(
  introChapters[1].detail.parts.map((p) => p.theme),
  ['context', 'white', 'meaning'],
);
const ch2Part1 = introChapters[1].detail.parts[0];
const famineGroup = ch2Part1.groups?.find((g) => g.variant === 'famine');
assert.ok(famineGroup && famineGroup.metrics?.length === 3 && famineGroup.items?.length >= 3);
assert.equal(ch2Part1.media?.diagram, undefined);
assert.equal(ch2Part1.media?.videos?.length, 3);
assert.deepEqual(
  ch2Part1.media.videos.map((v) => v.youtubeId),
  ['WE3tYqFBoQc', 'uP08po9myhc', 'v5gjkFVfzzU'],
);
assert.equal(ch2Part1.media.videos[2].title, 'Toàn Cảnh Nạn Đói 1945 Ở Việt Nam');
for (const vid of ch2Part1.media.videos) {
  assert.ok(new URL(vid.watchUrl).protocol === 'https:');
  assert.ok(new URL(vid.embedUrl).protocol === 'https:');
  assert.ok(new URL(vid.thumbnail).protocol === 'https:');
}
for (const part of introChapters[1].detail.parts) {
  if (part.media?.image) await access('dist' + part.media.image);
  if (part.media?.sequence) {
    for (const frame of part.media.sequence) await access('dist' + frame.image);
  }
}
assert.equal(introChapters[1].detail.parts[1].media?.diagram?.type, 'interactive-uprising-map');
assert.match(UPRISING_MAP_NOTE, /72 tỉnh trước Cách mạng tháng Tám/i);
assert.equal(UPRISING_PROVINCES.length, 74);
assert.equal(UPRISING_CITIES.length, 2);
assert.equal(UPRISING_ARCHIPELAGOS.length, 2);
for (const prov of UPRISING_PROVINCES) {
  assert.ok(prov.id && prov.name && prov.path && prov.dayLabel && prov.note);
}
for (const hub of UPRISING_CITIES) {
  assert.ok(hub.id && hub.name && Number.isFinite(hub.cx) && Number.isFinite(hub.cy) && hub.date && hub.note);
}
for (const arch of UPRISING_ARCHIPELAGOS) {
  assert.ok(arch.id && arch.name && arch.islets?.length >= 5 && arch.note);
}
assert.ok(UPRISING_REGION_MAP['quang-ngai']?.date === '16/8/1945');
assert.ok(UPRISING_REGION_MAP['ha-noi']?.date === '19/8/1945');
assert.ok(UPRISING_REGION_MAP['sai-gon']?.date === '25/8/1945');
assert.ok(UPRISING_REGION_MAP['ha-tien']?.date === '28/8/1945');
const ch2Part3 = introChapters[1].detail.parts[2];
assert.equal(ch2Part3.media?.image, undefined);
assert.equal(ch2Part3.media?.diagram?.type, 'era-shift');
assert.equal(ch2Part3.media?.youtube?.youtubeId, 'xRKUB3fUTJM');
assert.equal(ch2Part3.media?.youtube?.title, 'Toàn văn: Bác Hồ đọc Tuyên ngôn độc lập | VTV24');
assert.ok(new URL(ch2Part3.media.youtube.watchUrl).protocol === 'https:');
assert.ok(new URL(ch2Part3.media.youtube.embedUrl).protocol === 'https:');
assert.match(ch2Part3.media.youtube.embedUrl, /[?&]start=20\b/);
assert.ok(new URL(ch2Part3.media.youtube.thumbnail).protocol === 'https:');
for (const srcKey of introChapters[1].detail.sources) assert.ok(sources[srcKey]);

assert.deepEqual(
  introChapters.map((ch) => [ch.sceneNumber, ch.shortLabel, ch.label]),
  [
    [1, 'Chương 1', 'Mở đầu: Ba thập kỷ (1945–1975)'],
    [2, 'Chương 2', 'Cách mạng tháng Tám & Quốc khánh 2/9'],
    [3, 'Chương 3', 'Kháng chiến chống Pháp bùng nổ'],
    [4, 'Chương 4', 'Chiến thắng Điện Biên Phủ'],
    [5, 'Chương 5', 'Hiệp định Giơ-ne-vơ và chia cắt đất nước'],
    [6, 'Chương 6', 'Từ giữ gìn lực lượng đến Đồng khởi'],
    [7, 'Chương 7', 'Chống chiến lược “Chiến tranh đặc biệt”'],
    [8, 'Chương 8', 'Chống “Chiến tranh cục bộ” & Hậu phương'],
    [9, 'Chương 9', 'Chống “Việt Nam hóa” & Hiệp định Pa-ri'],
    [10, 'Chương 10', 'Chống lấn chiếm & Đường 14 – Phước Long'],
    [11, 'Chương 11', 'Tổng tiến công và nổi dậy Xuân 1975'],
    [12, 'Chương 12', 'Thống nhất đất nước'],
  ],
);

for (const [idx, ch] of introChapters.entries()) {
  assert.equal(ch.sceneNumber, idx + 1);
  assert.equal(ch.shortLabel, `Chương ${idx + 1}`);
  assert.equal(ch.available, true);
}

const ch3 = introChapters[2];
assert.equal(ch3.available, true);
assert.equal(ch3.href, '/chuong.html?c=3');
assert.equal(ch3.detail?.layout, 'section-bands');
assert.equal(ch3.detail?.parts.length, 2);
assert.deepEqual(
  ch3.detail.parts.map((p) => p.theme),
  ['context', 'white'],
);
const ch3Part1 = ch3.detail.parts[0];
const ch3CriticalGroup = ch3Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch3CriticalGroup && ch3CriticalGroup.metrics?.length === 3 && ch3CriticalGroup.items?.length >= 3);
assert.ok(ch3Part1.conclusion && ch3Part1.conclusion.text);
assert.equal(ch3Part1.media?.image, '/assets/loi-keu-goi-toan-quoc-khang-chien-1946.jpg');
await access('dist' + ch3Part1.media.image);
assert.equal(ch3Part1.media?.diagram?.type, 'resistance-context-matrix');
assert.ok((ch3Part1.media?.videos?.length || 0) >= 1);
const ch3Part2 = ch3.detail.parts[1];
assert.equal(ch3Part2.stages?.length, 4);
const ch3Milestones = [];
for (const st of ch3Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.outcome);
  assert.ok(st.events.length >= 3);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.ok(
      ev.noImage || ev.image || (ev.images && ev.images.length >= 1) || ev.photoHint,
      `Milestone missing visual spec: ${ev.date} ${ev.title}`,
    );
    if (ev.image) await access('dist' + ev.image);
    if (ev.images) {
      for (const imgObj of ev.images) {
        assert.ok(imgObj.src && imgObj.alt);
        await access('dist' + imgObj.src);
      }
    }
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 1);
    ch3Milestones.push(ev);
  }
}
assert.equal(ch3Milestones.length, 14);
assert.equal(ch3Milestones[0].noImage, true);
assert.equal(ch3Milestones[1].image, '/assets/ch3-m2-cho-ben-thanh-23-9-1945.jpg');
assert.equal(ch3Milestones[2].noImage, true);
assert.equal(ch3Milestones[3].images?.length, 2);
assert.deepEqual(
  ch3Milestones[3].images.map((i) => i.src),
  ['/assets/ch3-m4-loi-keu-goi-19-12-1946.jpg', '/assets/ch3-m4-hiep-dinh-so-bo-6-3-1946.jpg'],
);
assert.equal(ch3Milestones[3].documents?.length, 3);
assert.deepEqual(
  ch3Milestones[3].documents.map((d) => d.id),
  ['loi-keu-goi-1946', 'hiep-dinh-so-bo-1946', 'tam-uoc-viet-phap-1946'],
);
assert.equal(ch3Milestones[3].documents[2].clauses?.length, 11);
assert.equal(ch3Milestones[4].image, '/assets/ch3-m5-quyet-tu-quan-ha-noi-1946.jpg');
assert.equal(ch3Milestones[5].image, '/assets/ch3-m6-luoc-do-viet-bac-1947.jpg');
assert.equal(ch3Milestones[6].image, '/assets/ch3-m7-luoc-do-bien-gioi-1950.jpg');
assert.equal(ch3Milestones[4].video?.youtubeId, 'VadFqe69xgE');
assert.equal(ch3Milestones[5].video?.youtubeId, '3GkLcbMkufg');
assert.equal(ch3Milestones[6].video?.youtubeId, '_saGO2JWPds');
for (const idx567 of [4, 5, 6]) {
  const v = ch3Milestones[idx567].video;
  assert.ok(v?.title && v?.watchUrl && v?.embedUrl && v?.thumbnail);
  assert.ok(new URL(v.watchUrl).protocol === 'https:');
  assert.ok(new URL(v.embedUrl).protocol === 'https:');
  assert.ok(new URL(v.thumbnail).protocol === 'https:');
}
for (const idx67 of [5, 6]) {
  const m = ch3Milestones[idx67];
  assert.ok(m.combatBalance?.ta && m.combatBalance?.phap, `Missing combatBalance on Mốc ${idx67 + 1}`);
  assert.ok(m.casualties?.ta && m.casualties?.phap, `Missing casualties on Mốc ${idx67 + 1}`);
}
assert.match(ch3Milestones[6].casualties.ta, /^Không xác định\b/);
for (let idx = 7; idx < 14; idx += 1) {
  const m = ch3Milestones[idx];
  assert.equal(m.noImage, true, `Mốc ${idx + 1} must have noImage: true`);
  assert.equal(m.image, undefined, `Mốc ${idx + 1} must not have image`);
  assert.equal(m.images, undefined, `Mốc ${idx + 1} must not have images`);
  assert.equal(m.photoHint, undefined, `Mốc ${idx + 1} must not have photoHint`);
  assert.equal(m.combatBalance, undefined, `Mốc ${idx + 1} must not have combatBalance`);
  assert.equal(m.casualties, undefined, `Mốc ${idx + 1} must not have casualties`);
  assert.equal(m.video, undefined, `Mốc ${idx + 1} must not have video`);
}
assert.ok(ch3Part2.media?.milestoneInspector?.title);
assert.equal(ch3Part2.media?.videos?.[0]?.youtubeId, 'Rx7uo7ZdCM0');
assert.ok(ch3.detail.sources.includes('vietjack_b7'));
for (const srcKey of ch3.detail.sources) assert.ok(sources[srcKey]);

const ch4 = introChapters[3];
assert.equal(ch4.available, true);
assert.equal(ch4.href, '/chuong.html?c=4');
assert.equal(ch4.detail?.layout, 'three-parts');
assert.equal(ch4.detail?.parts.length, 3);
assert.deepEqual(
  ch4.detail.parts.map((p) => p.theme),
  ['context', 'white', 'meaning'],
);
const ch4Part1 = ch4.detail.parts[0];
assert.equal(ch4Part1.groups?.length, 2);
assert.ok(
  ch4Part1.forceComparison?.metrics?.length === 3 &&
    ch4Part1.forceComparison?.ta?.items?.length >= 3 &&
    ch4Part1.forceComparison?.phap?.items?.length >= 3,
);
assert.ok(ch4Part1.conclusion?.text);
assert.equal(ch4Part1.media?.image, '/assets/xe-tho-1954.webp');
assert.equal(ch4Part1.media?.diagram?.type, 'dienbien-fortress');
await access('dist' + ch4Part1.media.image);

const ch4Part2 = ch4.detail.parts[1];
assert.equal(ch4Part2.overviewImage?.src, '/assets/ch4-3-dot-dien-bien.jpg');
await access('dist' + ch4Part2.overviewImage.src);
assert.equal(ch4Part2.stages?.length, 3);
for (const st of ch4Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.outcome && st.events?.length >= 2);
}
assert.equal(ch4Part2.postOutcome?.sides?.length, 2);
for (const side of ch4Part2.postOutcome.sides) {
  assert.ok(side.code && side.rows?.length >= 3);
}
assert.equal(ch4Part2.media?.image, '/assets/ch4-so-do-dien-bien.jpg');
await access('dist' + ch4Part2.media.image);
assert.equal(ch4Part2.media?.youtube?.youtubeId, 'a6ucOeP11Gk');
assert.equal(
  ch4Part2.media?.youtube?.title,
  'CHIẾN THẮNG ĐIỆN BIÊN PHỦ! Cuộc Vây Hãm Kinh Điển Nhất Lịch Sử Chiến Tranh Hiện Đại',
);
assert.ok(new URL(ch4Part2.media.youtube.watchUrl).protocol === 'https:');
assert.ok(new URL(ch4Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch4Part2.media.youtube.thumbnail).protocol === 'https:');

const ch4Part3 = ch4.detail.parts[2];
assert.equal(ch4Part3.pillars?.length, 4);
assert.equal(ch4Part3.media?.image, '/assets/dien-bien-1954.webp');
assert.equal(ch4Part3.media?.diagram?.type, 'dienbien-impact');
await access('dist' + ch4Part3.media.image);
assert.equal(ch4Part3.heroes?.items?.length, 4);
assert.deepEqual(
  ch4Part3.heroes.items.map((h) => h.name),
  ['Phan Đình Giót', 'Tô Vĩnh Diện', 'Bế Văn Đàn', 'Trần Can'],
);
assert.deepEqual(
  ch4Part3.heroes.items.map((h) => h.image),
  [
    '/assets/ch4-hero-phan-dinh-giot.jpg',
    '/assets/ch4-hero-to-vinh-dien.jpg',
    '/assets/ch4-hero-be-van-dan.jpg',
    '/assets/ch4-hero-tran-can.jpg',
  ],
);
for (const hero of ch4Part3.heroes.items) {
  assert.ok(hero.lifeSpan && hero.hometown && hero.unit && hero.badge && hero.story && hero.honor && hero.image && hero.imageAlt);
  await access('dist' + hero.image);
}
assert.ok(ch4.detail.sources.includes('dienbien'));
for (const srcKey of ch4.detail.sources) assert.ok(sources[srcKey]);

const ch5 = introChapters[4];
assert.equal(ch5.available, true);
assert.equal(ch5.href, '/chuong.html?c=5');
assert.equal(ch5.detail?.layout, 'three-parts');
assert.equal(ch5.detail?.parts.length, 4);
assert.deepEqual(
  ch5.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch5Part1 = ch5.detail.parts[0];
assert.equal(ch5Part1.groups?.length, 2);
assert.ok(ch5Part1.conclusion?.text);
assert.equal(ch5Part1.media?.image, '/assets/dien-bien-1954.webp');
assert.equal(ch5Part1.media?.diagram?.type, 'geneva-context-matrix');
await access('dist' + ch5Part1.media.image);

const ch5Part2 = ch5.detail.parts[1];
assert.equal(ch5Part2.stages?.length, 2);
const ch5Milestones = [];
for (const st of ch5Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.outcome);
  assert.ok(st.events.length >= 2);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail && ev.image);
    assert.ok(ev.image.startsWith('/assets/'));
    await access('dist' + ev.image);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch5Milestones.push(ev);
  }
}
assert.equal(ch5Milestones.length, 4);
assert.equal(ch5Milestones[0].image, '/assets/intro-hiep-dinh-geneva-1954.jpg');
assert.equal(ch5Milestones[0].documents?.length, 3);
assert.equal(ch5Milestones[1].image, '/assets/intro-hiep-dinh-geneva-1954.jpg');
assert.equal(ch5Milestones[1].documents?.length, 3);
assert.deepEqual(
  ch5Milestones[1].documents.map((doc) => doc.id),
  ['tuyen-bo-chung-1954', 'hiep-dinh-dinh-chi-chien-su-1954', 'tuyen-bo-my-y-nghia-1954'],
);
assert.equal(ch5Milestones[1].documents[0].clauses?.length, 13);
assert.equal(ch5Milestones[1].documents[1].clauses?.length, 6);
assert.equal(ch5Milestones[1].documents[2].clauses?.length, 4);
assert.equal(ch5Milestones[2].image, '/assets/intro-vi-tuyen-17-1954.jpg');
assert.equal(ch5Milestones[3].image, '/assets/intro-chia-cat-2-mien-1954.jpg');
assert.equal(ch5Part2.postOutcome?.sides?.length, 2);
assert.equal(ch5Part2.media?.youtube?.youtubeId, 'F-0v0x7bs_I');
assert.equal(ch5Part2.media?.youtube?.title, 'TÌM HIỂU VỀ HIỆP ĐỊNH GIƠ-NE-VƠ');
assert.equal(ch5Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=F-0v0x7bs_I');
assert.ok(new URL(ch5Part2.media.youtube.watchUrl).protocol === 'https:');
assert.ok(new URL(ch5Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch5Part2.media.youtube.thumbnail).protocol === 'https:');

const ch5Part3 = ch5.detail.parts[2];
assert.equal(ch5Part3.id, 'phan-3-ton-that-chien-tranh');
assert.equal(ch5Part3.media, undefined, 'Chapter 5 Part 3 (War Toll 1945-1954) is text/data focused without aside image clutter');
assert.equal(ch5Part3.warToll?.metrics?.length, 4);
assert.ok(ch5Part3.warToll?.ta?.items?.length >= 3);
assert.ok(ch5Part3.warToll?.enemy?.items?.length >= 3);
assert.equal(ch5Part3.warToll?.destructionCards?.length, 4);
assert.ok(ch5Part3.warToll?.sourceNote);
assert.ok(ch5Part3.conclusion?.text);

const ch5Part4 = ch5.detail.parts[3];
assert.equal(ch5Part4.id, 'phan-4-my-ngo-dinh-diem');
assert.equal(ch5Part4.media, undefined, 'Chapter 5 Part 4 must not render an external aside media column');
assert.equal(ch5Part4.heroes, undefined);
assert.equal(ch5Part4.contentSections?.length, 2);
assert.equal(ch5Part4.contentSections[0].id, 'my-thay-the-phap');
assert.equal(ch5Part4.contentSections[0].dossier, undefined);
assert.equal(ch5Part4.contentSections[1].id, 'chinh-quyen-ngo-dinh-diem');
for (const sec of ch5Part4.contentSections) {
  assert.equal(sec.image, undefined);
  assert.equal(sec.images, undefined);
  assert.ok(sec.cards?.length >= 4);
  for (const card of sec.cards) {
    assert.ok(card.code && card.title && card.text);
    assert.equal(card.image, undefined);
  }
}
const diemDossier = ch5Part4.contentSections[1].dossier;
assert.ok(diemDossier && /Ngô Đình Diệm/i.test(diemDossier.title));
assert.equal(diemDossier.image, '/assets/ch5-ngo-dinh-diem.jpg');
await access('dist' + diemDossier.image);
assert.ok(diemDossier.facts?.length >= 6);
assert.equal(diemDossier.stages?.length, 4);
assert.deepEqual(
  [...new Set(ch5.detail.quiz.questions.map((q) => q.partId))],
  ['phan-1', 'phan-2', 'phan-3', 'phan-4'],
);
assert.ok(ch5.detail.sources.includes('geneva'));
assert.ok(ch5.detail.sources.includes('khangchien'));
assert.ok(ch5.detail.sources.includes('vietjack_b7'));
assert.ok(ch5.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch5.detail.sources) assert.ok(sources[srcKey]);

const ch6 = introChapters[5];
assert.equal(ch6.available, true);
assert.equal(ch6.href, '/chuong.html?c=6');
assert.equal(ch6.detail?.layout, 'three-parts');
assert.equal(ch6.detail?.parts.length, 3);
assert.deepEqual(
  ch6.detail.parts.map((p) => p.theme),
  ['context', 'white', 'meaning'],
);
const ch6Part1 = ch6.detail.parts[0];
assert.equal(ch6Part1.groups?.length, 3);
const ch6CriticalGroup = ch6Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch6CriticalGroup && ch6CriticalGroup.metrics?.length === 3 && ch6CriticalGroup.items?.length === 3);
assert.match(ch6CriticalGroup.items.join('\n'), /kinh tế/i);
assert.match(ch6CriticalGroup.items.join('\n'), /con người/i);
assert.match(ch6CriticalGroup.items.join('\n'), /xã hội/i);
assert.ok(ch6Part1.conclusion?.text);
assert.equal(ch6Part1.media?.image, '/assets/intro-chia-cat-2-mien-1954.jpg');
assert.equal(ch6Part1.media?.diagram?.type, 'dongkhoi-context-crisis');
await access('dist' + ch6Part1.media.image);

const ch6Part2 = ch6.detail.parts[1];
assert.equal(ch6Part2.stages?.length, 3);
for (const st of ch6Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 3);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail);
  }
}
assert.equal(ch6Part2.postOutcome?.sides?.length, 2);
assert.equal(ch6Part2.media?.image, '/assets/ch6-dong-khoi-1960.jpg');
assert.equal(ch6Part2.media?.zoomable, true);
assert.equal(ch6Part2.media?.secondaryImage?.image, '/assets/ch6-luoc-do-dong-khoi.jpg');
assert.equal(ch6Part2.media?.secondaryImage?.zoomable, true);
await access('dist' + ch6Part2.media.image);
await access('dist' + ch6Part2.media.secondaryImage.image);
assert.equal(ch6Part2.media?.youtube?.youtubeId, 'mqM9ZA2QRPY');
assert.equal(ch6Part2.media?.youtube?.title, 'Phong trào Đồng Khởi 1959 - 1960');
assert.equal(ch6Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=mqM9ZA2QRPY');
assert.ok(new URL(ch6Part2.media.youtube.watchUrl).protocol === 'https:');
assert.ok(new URL(ch6Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch6Part2.media.youtube.thumbnail).protocol === 'https:');

const ch6Part3 = ch6.detail.parts[2];
assert.equal(ch6Part3.pillars?.length, 4);
assert.equal(ch6Part3.media?.image, '/assets/intro-co-mat-tran-giai-phong-mn.png');
assert.equal(ch6Part3.media?.diagram?.type, 'dongkhoi-meaning-shift');
await access('dist' + ch6Part3.media.image);
const ch6Mz = ch6Part3.militaryZones;
assert.ok(ch6Mz && ch6Mz.groups?.length === 3);
assert.ok(ch6Mz.groups[0].timeline?.length >= 3);
assert.ok(ch6Mz.groups[1].effects?.length === 4);
assert.ok(ch6Mz.groups[2].merges?.length === 2);
assert.match(ch6Mz.groups[2].merges.map((m) => m.fromCode + ' ' + m.toCode + ' ' + m.detail).join('\n'), /Quân khu 6.*Quân khu 5/s);
assert.match(ch6Mz.groups[2].merges.map((m) => m.fromCode + ' ' + m.toCode + ' ' + m.detail).join('\n'), /Quân khu 8.*Quân khu 9/s);
assert.equal(ch6Mz.map?.image, '/assets/ch6-ban-do-quan-khu.jpg');
assert.equal(ch6Mz.map?.zoomable, true);
await access('dist' + ch6Mz.map.image);
assert.ok(ch6Mz.currentZones?.items?.length >= 5);
assert.equal(ch6.detail.quiz?.questions?.length, 10);
assert.match(ch6.detail.quiz.questions.map((q) => q.question + ' ' + q.explanation).join('\n'), /Quân khu 6.*Quân khu 8/s);
assert.ok(ch6.detail.sources.includes('dongkhoi'));
assert.ok(ch6.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch6.detail.sources) assert.ok(sources[srcKey]);

const ch7 = introChapters[6];
assert.equal(ch7.available, true);
assert.equal(ch7.href, '/chuong.html?c=7');
assert.equal(ch7.detail?.layout, 'three-parts');
assert.equal(ch7.detail?.parts.length, 3);
assert.deepEqual(
  ch7.detail.parts.map((p) => p.theme),
  ['context', 'white', 'meaning'],
);
const ch7Part1 = ch7.detail.parts[0];
assert.equal(ch7Part1.groups?.length, 3);
const ch7CriticalGroup = ch7Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch7CriticalGroup && ch7CriticalGroup.metrics?.length === 3 && ch7CriticalGroup.items?.length >= 4);
assert.match(ch7CriticalGroup.items.join('\n'), /đi-ô-xin|dioxin/i);
assert.ok(ch7CriticalGroup.explainer && ch7CriticalGroup.explainer.metrics?.length === 3);
assert.equal(ch7CriticalGroup.explainer.cols?.length, 2);
assert.match(ch7CriticalGroup.explainer.cols[0].title, /là gì/i);
assert.match(ch7CriticalGroup.explainer.cols[1].title, /Tác hại/i);
const ch7PresidencyText = ch7Part1.groups[2].items.join('\n');
for (const leader of ['Dương Văn Minh', 'Nguyễn Khánh', 'Phan Khắc Sửu', 'Trần Văn Hương', 'Phan Huy Quát', 'Nguyễn Văn Thiệu', 'Nguyễn Cao Kỳ']) {
  assert.ok(ch7PresidencyText.includes(leader), `Missing VNCH leader in ch7 Part 1: ${leader}`);
}
assert.ok(ch7Part1.conclusion?.text);
assert.equal(ch7Part1.media?.image, '/assets/ch7-ap-chien-luoc-1961.jpg');
assert.equal(ch7Part1.media?.zoomable, true);
await access('dist' + ch7Part1.media.image);
assert.equal(ch7Part1.media?.diagram?.type, 'specialwar-context-regime');
const ch7DvmDossier = ch7Part1.media?.dossier;
assert.ok(ch7DvmDossier && /Dương Văn Minh/i.test(ch7DvmDossier.title));
assert.equal(ch7DvmDossier.image, '/assets/ch7-duong-van-minh.jpg');
await access('dist' + ch7DvmDossier.image);
assert.ok(ch7DvmDossier.facts?.length >= 6);
assert.equal(ch7DvmDossier.stages?.length, 3);
assert.equal(ch7Part1.media?.youtube?.youtubeId, 'Ij5ubJOgvcY');
assert.equal(ch7Part1.media?.youtube?.title, 'TÌM HIỂU CHIẾN LƯỢC CHIẾN TRANH ĐẶC BIỆT');
assert.equal(ch7Part1.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=Ij5ubJOgvcY');
assert.ok(new URL(ch7Part1.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch7Part1.media.youtube.thumbnail).protocol === 'https:');

const ch7Part2 = ch7.detail.parts[1];
assert.equal(ch7Part2.stages?.length, 3);
const ch7Milestones = [];
for (const st of ch7Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 2);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch7Milestones.push(ev);
  }
}
assert.equal(ch7Milestones.length, 8);
for (const msIdx of [3, 5, 6, 7]) {
  const m = ch7Milestones[msIdx];
  assert.ok(m.combatBalance?.ta && (m.combatBalance?.enemy || m.combatBalance?.phap), `Missing combatBalance on ch7 Mốc ${msIdx + 1}`);
  assert.ok(m.casualties?.ta && (m.casualties?.enemy || m.casualties?.phap), `Missing casualties on ch7 Mốc ${msIdx + 1}`);
}
assert.match(ch7Milestones[3].casualties.ta, /18.*hy sinh.*39/);
assert.match(ch7Milestones[3].casualties.enemy, /450/);
for (const msIdx of [5, 6, 7]) {
  assert.match(ch7Milestones[msIdx].casualties.ta, /^Không xác định\b/);
}
assert.equal(ch7Part2.postOutcome?.sides?.length, 2);
assert.equal(ch7Part2.media?.milestoneInspector?.title, 'Hồ sơ đối sách & Chiến thắng tiêu biểu (1961–1965)');
assert.equal(ch7Part2.media?.youtube?.youtubeId, 'gyf81eJqyfY');
assert.equal(ch7Part2.media?.youtube?.title, 'Trận Ấp Bắc Năm 1963 – Khi Việt Nam Dạy Mỹ Một Bài Học Đắt Giá');
assert.equal(ch7Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=gyf81eJqyfY');
assert.ok(new URL(ch7Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch7Part2.media.youtube.thumbnail).protocol === 'https:');

const ch7Part3 = ch7.detail.parts[2];
assert.equal(ch7Part3.pillars?.length, 4);
assert.equal(ch7Part3.media?.diagram?.type, 'specialwar-meaning-shift');
assert.ok(ch7.detail.sources.includes('apbac'));
assert.ok(ch7.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch7.detail.sources) assert.ok(sources[srcKey]);

const ch8 = introChapters[7];
assert.equal(ch8.available, true);
assert.equal(ch8.href, '/chuong.html?c=8');
assert.equal(ch8.period, '1964–1969');
assert.equal(ch8.detail?.layout, 'three-parts');
assert.equal(ch8.detail?.parts.length, 4);
assert.deepEqual(
  ch8.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch8Part1 = ch8.detail.parts[0];
assert.equal(ch8Part1.groups?.length, 2);
const ch8CriticalGroup = ch8Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch8CriticalGroup && ch8CriticalGroup.metrics?.length === 3 && ch8CriticalGroup.items?.length >= 3);
assert.ok(ch8Part1.conclusion?.text);
assert.equal(ch8Part1.media?.diagram?.type, 'localwar-context-strategy');
assert.equal(ch8Part1.media?.youtube?.youtubeId, '1BbQnY1XyBo');
assert.equal(ch8Part1.media?.youtube?.title, 'CHIẾN LƯỢC CHIẾN TRANH CỤC BỘ DIỄN RA NHƯ THẾ NÀO?');
assert.equal(ch8Part1.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=1BbQnY1XyBo&t=10s');
assert.match(ch8Part1.media?.youtube?.embedUrl, /[?&]start=10\b/);
assert.ok(new URL(ch8Part1.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch8Part1.media.youtube.thumbnail).protocol === 'https:');

const ch8Part2 = ch8.detail.parts[1];
assert.equal(ch8Part2.stages?.length, 3);
const ch8Milestones = [];
for (const st of ch8Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 1);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch8Milestones.push(ev);
  }
}
assert.equal(ch8Milestones.length, 8);
assert.equal(ch8Milestones[1].image, '/assets/ch8-luoc-do-van-tuong-1965.jpg');
assert.equal(ch8Milestones[1].zoomable, true);
await access('dist' + ch8Milestones[1].image);
assert.equal(ch8Milestones[5].image, '/assets/ch8-mau-than-duong-le-loi-1968.jpg');
assert.equal(ch8Milestones[5].zoomable, true);
await access('dist' + ch8Milestones[5].image);
for (const msIdx of [0, 1, 2, 3, 4, 5, 7]) {
  const m = ch8Milestones[msIdx];
  assert.ok(m.combatBalance?.ta && (m.combatBalance?.enemy || m.combatBalance?.phap), `Missing combatBalance on ch8 Mốc ${msIdx + 1}`);
}
for (const msIdx of [0, 1, 2, 3, 4, 5]) {
  const m = ch8Milestones[msIdx];
  assert.ok(m.casualties?.ta && (m.casualties?.enemy || m.casualties?.phap), `Missing casualties on ch8 Mốc ${msIdx + 1}`);
}
assert.match(ch8Milestones[0].casualties.ta, /^Không xác định\b/);
assert.match(ch8Milestones[3].casualties.ta, /^Không xác định\b/);
const ch8ParisText = `${ch8Milestones[7].detail}\n${ch8Milestones[7].combatBalance.ta}\n${ch8Milestones[7].combatBalance.enemy}`;
for (const delegateName of ['Xuân Thủy', 'Lê Đức Thọ', 'Harriman', 'Cyrus R. Vance']) {
  assert.ok(ch8ParisText.includes(delegateName), `Missing Paris delegate in ch8 Mốc 8: ${delegateName}`);
}
assert.equal(ch8Part2.postOutcome?.sides?.length, 2);
assert.ok(ch8Part2.media?.milestoneInspector?.title);
assert.equal(ch8Part2.media?.youtube?.youtubeId, 'YpThj9yGzeM');
assert.match(ch8Part2.media?.youtube?.title, /Tết Mậu Thân 1968/i);
assert.equal(ch8Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=YpThj9yGzeM');
assert.ok(new URL(ch8Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch8Part2.media.youtube.thumbnail).protocol === 'https:');

const ch8Part3 = ch8.detail.parts[2];
assert.equal(ch8Part3.groups?.length, 2);
assert.ok(ch8Part3.warToll);
assert.equal(ch8Part3.warToll.metrics?.length, 4);
assert.ok(ch8Part3.warToll.ta?.items?.length >= 3 && ch8Part3.warToll.enemy?.items?.length >= 3);
assert.equal(ch8Part3.warToll.destructionCards?.length, 4);
assert.equal(ch8Part3.media?.image, '/assets/ch8-mien-bac-san-xuat-chien-dau.jpg');
assert.equal(ch8Part3.media?.zoomable, true);
await access('dist' + ch8Part3.media.image);
assert.equal(ch8Part3.media?.diagram?.type, 'northern-airwar-defense');
assert.ok(ch8Part3.conclusion?.text);

const ch8Part4 = ch8.detail.parts[3];
assert.equal(ch8Part4.contentSections?.length, 2);
const ch8BácSec = ch8Part4.contentSections[1];
assert.ok(ch8BácSec.dossier && ch8BácSec.dossier.facts?.length >= 6 && ch8BácSec.dossier.stages?.length === 2);
assert.equal(ch8BácSec.documents?.length, 2);
assert.deepEqual(
  ch8BácSec.documents.map((doc) => doc.id),
  ['di-chuc-chu-tich-ho-chi-minh-1969', 'dieu-van-le-truy-dieu-9-9-1969'],
);
assert.equal(ch8BácSec.youtube?.youtubeId, 'c2O_G-q0iWE');
assert.equal(ch8BácSec.youtube?.title, 'TBT Lê Duẩn đọc điếu văn và di chúc chủ tịch Hồ Chí Minh');
assert.equal(ch8BácSec.youtube?.watchUrl, 'https://www.youtube.com/watch?v=c2O_G-q0iWE');
assert.ok(new URL(ch8BácSec.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch8BácSec.youtube.thumbnail).protocol === 'https:');
assert.ok(ch8.detail.sources.includes('vantuong'));
assert.ok(ch8.detail.sources.includes('mauthan'));
assert.ok(ch8.detail.sources.includes('paris'));
for (const srcKey of ch8.detail.sources) assert.ok(sources[srcKey]);

const ch9 = introChapters[8];
assert.equal(ch9.available, true);
assert.equal(ch9.href, '/chuong.html?c=9');
assert.equal(ch9.period, '1969–1973');
assert.equal(ch9.detail?.layout, 'three-parts');
assert.equal(ch9.detail?.parts.length, 4);
assert.deepEqual(
  ch9.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch9Part1 = ch9.detail.parts[0];
assert.equal(ch9Part1.groups?.length, 2);
const ch9CriticalGroup = ch9Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch9CriticalGroup && ch9CriticalGroup.metrics?.length === 3 && ch9CriticalGroup.items?.length >= 4);
assert.ok(ch9Part1.conclusion?.text);
assert.equal(ch9Part1.media?.diagram?.type, 'vietnamization-context-strategy');
assert.equal(ch9Part1.media?.youtube?.youtubeId, 'wEOdNVNQGRA');
assert.match(ch9Part1.media?.youtube?.title, /Việt Nam hoá chiến tranh/i);
assert.equal(ch9Part1.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=wEOdNVNQGRA');
assert.ok(new URL(ch9Part1.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch9Part1.media.youtube.thumbnail).protocol === 'https:');

const ch9Part2 = ch9.detail.parts[1];
assert.equal(ch9Part2.stages?.length, 2);
const ch9Milestones = [];
for (const st of ch9Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 3);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch9Milestones.push(ev);
  }
}
assert.equal(ch9Milestones.length, 6);
for (const msIdx of [0, 1, 2, 3, 4]) {
  const m = ch9Milestones[msIdx];
  assert.ok(m.combatBalance?.ta && m.combatBalance?.enemy, `Missing combatBalance on ch9 Mốc ${msIdx + 1}`);
  assert.ok(m.casualties?.ta && m.casualties?.enemy, `Missing casualties on ch9 Mốc ${msIdx + 1}`);
}
assert.match(ch9Milestones[0].casualties.ta, /^Không xác định\b/);
assert.match(ch9Milestones[2].casualties.ta, /^Không xác định\b/);
assert.match(ch9Milestones[1].casualties.ta, /2\.163/);
assert.match(ch9Milestones[4].date, /28\/6\s*–\s*16\/9\/1972/);
assert.match(ch9Milestones[4].detail + ' ' + ch9Milestones[4].extendedDetail, /rút qua sông Thạch Hãn|rút sang bờ Bắc sông Thạch Hãn/i);
assert.doesNotMatch(ch9Milestones[4].detail + ' ' + ch9Milestones[4].extendedDetail, /giữ vững Thành cổ tới năm 1975/i);
assert.equal(ch9Part2.postOutcome?.sides?.length, 2);
assert.ok(ch9Part2.media?.milestoneInspector?.title);
assert.equal(ch9Part2.media?.youtube?.youtubeId, 'EDd2N6YQFgU');
assert.match(ch9Part2.media?.youtube?.title, /81 ngày đêm tại Thành Cổ Quảng Trị/i);
assert.equal(ch9Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=EDd2N6YQFgU');
assert.ok(new URL(ch9Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch9Part2.media.youtube.thumbnail).protocol === 'https:');

const ch9Part3 = ch9.detail.parts[2];
assert.equal(ch9Part3.groups?.length, 2);
assert.ok(ch9Part3.warToll);
assert.equal(ch9Part3.warToll.metrics?.length, 4);
assert.ok(ch9Part3.warToll.ta?.items?.length >= 4 && ch9Part3.warToll.enemy?.items?.length >= 4);
assert.equal(ch9Part3.warToll.destructionCards?.length, 4);
assert.equal(ch9Part3.media?.image, '/assets/ch9-b52-rai-bom.jpg');
assert.equal(ch9Part3.media?.zoomable, true);
await access('dist' + ch9Part3.media.image);
assert.equal(ch9Part3.media?.gallery?.length, 2);
for (const gItem of ch9Part3.media.gallery) {
  assert.ok(gItem.image && gItem.caption);
  await access('dist' + gItem.image);
}
assert.equal(ch9Part3.media?.diagram?.type, 'linebacker2-air-defense');
assert.equal(ch9Part3.media?.youtube?.youtubeId, '7fwAZD3-V3s');
assert.match(ch9Part3.media?.youtube?.title, /ĐIỆN BIÊN PHỦ TRÊN KHÔNG/i);
assert.equal(ch9Part3.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=7fwAZD3-V3s');
assert.ok(new URL(ch9Part3.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch9Part3.media.youtube.thumbnail).protocol === 'https:');
assert.ok(ch9Part3.conclusion?.text);

const ch9Part4 = ch9.detail.parts[3];
assert.equal(ch9Part4.contentSections?.length, 2);
const ch9ParisSec = ch9Part4.contentSections[0];
assert.equal(ch9ParisSec.documents?.length, 3);
assert.deepEqual(
  ch9ParisSec.documents.map((doc) => doc.id),
  ['hiep-dinh-paris-toan-van-23-dieu', 'bon-nghi-dinh-thu-va-bon-ben-ky', 'so-sanh-paris-1973-va-gionevo-1954'],
);
assert.equal(ch9ParisSec.documents[0].clauses?.length, 11);
assert.equal(ch9Part4.media?.image, '/assets/ch9-hoi-nghi-paris-4-ben.jpg');
assert.equal(ch9Part4.media?.zoomable, true);
await access('dist' + ch9Part4.media.image);
assert.equal(ch9Part4.media?.gallery?.length, 3);
for (const gItem of ch9Part4.media.gallery) {
  assert.ok(gItem.image && gItem.caption);
  await access('dist' + gItem.image);
}
assert.equal(ch9Part4.media?.diagram?.type, 'paris-accords-turning-point');
assert.ok(ch9.detail.sources.includes('quangtri'));
assert.ok(ch9.detail.sources.includes('hanoi'));
assert.ok(ch9.detail.sources.includes('khamthien'));
assert.ok(ch9.detail.sources.includes('paris'));
for (const srcKey of ch9.detail.sources) assert.ok(sources[srcKey]);

const ch10 = introChapters[9];
assert.equal(ch10.available, true);
assert.equal(ch10.href, '/chuong.html?c=10');
assert.equal(ch10.period, '1973 – đầu 1975');
assert.equal(ch10.detail?.layout, 'three-parts');
assert.equal(ch10.detail?.parts.length, 4);
assert.deepEqual(
  ch10.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch10Part1 = ch10.detail.parts[0];
assert.equal(ch10Part1.groups?.length, 2);
const ch10CriticalGroup = ch10Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch10CriticalGroup && ch10CriticalGroup.metrics?.length === 3 && ch10CriticalGroup.items?.length >= 4);
assert.ok(ch10Part1.conclusion?.text);
assert.equal(ch10Part1.media?.image, '/assets/ch10-linh-my-cuoi-cung-1973.jpg');
assert.equal(ch10Part1.media?.isDocument, true);
assert.equal(ch10Part1.media?.zoomable, true);
await access('dist' + ch10Part1.media.image);
assert.equal(ch10Part1.media?.diagram?.type, 'postparis-sabotage-balance');

const ch10Part2 = ch10.detail.parts[1];
assert.equal(ch10Part2.stages?.length, 2);
const ch10Milestones = [];
for (const st of ch10Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 2);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.equal(ev.noImage, true, `ch10 milestone should stay text-focused (noImage): ${ev.date}`);
    assert.ok(ev.combatBalance?.ta && ev.combatBalance?.enemy, `ch10 milestone missing combatBalance: ${ev.date}`);
    assert.ok(ev.casualties?.ta && ev.casualties?.enemy, `ch10 milestone missing casualties: ${ev.date}`);
    assert.match(ev.casualties.ta, /^Không xác định/, `ch10 milestone should follow honest casualty policy: ${ev.date}`);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch10Milestones.push(ev);
  }
}
assert.equal(ch10Milestones.length, 5);
assert.match(ch10Milestones[0].title, /Cửa Việt/);
assert.match(ch10Milestones[1].title, /Nghị quyết Hội nghị Trung ương lần thứ 21/);
assert.match(ch10Milestones[2].title, /Thượng Đức/);
assert.equal(ch10Milestones[4].date, '12/12/1974 – 6/1/1975');
assert.equal(ch10Milestones[4].highlight, true);
assert.match(ch10Milestones[4].title, /Đường 14 – Phước Long/);
assert.equal(ch10Part2.postOutcome?.sides?.length, 2);
assert.ok(ch10Part2.media?.milestoneInspector?.title);

const ch10Part3 = ch10.detail.parts[2];
assert.equal(ch10Part3.groups?.length, 2);
assert.equal(ch10Part3.groups[0].metrics?.length, 3);
const ch10Part3Text = `${ch10Part3.groups.map((g) => g.items.join('\n')).join('\n')}`;
for (const requiredPhrase of ['Quân đoàn 1', 'Quân đoàn 2', 'Quân đoàn 4', '5.000 km']) {
  assert.ok(ch10Part3Text.includes(requiredPhrase), `Missing phrase in ch10 Part 3: ${requiredPhrase}`);
}
assert.ok(ch10Part3.conclusion?.text);
assert.equal(ch10Part3.media?.diagram?.type, 'ch10-rear-corps-trails');

const ch10Part4 = ch10.detail.parts[3];
assert.equal(ch10Part4.contentSections?.length, 2);
for (const sec of ch10Part4.contentSections) {
  assert.equal(sec.cards?.length, 4);
}
const ch10Part4Text = ch10Part4.contentSections.map((s) => `${s.heading}\n${s.cards.map((c) => `${c.title} ${c.text}`).join('\n')}`).join('\n');
for (const requiredPhrase of ['18/12/1974', '8/1/1975', 'Buôn Ma Thuột']) {
  assert.ok(ch10Part4Text.includes(requiredPhrase), `Missing phrase in ch10 Part 4: ${requiredPhrase}`);
}
assert.equal(ch10Part4.media?.diagram?.type, 'ch10-spring1975-preconditions');
assert.ok(ch10.detail.sources.includes('paris'));
assert.ok(ch10.detail.sources.includes('spring'));
assert.ok(ch10.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch10.detail.sources) assert.ok(sources[srcKey]);

const ch11 = introChapters[10];
assert.equal(ch11.available, true);
assert.equal(ch11.href, '/chuong.html?c=11');
assert.equal(ch11.period, 'Xuân 1975');
assert.equal(ch11.detail?.layout, 'three-parts');
assert.equal(ch11.detail?.parts.length, 4);
assert.deepEqual(
  ch11.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch11Part1 = ch11.detail.parts[0];
assert.equal(ch11Part1.groups?.length, 2);
const ch11CriticalGroup = ch11Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch11CriticalGroup && ch11CriticalGroup.metrics?.length === 3 && ch11CriticalGroup.items?.length >= 3);
assert.ok(ch11Part1.conclusion?.text);
assert.equal(ch11Part1.media?.image, '/assets/ch11-macv-cuon-co-1973.jpg');
assert.equal(ch11Part1.media?.isDocument, true);
assert.equal(ch11Part1.media?.zoomable, true);
await access('dist' + ch11Part1.media.image);
assert.equal(ch11Part1.media?.diagram?.type, 'spring1975-context-strategy');

const ch11Part2 = ch11.detail.parts[1];
assert.equal(ch11Part2.overviewImage?.src, '/assets/ch11-xe-tang-dinh-doc-lap-1975.jpg');
assert.equal(ch11Part2.overviewImage?.zoomable, true);
await access('dist' + ch11Part2.overviewImage.src);
assert.equal(ch11Part2.stages?.length, 3);
const ch11Milestones = [];
for (const st of ch11Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 1);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.ok(ev.noImage || ev.image, `ch11 milestone missing visual spec: ${ev.date}`);
    if (ev.image) {
      assert.equal(ev.isDocument, true, `ch11 map/photo should use uncropped isDocument styling: ${ev.image}`);
      assert.equal(ev.zoomable, true);
      await access('dist' + ev.image);
    }
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch11Milestones.push(ev);
  }
}
assert.equal(ch11Milestones.length, 5);
assert.equal(ch11Milestones[0].image, '/assets/ch11-luoc-do-tay-nguyen-1975.jpg');
assert.equal(ch11Milestones[1].image, '/assets/ch11-luoc-do-hue-da-nang-1975.jpg');
assert.equal(ch11Milestones[2].noImage, true);
assert.equal(ch11Milestones[3].image, '/assets/ch11-luoc-do-ho-chi-minh-1975.jpg');
assert.equal(ch11Milestones[4].image, '/assets/ch11-xe-tang-dinh-doc-lap-1975.jpg');
assert.equal(ch11Milestones[4].documents?.length, 2);
assert.deepEqual(
  ch11Milestones[4].documents.map((doc) => doc.id),
  ['menh-lenh-than-toc-7-4-1975', 'tuyen-bo-dau-hang-30-4-1975'],
);
assert.equal(ch11Part2.postOutcome?.sides?.length, 2);
assert.ok(ch11Part2.media?.milestoneInspector?.title);
assert.equal(ch11Part2.media?.youtube?.youtubeId, 'aqMp24oZJa8');
assert.match(ch11Part2.media?.youtube?.title, /mùa xuân 1975/i);
assert.equal(ch11Part2.media?.youtube?.channel, 'EZ Sử');
assert.equal(ch11Part2.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=aqMp24oZJa8');
assert.ok(new URL(ch11Part2.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch11Part2.media.youtube.thumbnail).protocol === 'https:');
for (const idx012 of [0, 1, 2]) {
  assert.equal(ch11Milestones[idx012].video, undefined, `Mốc ${idx012 + 1} Ch11 must not have video`);
}
for (const idxHcm of [3, 4]) {
  const hv = ch11Milestones[idxHcm].video;
  assert.equal(hv?.youtubeId, 'ecJSxFzvSKk', `Mốc ${idxHcm + 1} Chiến dịch Hồ Chí Minh must use VTV24 video`);
  assert.match(hv?.title, /30\/4\/1975/);
  assert.equal(hv?.watchUrl, 'https://www.youtube.com/watch?v=ecJSxFzvSKk');
  assert.ok(new URL(hv.embedUrl).protocol === 'https:');
  assert.ok(new URL(hv.thumbnail).protocol === 'https:');
}

const ch11Part3 = ch11.detail.parts[2];
assert.equal(ch11Part3.groups?.length, 1);
assert.ok(ch11Part3.warToll);
assert.equal(ch11Part3.warToll.metrics?.length, 4);
assert.ok(ch11Part3.warToll.ta?.items?.length >= 4 && ch11Part3.warToll.enemy?.items?.length >= 4);
assert.equal(ch11Part3.warToll.destructionCards?.length, 4);
const ch11TollText = `${ch11Part3.warToll.ta.items.join('\n')}\n${ch11Part3.warToll.destructionCards.map((c) => `${c.stat} ${c.text}`).join('\n')}`;
for (const expectedStat of [
  '2 triệu thường dân',
  '1,1 triệu',
  '600.000',
  '300.000 liệt sĩ',
  '15 triệu tấn bom đạn',
  '8 triệu tấn bom',
  '3 lần',
  '12 lần',
  '800.000 tấn',
  '6,1 triệu hecta',
  '40.000 người dân',
  '70% cảng biển',
  '80% mạng lưới đường sắt',
  '60% tuyến đường bộ',
  '80 triệu lít',
  '61% là chất độc da cam',
  '3,06 triệu hecta',
  '3,3 triệu ha',
  '4,8 triệu',
  '3 triệu nạn nhân trực tiếp',
]) {
  assert.ok(ch11TollText.includes(expectedStat), `Missing exact user stat in ch11 Part 3: ${expectedStat}`);
}
assert.equal(ch11Part3.media?.image, '/assets/ch11-nan-nhan-da-cam.jpg');
assert.equal(ch11Part3.media?.isDocument, true);
assert.equal(ch11Part3.media?.zoomable, true);
await access('dist' + ch11Part3.media.image);
assert.equal(ch11Part3.media?.diagram?.type, 'war-aftermath-agent-orange');
assert.equal(ch11Part3.media?.youtube?.youtubeId, 'Gks_v2KjxQ0');
assert.equal(ch11Part3.media?.youtube?.title, '60 năm thảm họa da cam | VTV24');
assert.equal(ch11Part3.media?.youtube?.watchUrl, 'https://www.youtube.com/watch?v=Gks_v2KjxQ0&t=71s');
assert.match(ch11Part3.media?.youtube?.embedUrl, /[?&]start=71\b/);
assert.ok(new URL(ch11Part3.media.youtube.embedUrl).protocol === 'https:');
assert.ok(new URL(ch11Part3.media.youtube.thumbnail).protocol === 'https:');
assert.ok(ch11Part3.conclusion?.text);

const ch11Part4 = ch11.detail.parts[3];
assert.equal(ch11Part4.media, undefined);
assert.equal(ch11Part4.contentSections?.length, 2);
for (const sec of ch11Part4.contentSections) {
  assert.ok(sec.cards?.length === 4);
}
assert.ok(ch11.detail.sources.includes('spring'));
assert.ok(ch11.detail.sources.includes('victory'));
assert.ok(ch11.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch11.detail.sources) assert.ok(sources[srcKey]);

const ch12 = introChapters[11];
assert.equal(ch12.available, true);
assert.equal(ch12.href, '/chuong.html?c=12');
assert.equal(ch12.period, '1975–1976');
assert.equal(ch12.detail?.layout, 'three-parts');
assert.equal(ch12.detail?.parts.length, 4);
assert.deepEqual(
  ch12.detail.parts.map((p) => p.theme),
  ['context', 'white', 'context', 'meaning'],
);
const ch12Part1 = ch12.detail.parts[0];
assert.equal(ch12Part1.groups?.length, 2);
const ch12Part1Critical = ch12Part1.groups?.find((g) => g.variant === 'critical');
assert.ok(ch12Part1Critical && ch12Part1Critical.metrics?.length === 3 && ch12Part1Critical.items?.length >= 4);
assert.equal(ch12Part1.media?.image, '/assets/intro-ban-do-viet-nam-thong-nhat.png');
assert.equal(ch12Part1.media?.contain, true);
assert.equal(ch12Part1.media?.zoomable, true);
await access('dist' + ch12Part1.media.image);
assert.equal(ch12Part1.media?.diagram?.type, 'reunification-context-matrix');
assert.ok(ch12Part1.conclusion?.text);

const ch12Part2 = ch12.detail.parts[1];
assert.equal(ch12Part2.stages?.length, 2);
const ch12Milestones = [];
for (const st of ch12Part2.stages) {
  assert.ok(st.id && st.code && st.period && st.title && st.summary && st.outcome);
  assert.ok(st.events?.length >= 2);
  for (const ev of st.events) {
    assert.ok(ev.date && ev.title && ev.detail && ev.extendedDetail);
    assert.equal(ev.noImage, true);
    assert.ok(Array.isArray(ev.keyFacts) && ev.keyFacts.length >= 3);
    ch12Milestones.push(ev);
  }
}
assert.equal(ch12Milestones.length, 4);
assert.equal(ch12Milestones[2].date, '25/4/1976');
assert.equal(ch12Milestones[2].highlight, true);
assert.equal(ch12Milestones[2].documents?.length, 3);
assert.deepEqual(
  ch12Milestones[2].documents.map((doc) => doc.id),
  ['thong-cao-hiep-thuong-chinh-tri-11-1975', 'thong-cao-ket-qua-tong-tuyen-cu-25-4-1976', 'nghi-quyet-ky-hop-thu-nhat-qh6-2-7-1976'],
);
assert.equal(ch12Part2.postOutcome?.sides?.length, 2);
assert.ok(ch12Part2.media?.milestoneInspector?.title);
assert.equal(ch12Part2.media?.diagram?.type, 'election-1976-breakdown');

const ch12Part3 = ch12.detail.parts[2];
assert.equal(ch12Part3.groups?.length, 2);
const ch12Part3Critical = ch12Part3.groups?.find((g) => g.variant === 'critical');
assert.ok(ch12Part3Critical && ch12Part3Critical.metrics?.length === 3 && ch12Part3Critical.items?.length >= 4);
const ch12Part3Text = `${ch12Part3.groups.map((g) => g.items.join('\n')).join('\n')}`;
for (const requiredPhrase of ['24/6', '03/7/1976', '02/7/1976', 'Cộng hòa Xã hội Chủ nghĩa Việt Nam', 'Tôn Đức Thắng', 'Trường Chinh', 'Phạm Văn Đồng', '36 thành viên']) {
  assert.ok(ch12Part3Text.includes(requiredPhrase), `Missing phrase in ch12 Part 3: ${requiredPhrase}`);
}
assert.equal(ch12Part3.media?.image, '/assets/intro-co-viet-nam.svg');
assert.equal(ch12Part3.media?.contain, true);
assert.equal(ch12Part3.media?.zoomable, true);
await access('dist' + ch12Part3.media.image);
assert.equal(ch12Part3.media?.diagram?.type, 'sixth-national-assembly-1976');
assert.ok(ch12Part3.conclusion?.text);

const ch12Part4 = ch12.detail.parts[3];
assert.equal(ch12Part4.media, undefined);
assert.equal(ch12Part4.contentSections?.length, 2);
assert.equal(ch12Part4.contentSections[0].cards?.length, 4);
assert.equal(ch12Part4.contentSections[0].documents?.length, 3);
const ch12Letter = ch12Part4.contentSections[1].letter;
assert.ok(ch12Letter && ch12Letter.salutation && ch12Letter.paragraphs?.length >= 4 && ch12Letter.signature && ch12Letter.team);
assert.ok(ch12Letter.actions?.length >= 4);
assert.ok(
  ch12Letter.actions.some((act) => act.href === '/danh-sach-chuong.html#tom-tat-tong-thong-my'),
  'Expected Chapter 12 letter actions to link to US Presidents summary',
);
for (const act of ch12Letter.actions) {
  assert.ok(act.label && act.href);
}
assert.ok(ch12.detail.sources.includes('spring'));
assert.ok(ch12.detail.sources.includes('victory'));
assert.ok(ch12.detail.sources.includes('vietjack_b8'));
for (const srcKey of ch12.detail.sources) assert.ok(sources[srcKey]);

assert.equal(usPresidentsSummary.length, 6, 'Expected 6 consecutive US Presidents (1945-1975)');
assert.deepEqual(
  usPresidentsSummary.map((p) => [p.orderNumber, p.id]),
  [
    [33, 'truman'],
    [34, 'eisenhower'],
    [35, 'kennedy'],
    [36, 'johnson'],
    [37, 'nixon'],
    [38, 'ford'],
  ],
);
for (const pres of usPresidentsSummary) {
  for (const field of [
    'orderLabel',
    'name',
    'lifeSpan',
    'term',
    'party',
    'eraTag',
    'strategyName',
    'vietnamRole',
    'troopLevelMetric',
    'aidMetric',
    'portrait',
    'portraitAlt',
    'portraitCredit',
    'portraitSourceUrl',
    'bioInfo',
    'turningPoint',
  ]) {
    assert.ok(typeof pres[field] === 'string' && pres[field].trim().length > 0, `Missing ${field} on ${pres.id}`);
    assert.doesNotMatch(pres[field], /\*[^*]+\*/, `Unexpected markdown italics/bold on ${pres.id}.${field}`);
  }
  assert.ok(['dem', 'rep'].includes(pres.partyCode), `Invalid partyCode on ${pres.id}`);
  assert.ok(new URL(pres.portraitSourceUrl).protocol === 'https:', `Expected HTTPS portraitSourceUrl on ${pres.id}`);
  await access('dist' + pres.portrait);
  assert.ok(Array.isArray(pres.policies) && pres.policies.length === 3, `Expected 3 policy items on ${pres.id}`);
  for (const pol of pres.policies) {
    assert.ok(pol.heading && pol.detail, `Missing heading/detail in policy on ${pres.id}`);
    assert.doesNotMatch(pol.heading + ' ' + pol.detail, /\*[^*]+\*/, `Unexpected markdown asterisks in ${pres.id} policy`);
  }
  assert.ok(Array.isArray(pres.relatedChapters) && pres.relatedChapters.length >= 1, `Expected relatedChapters on ${pres.id}`);
  for (const rel of pres.relatedChapters) {
    assert.ok(rel.label && /^\/chuong\.html\?c=(?:[1-9]|1[0-2])$/.test(rel.href), `Invalid related chapter href on ${pres.id}: ${rel.href}`);
  }
}

for (const [chapterIdx, expectedThemes] of [
  [0, ['archive', 'archive-moss', 'archive-sand', 'archive-crimson']],
  [1, ['context', 'white', 'meaning']],
  [2, ['context', 'white']],
  [3, ['context', 'white', 'meaning']],
  [4, ['context', 'white', 'meaning']],
  [5, ['context', 'white', 'meaning']],
  [6, ['context', 'white', 'meaning']],
  [7, ['context', 'white', 'meaning']],
  [8, ['context', 'white', 'meaning']],
  [9, ['context', 'white', 'meaning']],
  [10, ['context', 'white', 'meaning']],
  [11, ['context', 'white', 'meaning']],
]) {
  const detail = introChapters[chapterIdx].detail;
  assert.equal(detail.context, undefined, `Chapter ${chapterIdx + 1} should not have context note`);
  assert.ok(detail.quiz && detail.quiz.title && detail.quiz.subtitle, `Chapter ${chapterIdx + 1} quiz metadata required`);
  assert.equal(detail.quiz.questions.length, 10, `Chapter ${chapterIdx + 1} quiz must have 10 questions`);
  for (const [qIdx, q] of detail.quiz.questions.entries()) {
    assert.ok(q.id && q.partId && q.partLabel && q.theme && q.question && q.explanation, `Missing fields in ch${chapterIdx + 1} q${qIdx + 1}`);
    assert.equal(q.options.length, 4, `Expected 4 options in ch${chapterIdx + 1} q${qIdx + 1}`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `Invalid answer index in ch${chapterIdx + 1} q${qIdx + 1}`);
  }
  const actualThemes = new Set(detail.quiz.questions.map((q) => q.theme));
  for (const themeName of expectedThemes) {
    assert.ok(actualThemes.has(themeName), `Expected theme ${themeName} in ch${chapterIdx + 1} quiz`);
  }
}
assert.ok(
  introChapters[1].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'famine'),
  'Expected famine-themed question in Chapter 2 Part 1 quiz',
);
assert.ok(
  introChapters[2].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 3 Part 1 quiz',
);
assert.ok(
  introChapters[3].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 4 Part 1 quiz',
);
assert.ok(
  introChapters[4].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 5 Part 1 quiz',
);
assert.ok(
  introChapters[5].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 6 Part 1 quiz',
);
assert.ok(
  introChapters[6].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 7 Part 1 quiz',
);
assert.ok(
  introChapters[7].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 8 quiz',
);
assert.ok(
  introChapters[8].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 9 quiz',
);
assert.ok(
  introChapters[9].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 10 quiz',
);
assert.ok(
  introChapters[10].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 11 quiz',
);
assert.ok(
  introChapters[11].detail.quiz.questions.some((q) => q.theme === 'context' && q.variant === 'critical'),
  'Expected critical-themed question in Chapter 12 quiz',
);

for (const file of ['dist/home.mjs', 'dist/chapters.mjs', 'dist/chapter.mjs', 'dist/utils.mjs', 'dist/data.mjs', 'dist/uprising-map-data.mjs', 'dist/styles.css']) {
  await access(file);
}
const chapterJsSrc = await readFile('dist/chapter.mjs', 'utf8');
const stylesCssSrc = await readFile('dist/styles.css', 'utf8');
assert.doesNotMatch(chapterJsSrc, /context-note|GHI CHÚ BỐ CỤC|ĐỌC LỊCH SỬ TRONG BỐI CẢNH|15 chương|15 giai đoạn/);
assert.doesNotMatch(stylesCssSrc, /\.context-note/);
await assert.rejects(access('dist/app.mjs'));

for (const page of ['dist/index.html', 'dist/danh-sach-chuong.html', 'dist/chuong.html']) {
  const html = await readFile(page, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate HTML ids in ${page}`);
  for (const match of html.matchAll(/href="#([^\"]+)"/g)) {
    assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]} in ${page}`);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    const cleanPath = match[1].split('?')[0];
    const target = cleanPath === '/' ? 'dist/index.html' : 'dist' + cleanPath;
    await access(target);
  }
  assert.match(html, /lang="vi"/);
  assert.doesNotMatch(html, /Starter Project|codex-preview|intro-counter|Cảnh 01|8 chương|15 chương|hanh-trinh|app\.mjs|part-jump-nav|chapter-page wrap/);
}

const chaptersPageHtml = await readFile('dist/danh-sach-chuong.html', 'utf8');
assert.match(chaptersPageHtml, /id="tom-tat-tong-thong-my"/);
assert.match(chaptersPageHtml, /id="president-zoom-dialog"/);
const chaptersJsSrc = await readFile('dist/chapters.mjs', 'utf8');
assert.match(chaptersJsSrc, /usPresidentsSummary/);
assert.match(chaptersJsSrc, /renderPresidentsSummary/);
assert.match(chaptersJsSrc, /openPresidentZoom/);

console.log('Passed: 15-scene overview, 12 chapters (Chapters 1–12), 6 US Presidents summary, verified sources, modular JS & 3 HTML pages.');
