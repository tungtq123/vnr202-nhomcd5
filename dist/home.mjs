import { introScenes } from './data.mjs';
import { $, escapeHtml, initMobileNav } from './utils.mjs';

initMobileNav();

const INTRO_KEY = 'dau-an-hoa-binh-intro';
const CHAPTERS_URL = '/danh-sach-chuong.html';
const introDialog = $('#intro-dialog');
const introTimeline = $('#intro-timeline');
let introCursorMs = 0;
const introTimings = introScenes.map((scene) => {
  const startMs = introCursorMs;
  const durationMs = scene.duration * 1000;
  introCursorMs += durationMs;
  return { ...scene, startMs, endMs: introCursorMs, durationMs };
});
const introTotalMs = introCursorMs;
const introTotalSec = Math.round(introTotalMs / 1000);
let introElapsedMs = 0;
let introSceneIndex = -1;
let introSeqFrameIndex = -1;
let introPreloaded = false;
let introPaused = false;
let introOpen = false;
let introRaf = 0;
let lastIntroTick = 0;
let introTrigger = null;

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
}

function goToChaptersPage() {
  introOpen = false;
  cancelAnimationFrame(introRaf);
  markIntroSeen();
  window.location.assign(CHAPTERS_URL);
}

function preloadIntroAssets() {
  if (introPreloaded) return;
  introPreloaded = true;
  for (const scene of introTimings) {
    if (scene.image) new Image().src = scene.image;
    if (scene.secondaryImage) new Image().src = scene.secondaryImage;
    if (scene.flagFinale?.image) new Image().src = scene.flagFinale.image;
    for (const side of [scene.splitBg?.left, scene.splitBg?.right]) {
      const list = Array.isArray(side) ? side : side ? [side] : [];
      for (const src of list) new Image().src = src;
    }
    if (Array.isArray(scene.frames)) {
      for (const frame of scene.frames) new Image().src = frame.image;
    }
    if (Array.isArray(scene.exhibits)) {
      for (const exhibit of scene.exhibits) {
        if (exhibit.image) new Image().src = exhibit.image;
      }
    }
  }
}

if (introTimeline) {
  introTimeline.setAttribute('aria-valuemax', String(introTotalSec));
  introTimeline.innerHTML = introTimings.map((scene) => `<span class="intro-segment" style="flex:${scene.duration}"><i></i></span>`).join('');
}

function formatClock(ms) {
  const total = Math.min(introTotalSec, Math.max(0, Math.floor(ms / 1000)));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function renderSplitBg(splitBg, fallbackBg = '') {
  if (!splitBg) return fallbackBg;
  const renderHalf = (side, sideClass) => {
    const imgs = Array.isArray(side) ? side : side ? [side] : [];
    const layoutClass = imgs.length === 4 ? ' is-allies-4' : imgs.length > 1 ? ' is-stacked' : '';
    const flagClass = (src) => (src.includes('co-my') ? 'is-us-flag' : src.includes('philippines') ? 'is-philippines' : src.includes('australia') ? 'is-australia' : '');
    const imgsHtml = imgs.map((src) => `<img src="${escapeHtml(src)}" alt="" decoding="sync" class="${flagClass(src)}" />`).join('');
    return `<div class="intro-briefing-bg-half ${sideClass}${layoutClass}">${imgsHtml}</div>`;
  };
  return `<div class="intro-briefing-bg-split" aria-hidden="true">${renderHalf(splitBg.left, 'is-left')}${renderHalf(splitBg.right, 'is-right')}<div class="intro-briefing-bg-scrim"></div></div>`;
}

function buildIntroSceneElement(scene) {
  const node = document.createElement('div');
  const bgClass = `intro-bg${scene.preserveColor ? ' preserve-color' : ''}`;
  const bg = scene.image ? `<img class="${bgClass}" src="${scene.image}" alt="" /><div class="intro-scrim"></div>` : '';
  const credit = scene.credit ? `<span class="intro-credit">${escapeHtml(scene.credit)}</span>` : '';
  node.style.setProperty('--scene-duration', `${scene.duration}s`);
  if (scene.layout === 'sequence') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const frames = scene.frames || [];
    const first = frames[0] || { date: '' };
    node.className = `intro-scene is-slide is-sequence${themeClass}`;
    const framesHtml = frames.map((frame, i) => `<img class="intro-sequence-frame${i === 0 ? ' is-active' : ''}" src="${frame.image}" alt="Diễn biến Tổng khởi nghĩa ngày ${escapeHtml(frame.date)}/1945: ${escapeHtml(frame.summary)}" decoding="sync" />`).join('');
    const daysHtml = frames.map((frame, i) => `<button type="button" class="intro-seq-day${i === 0 ? ' is-active' : ''}" data-seq-index="${i}" aria-label="Xem mốc ngày ${escapeHtml(frame.date)}/1945"><span>${escapeHtml(frame.date)}</span><i aria-hidden="true"></i></button>`).join('');
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `<div class="intro-slide intro-sequence-wrap"><header class="intro-slide-head intro-sequence-head"><div class="intro-sequence-top"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><span class="intro-sequence-badge" data-seq-badge>NGÀY ${escapeHtml(first.date)}/1945 · 01/${String(frames.length).padStart(2, '0')}</span></div><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-sequence-stage">${framesHtml}</div><div class="intro-sequence-days" role="group" aria-label="Chọn mốc ngày Tổng khởi nghĩa">${daysHtml}</div>${noteHtml}</div>${credit}`;
  } else if (scene.layout === 'spotlight') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const staticClass = scene.staticMedia ? ' is-static-media' : '';
    const dualClass = scene.secondaryImage ? ' has-secondary' : '';
    node.className = `intro-scene is-slide is-spotlight has-bg${themeClass}${staticClass}${dualClass}`;
    if (scene.paperRatio) {
      const ratio = String(scene.paperRatio).includes('/')
        ? scene.paperRatio.split('/').reduce((a, b) => Number(a) / Number(b))
        : Number(scene.paperRatio);
      if (Number.isFinite(ratio) && ratio > 0) node.style.setProperty('--paper-aspect', ratio.toFixed(4));
    }
    if (scene.secondaryRatio) {
      const sRatio = String(scene.secondaryRatio).includes('/')
        ? scene.secondaryRatio.split('/').reduce((a, b) => Number(a) / Number(b))
        : Number(scene.secondaryRatio);
      if (Number.isFinite(sRatio) && sRatio > 0) node.style.setProperty('--secondary-aspect', sRatio.toFixed(4));
    }
    const quoteHtml = scene.quote ? `<blockquote class="intro-spotlight-quote">${escapeHtml(scene.quote)}</blockquote>` : '';
    const highlightsHtml = scene.highlights?.length
      ? `<div class="intro-spotlight-points">${scene.highlights.map((item) => `<div class="intro-spotlight-point"><strong>${escapeHtml(item.tag)}</strong><span>${escapeHtml(item.text)}</span></div>`).join('')}</div>`
      : '';
    const metaHtml = scene.meta ? `<p class="intro-spotlight-meta">${escapeHtml(scene.meta)}</p>` : '';
    const captionHtml = scene.caption ? `<figcaption>${escapeHtml(scene.caption)}</figcaption>` : '';
    if (scene.secondaryImage) {
      const secCaptionHtml = scene.secondaryCaption ? `<figcaption>${escapeHtml(scene.secondaryCaption)}</figcaption>` : '';
      const sealHtml = scene.meta ? `<div class="intro-finale-seal">${scene.metaTag ? `<small>${escapeHtml(scene.metaTag)}</small>` : ''}<p>${escapeHtml(scene.meta)}</p></div>` : '';
      node.innerHTML = `<div class="intro-slide intro-finale-wrap"><header class="intro-slide-head intro-finale-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-finale-grid"><div class="intro-finale-points">${highlightsHtml}</div><figure class="intro-spotlight-frame intro-finale-map"><div class="intro-spotlight-paper"><img src="${scene.image}" alt="${escapeHtml(scene.caption || scene.title)}" decoding="sync" /></div>${captionHtml}</figure><div class="intro-finale-photo-col"><figure class="intro-spotlight-frame intro-finale-photo"><div class="intro-finale-photo-box"><img src="${scene.secondaryImage}" alt="${escapeHtml(scene.secondaryCaption || scene.title)}" decoding="sync" /></div>${secCaptionHtml}</figure>${sealHtml}</div></div></div>${credit}`;
    } else {
      node.innerHTML = `<div class="intro-spotlight"><div class="intro-spotlight-copy"><header class="intro-slide-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header>${quoteHtml}${highlightsHtml}${metaHtml}</div><figure class="intro-spotlight-frame"><div class="intro-spotlight-paper"><img src="${scene.image}" alt="${escapeHtml(scene.caption || scene.title)}" decoding="sync" /></div>${captionHtml}</figure></div>${credit}`;
    }
  } else if (scene.layout === 'river') {
    node.className = 'intro-scene is-slide is-river';
    const riverPath = 'M 60 6 C 46 22, 32 32, 32 50 C 32 95, 88 105, 88 150 C 88 195, 32 205, 32 250 C 32 295, 88 305, 88 350 C 88 370, 72 384, 60 396';
    const rowsHtml = (scene.cards || []).map((card, i) => `<div class="intro-river-row ${i % 2 === 0 ? 'is-left' : 'is-right'}" style="--step:${i}"><span class="intro-river-pin" aria-hidden="true"><i></i></span><article class="intro-river-card"><small>${escapeHtml(card.tag)}</small><strong>${escapeHtml(card.heading)}</strong><p>${escapeHtml(card.detail)}</p></article></div>`).join('');
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `<div class="intro-slide intro-river-wrap"><header class="intro-slide-head intro-river-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-river"><div class="intro-river-track" aria-hidden="true"><svg class="intro-river-svg" viewBox="0 0 120 400" preserveAspectRatio="none"><defs><linearGradient id="intro-river-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8eb5b0"/><stop offset="52%" stop-color="#d2b49d"/><stop offset="100%" stop-color="#c94b38"/></linearGradient></defs><path class="intro-river-bank" d="${riverPath}" pathLength="100"/><path class="intro-river-water" d="${riverPath}" pathLength="100"/><path class="intro-river-shimmer" d="${riverPath}" pathLength="100"/></svg></div>${rowsHtml}</div>${noteHtml}</div>${credit}`;
  } else if (scene.layout === 'gallery') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const variantClass = scene.galleryVariant === 'portrait' ? ' is-portrait-pair' : '';
    node.className = `intro-scene is-slide is-gallery${themeClass}${variantClass}`;
    const exhibitsHtml = (scene.exhibits || []).map((ex, i) => {
      let ratioNum = 1.5;
      if (ex.ratio) {
        const parsed = String(ex.ratio).includes('/')
          ? ex.ratio.split('/').reduce((a, b) => Number(a) / Number(b))
          : Number(ex.ratio);
        if (Number.isFinite(parsed) && parsed > 0) ratioNum = parsed;
      }
      const pointsHtml = (ex.points || []).map((pt) => `<li>${escapeHtml(pt)}</li>`).join('');
      const captionHtml = ex.caption ? `<figcaption>${escapeHtml(ex.caption)}</figcaption>` : '';
      return `<article class="intro-gallery-card" style="--gallery-step:${i};--exhibit-ratio:${ratioNum.toFixed(4)}"><figure class="intro-gallery-figure"><div class="intro-gallery-media"><div class="intro-gallery-frame"><img src="${ex.image}" alt="${escapeHtml(ex.alt || ex.caption || ex.heading)}" decoding="sync" /></div></div>${captionHtml}</figure><div class="intro-gallery-copy"><small>${escapeHtml(ex.tag || '')}</small><strong>${escapeHtml(ex.heading || '')}</strong><ul class="intro-gallery-list">${pointsHtml}</ul></div></article>`;
    }).join('');
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `<div class="intro-slide intro-gallery-wrap"><header class="intro-slide-head intro-gallery-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-gallery-grid">${exhibitsHtml}</div>${noteHtml}</div>${credit}`;
  } else if (scene.layout === 'split') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const divider = scene.divider || { label: 'VĨ TUYẾN 17', sub: 'Sông Bến Hải' };
    const [leftCard = '', rightCard = ''] = (scene.sides || []).map((side, i) => {
      const toneClass = side.tone === 'north' ? 'is-north' : side.tone === 'south' ? 'is-south' : '';
      const badgeHtml = side.badge ? `<span class="intro-split-badge">${escapeHtml(side.badge)}</span>` : '';
      const pointsHtml = (side.points || []).map((pt) => `<li>${escapeHtml(pt)}</li>`).join('');
      return `<article class="intro-split-card ${toneClass}" style="--split-step:${i}"><div class="intro-split-top"><span class="intro-split-region">${escapeHtml(side.region || '')}</span>${badgeHtml}</div><h3 class="intro-split-state">${escapeHtml(side.state || '')}</h3><p class="intro-split-leader">${escapeHtml(side.leader || '')}</p><ul class="intro-split-list">${pointsHtml}</ul></article>`;
    });
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    if (scene.image) {
      node.className = `intro-scene is-slide is-split has-map${themeClass}`;
      if (scene.mapRatio) {
        const parsed = String(scene.mapRatio).includes('/')
          ? scene.mapRatio.split('/').reduce((a, b) => Number(a) / Number(b))
          : Number(scene.mapRatio);
        if (Number.isFinite(parsed) && parsed > 0) node.style.setProperty('--map-aspect', parsed.toFixed(4));
      }
      const hDividerHtml = `<div class="intro-split-hdiv" aria-hidden="true"><span class="intro-split-hline"></span><span class="intro-split-hpill">${escapeHtml(divider.label)}${divider.sub ? ` · ${escapeHtml(divider.sub)}` : ''}</span><span class="intro-split-hline"></span></div>`;
      const captionHtml = scene.caption ? `<figcaption>${escapeHtml(scene.caption)}</figcaption>` : '';
      node.innerHTML = `<div class="intro-slide intro-split-map-wrap"><div class="intro-split-stack"><header class="intro-slide-head intro-split-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header>${leftCard}${hDividerHtml}${rightCard}${noteHtml}</div><figure class="intro-split-map-col"><div class="intro-split-map"><img src="${scene.image}" alt="${escapeHtml(scene.caption || scene.title)}" decoding="sync" /></div>${captionHtml}</figure></div>${credit}`;
    } else {
      node.className = `intro-scene is-slide is-split${themeClass} motion-${escapeHtml(scene.motion || 'zoom-in')}`;
      const dividerHtml = `<div class="intro-split-divider" aria-hidden="true"><span class="intro-split-line"></span><div class="intro-split-seal"><strong>${escapeHtml(divider.label)}</strong>${divider.sub ? `<small>${escapeHtml(divider.sub)}</small>` : ''}</div><span class="intro-split-line"></span></div>`;
      node.innerHTML = `<div class="intro-slide intro-split-wrap"><header class="intro-slide-head intro-split-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-split-grid">${leftCard}${dividerHtml}${rightCard}</div>${noteHtml}</div>${credit}`;
    }
  } else if (scene.layout === 'phases') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    node.className = `intro-scene is-slide is-phases${themeClass}`;
    const [phase1 = '', phase2 = ''] = (scene.phases || []).map((phase, i) => {
      const toneClass = phase.tone ? ` is-${escapeHtml(phase.tone)}` : '';
      const badgeHtml = phase.badge ? `<span class="intro-phase-badge">${escapeHtml(phase.badge)}</span>` : '';
      const pointsHtml = (phase.points || []).map((pt) => `<li>${escapeHtml(pt)}</li>`).join('');
      return `<article class="intro-phase-card${toneClass}" style="--phase-step:${i}"><div class="intro-phase-top"><span class="intro-phase-period">${escapeHtml(phase.period || '')}</span>${badgeHtml}</div><h3>${escapeHtml(phase.heading || '')}</h3><ul class="intro-phase-list">${pointsHtml}</ul></article>`;
    });
    const arrowHtml = `<div class="intro-phase-arrow" aria-hidden="true"><span></span><b>→</b></div>`;
    const impactsHtml = (scene.impacts || []).map((item, i) => `<article class="intro-impact-card${item.highlight ? ' is-highlight' : ''}" style="--impact-step:${i}"><small>${escapeHtml(item.tag || '')}</small><p>${escapeHtml(item.text || '')}</p></article>`).join('');
    const flagSrc = scene.flagFinale?.image ? escapeHtml(scene.flagFinale.image) : '';
    const flagOverlayHtml = scene.flagFinale
      ? `<div class="intro-flag-takeover" aria-hidden="true">${flagSrc ? `<img class="intro-flag-takeover-bg" src="${flagSrc}" alt="" decoding="sync" />` : ''}<div class="intro-flag-takeover-scrim"></div><div class="intro-flag-takeover-inner"><span class="intro-flag-takeover-badge">${escapeHtml(scene.flagFinale.badge || '')}</span><h3>${escapeHtml(scene.flagFinale.title || '')}</h3>${scene.flagFinale.sub ? `<p>${escapeHtml(scene.flagFinale.sub)}</p>` : ''}</div></div>`
      : '';
    node.innerHTML = `<div class="intro-slide intro-phases-wrap"><header class="intro-slide-head intro-phases-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-phases-row">${phase1}${arrowHtml}${phase2}</div><section class="intro-impact-block" aria-label="${escapeHtml(scene.impactsTitle || 'Ý nghĩa')}"><p class="intro-impact-heading"><span></span>${escapeHtml(scene.impactsTitle || 'Ý NGHĨA')}</p><div class="intro-impact-grid">${impactsHtml}</div></section></div>${flagOverlayHtml}${credit}`;
  } else if (scene.layout === 'versus') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const splitBgClass = scene.splitBg ? ' has-split-bg' : '';
    node.className = `intro-scene is-slide is-versus${themeClass}${splitBgClass}`;
    const columnsHtml = (scene.columns || []).map((col, i) => {
      const toneClass = col.tone ? ` is-${escapeHtml(col.tone)}` : '';
      const badgeHtml = col.badge ? `<span class="intro-versus-badge">${escapeHtml(col.badge)}</span>` : '';
      const pointsHtml = col.points?.length ? `<ul class="intro-versus-list">${col.points.map((pt) => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>` : '';
      const colPillsHtml = col.pills?.length
        ? `<div class="intro-versus-pills-block">${col.pillsTitle ? `<small class="intro-versus-sublabel">${escapeHtml(col.pillsTitle)}</small>` : ''}<div class="intro-versus-pills">${col.pills.map((pill) => `<span>${escapeHtml(pill)}</span>`).join('')}</div></div>`
        : '';
      const groupsHtml = col.groups?.length
        ? `<div class="intro-versus-groups">${col.groups.map((group) => `<div class="intro-versus-group"><small class="intro-versus-group-label">${escapeHtml(group.label || '')}</small>${group.desc ? `<p>${escapeHtml(group.desc)}</p>` : ''}<div class="intro-versus-pills">${(group.pills || []).map((pill) => `<span>${escapeHtml(pill)}</span>`).join('')}</div></div>`).join('')}</div>`
        : '';
      return `<article class="intro-versus-card${toneClass}" style="--versus-step:${i}"><div class="intro-versus-top"><span class="intro-versus-tag">${escapeHtml(col.tag || '')}</span>${badgeHtml}</div><h3>${escapeHtml(col.heading || '')}</h3>${pointsHtml}${colPillsHtml}${groupsHtml}</article>`;
    }).join('');
    const splitBgHtml = renderSplitBg(scene.splitBg, bg);
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `${splitBgHtml}<div class="intro-slide intro-versus-wrap"><header class="intro-slide-head intro-versus-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-versus-grid">${columnsHtml}</div>${noteHtml}</div>${credit}`;
  } else if (scene.layout === 'briefing') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const splitBgClass = scene.splitBg ? ' has-split-bg' : '';
    const bgStateClass = !scene.splitBg && scene.image ? ' has-bg' : '';
    node.className = `intro-scene is-slide is-briefing${themeClass}${splitBgClass}${bgStateClass}`;
    const main = scene.main || {};
    const statsPanel = scene.statsPanel || {};
    const mainPointsHtml = (main.points || []).map((pt) => `<li>${escapeHtml(pt)}</li>`).join('');
    const objectivesHtml = main.objectives?.length
      ? `<div class="intro-briefing-objs">${main.objectivesTitle ? `<small>${escapeHtml(main.objectivesTitle)}</small>` : ''}<ul>${main.objectives.map((obj) => `<li>${escapeHtml(obj)}</li>`).join('')}</ul></div>`
      : '';
    const metricsHtml = (statsPanel.metrics || []).map((m, i) => `<div class="intro-briefing-metric" style="--metric-step:${i}"><strong>${escapeHtml(m.value || '')}</strong><span>${escapeHtml(m.label || '')}</span></div>`).join('');
    const splitBgHtml = renderSplitBg(scene.splitBg, bg);
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `${splitBgHtml}<div class="intro-slide intro-briefing-wrap"><header class="intro-slide-head intro-briefing-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-briefing-grid"><article class="intro-briefing-card is-left"><div class="intro-briefing-top"><span class="intro-briefing-tag">${escapeHtml(main.tag || '')}</span>${main.badge ? `<span class="intro-briefing-badge">${escapeHtml(main.badge)}</span>` : ''}</div><h3>${escapeHtml(main.heading || '')}</h3><ul class="intro-briefing-list">${mainPointsHtml}</ul>${objectivesHtml}</article><article class="intro-briefing-card is-right"><div class="intro-briefing-top"><span class="intro-briefing-tag">${escapeHtml(statsPanel.tag || '')}</span>${statsPanel.badge ? `<span class="intro-briefing-badge">${escapeHtml(statsPanel.badge)}</span>` : ''}</div><h3>${escapeHtml(statsPanel.heading || '')}</h3><div class="intro-briefing-metrics">${metricsHtml}</div><p class="intro-briefing-outcome">${escapeHtml(statsPanel.outcome || '')}</p></article></div>${noteHtml}</div>${credit}`;
  } else if (scene.layout === 'slide') {
    const themeClass = scene.theme ? ` theme-${escapeHtml(scene.theme)}` : '';
    const splitBgClass = scene.splitBg ? ' has-split-bg' : '';
    const bgStateClass = scene.splitBg || scene.image ? ' has-bg' : '';
    const bgStyleClass = scene.bgStyle ? ` is-${escapeHtml(scene.bgStyle)}` : '';
    const denseClass = scene.dense ? ' is-dense' : '';
    node.className = `intro-scene is-slide${themeClass}${splitBgClass}${bgStateClass}${bgStyleClass}${denseClass} motion-${escapeHtml(scene.motion || 'zoom-in')}`;
    const colsClass = scene.cards?.length === 4 ? ' cols-4' : '';
    const cardsHtml = (scene.cards || []).map((card, i) => {
      const bodyHtml = Array.isArray(card.items)
        ? `<ul class="intro-slide-bullets">${card.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : `<p>${escapeHtml(card.detail || '')}</p>`;
      return `<article class="intro-slide-card" style="--stagger:${i}"><small>${escapeHtml(card.tag)}</small><strong>${escapeHtml(card.heading)}</strong>${bodyHtml}</article>`;
    }).join('');
    const bgHtml = renderSplitBg(scene.splitBg, bg);
    const noteHtml = scene.note ? `<p class="intro-slide-note">${escapeHtml(scene.note)}</p>` : '';
    node.innerHTML = `${bgHtml}<div class="intro-slide"><header class="intro-slide-head"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p class="intro-slide-lead">${escapeHtml(scene.lead || '')}</p></header><div class="intro-slide-cards${colsClass}">${cardsHtml}</div>${noteHtml}</div>${credit}`;
  } else {
    node.className = `intro-scene ${scene.image ? '' : 'typographic '}motion-${scene.motion || 'zoom-in'}`;
    node.innerHTML = `${bg}<div class="intro-copy"><p class="intro-eyebrow">${escapeHtml(scene.eyebrow)}</p><h2>${escapeHtml(scene.title)}</h2><p>${escapeHtml(scene.text)}</p></div>${credit}`;
  }
  return node;
}

function syncIntroSequence(index, elapsedMs) {
  const scene = introTimings[index];
  if (!scene || scene.layout !== 'sequence' || !scene.frames?.length) return;
  const activeNode = $('#intro-stage')?.querySelector('.intro-scene:not(.is-exiting)');
  if (!activeNode) return;
  const frameMs = (scene.frameDuration || 2) * 1000;
  const localMs = Math.max(0, elapsedMs - scene.startMs);
  const targetFrame = Math.min(scene.frames.length - 1, Math.floor(localMs / frameMs));
  const frameRatio = Math.max(0, Math.min(1, (localMs - targetFrame * frameMs) / frameMs));
  const dayButtons = activeNode.querySelectorAll('.intro-seq-day');
  if (targetFrame !== introSeqFrameIndex) {
    const prevFrame = introSeqFrameIndex;
    introSeqFrameIndex = targetFrame;
    const frameImgs = activeNode.querySelectorAll('.intro-sequence-frame');
    frameImgs.forEach((img, i) => {
      img.classList.remove('is-prev', 'is-active');
      if (i === prevFrame && prevFrame !== targetFrame) img.classList.add('is-prev');
      if (i === targetFrame) img.classList.add('is-active');
    });
    const badge = activeNode.querySelector('[data-seq-badge]');
    const current = scene.frames[targetFrame];
    if (badge && current) badge.textContent = `NGÀY ${current.date}/1945 · ${String(targetFrame + 1).padStart(2, '0')}/${String(scene.frames.length).padStart(2, '0')}`;
  }
  dayButtons.forEach((btn, i) => {
    btn.classList.toggle('is-active', i === targetFrame);
    btn.classList.toggle('is-done', i < targetFrame);
    const bar = btn.querySelector('i');
    if (bar) bar.style.transform = `scaleX(${i < targetFrame ? 1 : i === targetFrame ? frameRatio : 0})`;
  });
}

function renderIntroScene(index, animateTransition = true) {
  const prevIndex = introSceneIndex;
  introSceneIndex = index;
  introSeqFrameIndex = -1;
  const scene = introTimings[index];
  const stage = $('#intro-stage');
  for (const stale of stage.querySelectorAll('.intro-scene.is-exiting')) stale.remove();
  const prevNode = stage.querySelector('.intro-scene:not(.is-exiting)');
  const nextNode = buildIntroSceneElement(scene);
  if (scene.flagFinale) {
    const localSec = Math.max(0, (introElapsedMs - scene.startMs) / 1000);
    if (localSec > 0.25) nextNode.style.setProperty('--flag-delay', `${(4 - localSec).toFixed(2)}s`);
  }
  if (animateTransition && prevNode && prevIndex >= 0 && prevIndex !== index) {
    let transition = scene.transition || 'fade';
    if (index < prevIndex) transition = 'slide-prev';
    else if (prevIndex === 0 && index === 1) transition = 'curtain-slide';
    prevNode.classList.add('is-exiting', `exit-${transition}`);
    nextNode.classList.add(`enter-${transition}`);
    setTimeout(() => prevNode.remove(), 680);
  } else if (prevNode) {
    prevNode.remove();
  }
  stage.append(nextNode);
  if (scene.layout === 'sequence') syncIntroSequence(index, introElapsedMs);
  if ($('#intro-prev')) $('#intro-prev').disabled = index === 0;
}

function jumpToIntroScene(index) {
  if (!introTimings[index]) return;
  introElapsedMs = introTimings[index].startMs + 20;
  lastIntroTick = performance.now();
  renderIntroScene(index, index !== introSceneIndex);
  updateIntroProgress();
}

function updateIntroProgress() {
  const sec = Math.min(introTotalSec, Math.floor(introElapsedMs / 1000));
  $('#intro-time').textContent = `${formatClock(introElapsedMs)} / ${formatClock(introTotalMs)}`;
  introTimeline.setAttribute('aria-valuenow', String(sec));
  const bars = introTimeline.querySelectorAll('.intro-segment i');
  introTimings.forEach((scene, i) => {
    const ratio = Math.max(0, Math.min(1, (introElapsedMs - scene.startMs) / scene.durationMs));
    if (bars[i]) bars[i].style.transform = `scaleX(${ratio})`;
  });
}

function tickIntro(now) {
  if (!introOpen || introPaused) return;
  const dt = lastIntroTick ? Math.min(100, now - lastIntroTick) : 0;
  lastIntroTick = now;
  introElapsedMs = Math.min(introTotalMs, introElapsedMs + dt);
  const nextIndex = introTimings.findIndex((scene) => introElapsedMs < scene.endMs);
  const targetIndex = nextIndex === -1 ? introTimings.length - 1 : nextIndex;
  if (targetIndex !== introSceneIndex) renderIntroScene(targetIndex);
  else if (introTimings[introSceneIndex]?.layout === 'sequence') syncIntroSequence(introSceneIndex, introElapsedMs);
  updateIntroProgress();
  if (introElapsedMs >= introTotalMs) {
    goToChaptersPage();
    return;
  }
  introRaf = requestAnimationFrame(tickIntro);
}

function openIntro(trigger = null) {
  if (!introDialog || !introTimings.length) return;
  preloadIntroAssets();
  introTrigger = trigger;
  introElapsedMs = 0;
  introSceneIndex = -1;
  introSeqFrameIndex = -1;
  introPaused = false;
  lastIntroTick = 0;
  introDialog.classList.remove('is-closing', 'is-paused');
  $('#intro-stage').replaceChildren();
  $('#intro-toggle').textContent = 'Tạm dừng';
  $('#intro-toggle').setAttribute('aria-pressed', 'false');
  renderIntroScene(0, false);
  updateIntroProgress();
  if (!introDialog.open) introDialog.showModal();
  introOpen = true;
  introRaf = requestAnimationFrame(tickIntro);
}

function closeIntroToHome() {
  if (!introOpen) return;
  introOpen = false;
  cancelAnimationFrame(introRaf);
  markIntroSeen();
  document.documentElement.classList.remove('has-intro');
  if (new URLSearchParams(location.search).has('intro')) {
    history.replaceState(null, '', '/');
  }
  const finish = () => {
    introDialog.classList.remove('is-closing');
    if (introDialog.open) introDialog.close();
    if (introTrigger?.isConnected) introTrigger.focus({ preventScroll: true });
    introTrigger = null;
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  else {
    introDialog.classList.add('is-closing');
    setTimeout(finish, 340);
  }
}

if (introDialog) {
  $('#intro-skip')?.addEventListener('click', goToChaptersPage);
  $('#intro-close')?.addEventListener('click', closeIntroToHome);
  $('#intro-toggle')?.addEventListener('click', () => {
    introPaused = !introPaused;
    introDialog.classList.toggle('is-paused', introPaused);
    $('#intro-toggle').textContent = introPaused ? 'Tiếp tục' : 'Tạm dừng';
    $('#intro-toggle').setAttribute('aria-pressed', String(introPaused));
    if (!introPaused && introOpen) {
      lastIntroTick = performance.now();
      introRaf = requestAnimationFrame(tickIntro);
    }
  });
  $('#intro-prev')?.addEventListener('click', () => {
    if (introSceneIndex > 0) jumpToIntroScene(introSceneIndex - 1);
  });
  $('#intro-next')?.addEventListener('click', () => {
    if (introSceneIndex < introTimings.length - 1) jumpToIntroScene(introSceneIndex + 1);
    else goToChaptersPage();
  });
  $('#intro-stage')?.addEventListener('click', (event) => {
    const dayBtn = event.target.closest('[data-seq-index]');
    if (!dayBtn) return;
    const scene = introTimings[introSceneIndex];
    if (!scene || scene.layout !== 'sequence') return;
    const frameIdx = Number(dayBtn.dataset.seqIndex);
    const frameMs = (scene.frameDuration || 2) * 1000;
    introElapsedMs = Math.min(scene.endMs - 20, scene.startMs + frameIdx * frameMs + 20);
    lastIntroTick = performance.now();
    syncIntroSequence(introSceneIndex, introElapsedMs);
    updateIntroProgress();
  });
  introTimeline?.addEventListener('click', (event) => {
    const box = introTimeline.getBoundingClientRect();
    if (!box.width) return;
    const ratio = Math.max(0, Math.min(0.999, (event.clientX - box.left) / box.width));
    introElapsedMs = ratio * introTotalMs;
    lastIntroTick = performance.now();
    const index = introTimings.findIndex((scene) => introElapsedMs < scene.endMs);
    const targetIndex = index === -1 ? introTimings.length - 1 : index;
    if (targetIndex !== introSceneIndex) renderIntroScene(targetIndex, true);
    else if (introTimings[targetIndex]?.layout === 'sequence') syncIntroSequence(targetIndex, introElapsedMs);
    else if (introTimings[targetIndex]?.flagFinale) renderIntroScene(targetIndex, false);
    updateIntroProgress();
  });
  introDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeIntroToHome();
  });
  introDialog.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !event.target.closest('button')) {
      event.preventDefault();
      $('#intro-toggle')?.click();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      $('#intro-next')?.click();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      $('#intro-prev')?.click();
    }
  });

  $('#replay-intro')?.addEventListener('click', (event) => openIntro(event.currentTarget));
  $('#header-watch-intro')?.addEventListener('click', (event) => openIntro(event.currentTarget));
  $('#mobile-watch-intro')?.addEventListener('click', (event) => openIntro(event.currentTarget));

  const forceIntro = new URLSearchParams(location.search).has('intro');
  let seenIntro = false;
  try {
    seenIntro = sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    /* Storage can be unavailable. */
  }
  if (!seenIntro || forceIntro) {
    try {
      openIntro();
    } catch {
      document.documentElement.classList.remove('has-intro');
    }
  } else {
    document.documentElement.classList.remove('has-intro');
  }
}
