import { introChapters, introScenes, usPresidentsSummary } from './data.mjs';
import { $, escapeHtml } from './utils.mjs';

try {
  sessionStorage.setItem('dau-an-hoa-binh-intro', '1');
} catch {
  /* Storage can be unavailable in private browsing. */
}

const totalSec = introScenes.reduce((sum, scene) => sum + scene.duration, 0);
const durationLabel = totalSec < 60
  ? `${totalSec}s`
  : totalSec % 60 === 0
    ? `${totalSec / 60} phút`
    : `${Math.floor(totalSec / 60)} phút ${totalSec % 60}s`;

const watchBtn = $('#chapters-watch-intro');
if (watchBtn) watchBtn.textContent = `↺ Xem lại video ${durationLabel}`;

function formatChapterRanges(items) {
  const nums = items.map((item) => item.sceneNumber).sort((a, b) => a - b);
  const parts = [];
  let i = 0;
  while (i < nums.length) {
    const start = nums[i];
    let end = start;
    while (i + 1 < nums.length && nums[i + 1] === end + 1) {
      i += 1;
      end = nums[i];
    }
    parts.push(start === end ? `Chương ${start}` : `Chương ${start}–${end}`);
    i += 1;
  }
  if (parts.length <= 1) return parts[0] || '';
  return `${parts.slice(0, -1).join(', ')} và ${parts[parts.length - 1]}`;
}

const subEl = $('#intro-choice-sub');
if (subEl) {
  const ready = introChapters.filter((item) => item.available);
  const pending = introChapters.filter((item) => !item.available);
  const comingSoonCount = pending.length;
  const contiguous = ready.every((item, idx) => item.sceneNumber === idx + 1);
  const readyLabel = formatChapterRanges(ready);
  const pendingLabel = contiguous ? `${comingSoonCount} chương tiếp theo` : formatChapterRanges(pending);
  subEl.textContent = comingSoonCount > 0
    ? `Đã mở ${readyLabel} để đọc nội dung chi tiết; ${pendingLabel} đang được xây dựng và cập nhật dần.`
    : `Đã mở toàn bộ ${ready.length} chương chuyên đề để đọc nội dung chi tiết.`;
}

const grid = $('#intro-choices');
if (grid) {
  grid.innerHTML = introChapters.map((item) => {
    const meta = `<span class="intro-choice-meta">${escapeHtml(item.shortLabel)} · ${escapeHtml(item.period)}</span>`;
    const title = `<strong>${escapeHtml(item.label)}</strong>`;
    if (item.available && item.href) {
      return `<a href="${escapeHtml(item.href)}" class="intro-choice-card is-available" role="listitem">${meta}${title}</a>`;
    }
    return `<button type="button" class="intro-choice-card is-coming-soon" role="listitem" disabled aria-disabled="true">${meta}<span class="intro-choice-badge">Coming soon</span>${title}</button>`;
  }).join('');
}

const presidentsSection = $('#tom-tat-tong-thong-my');
const zoomDialog = $('#president-zoom-dialog');
let activePresidentFilter = 'all';
let lastZoomTrigger = null;

const ARC_SCALES = {
  truman: { pct: 16, shortTerm: '1945–1953', badge: 'MAAG · Viện trợ Pháp' },
  eisenhower: { pct: 24, shortTerm: '1953–1961', badge: 'Domino · Mỹ–Diệm' },
  kennedy: { pct: 38, shortTerm: '1961–1963', badge: 'Chiến tranh đặc biệt' },
  johnson: { pct: 100, shortTerm: '1963–1969', badge: 'Chiến tranh cục bộ' },
  nixon: { pct: 56, shortTerm: '1969–1974', badge: 'Việt Nam hóa · Pa-ri' },
  ford: { pct: 8, shortTerm: '1974–1975', badge: 'Case–Church · Rút lui' },
};

function closePresidentZoom() {
  if (!zoomDialog?.open) return;
  zoomDialog.close();
  if (lastZoomTrigger?.isConnected) {
    lastZoomTrigger.focus({ preventScroll: true });
  }
  lastZoomTrigger = null;
}

function openPresidentZoom(presId, triggerEl = null) {
  const pres = usPresidentsSummary.find((item) => item.id === presId);
  if (!pres || !zoomDialog) return;
  lastZoomTrigger = triggerEl;
  zoomDialog.innerHTML = `
    <div class="zoom-shell president-zoom-shell">
      <header class="zoom-head">
        <div>
          <p class="pres-zoom-eyebrow">${escapeHtml(pres.orderLabel)} · ${escapeHtml(pres.party)} · ${escapeHtml(pres.term)}</p>
          <h2 id="president-zoom-title">${escapeHtml(pres.name)} (${escapeHtml(pres.lifeSpan)})</h2>
        </div>
        <button type="button" class="doc-close-btn" id="pres-zoom-close" aria-label="Đóng ảnh chân dung">✕</button>
      </header>
      <div class="zoom-stage president-zoom-stage">
        <img src="${escapeHtml(pres.portrait)}" alt="${escapeHtml(pres.portraitAlt)}" />
      </div>
      <footer class="zoom-foot">
        <p>${escapeHtml(pres.portraitCredit)} — ${escapeHtml(pres.strategyName)}</p>
        <a class="source-link" href="${escapeHtml(pres.portraitSourceUrl)}" target="_blank" rel="noopener noreferrer">Xem hồ sơ ảnh gốc ↗</a>
      </footer>
    </div>
  `;
  zoomDialog.querySelector('#pres-zoom-close')?.addEventListener('click', closePresidentZoom);
  if (!zoomDialog.open) zoomDialog.showModal();
}

if (zoomDialog) {
  zoomDialog.addEventListener('click', (event) => {
    if (event.target === zoomDialog) closePresidentZoom();
  });
  zoomDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePresidentZoom();
  });
}

function renderPresidentCard(pres, index) {
  const policiesHtml = pres.policies
    .map(
      (pol, pIdx) => `
      <li class="president-policy-item">
        <strong>${escapeHtml(String(pIdx + 1).padStart(2, '0'))}. ${escapeHtml(pol.heading)}</strong>
        <p>${escapeHtml(pol.detail)}</p>
      </li>
    `,
    )
    .join('');

  const chapterLinksHtml = pres.relatedChapters
    .map(
      (ch) =>
        `<a href="${escapeHtml(ch.href)}" class="president-chapter-chip">${escapeHtml(ch.label)} <span aria-hidden="true">↗</span></a>`,
    )
    .join('');

  return `
    <article class="president-card${activePresidentFilter === pres.id ? ' is-focused' : ''}" data-president-id="${escapeHtml(pres.id)}">
      <div class="president-card-top">
        <div class="president-portrait-wrap">
          <button type="button" class="president-portrait-btn" data-zoom-president="${escapeHtml(pres.id)}" aria-label="Phóng to ảnh chân dung ${escapeHtml(pres.name)}">
            <img src="${escapeHtml(pres.portrait)}" alt="${escapeHtml(pres.portraitAlt)}" loading="lazy" />
            <span class="president-zoom-tag">Phóng to ⤢</span>
          </button>
          <a class="president-portrait-credit" href="${escapeHtml(pres.portraitSourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pres.portraitCredit)} ↗</a>
        </div>
        <div class="president-identity">
          <div class="president-badges">
            <span class="president-era-badge">${escapeHtml(String(index + 1).padStart(2, '0'))}/06 · ${escapeHtml(pres.eraTag)}</span>
            <span class="president-party-badge is-${escapeHtml(pres.partyCode)}">${escapeHtml(pres.party)}</span>
          </div>
          <h3 class="president-name">${escapeHtml(pres.name)}</h3>
          <dl class="president-meta-list">
            <div class="president-meta-row">
              <dt>Thứ tự &amp; Nhiệm kỳ</dt>
              <dd>${escapeHtml(pres.orderLabel)} · <span>${escapeHtml(pres.term)}</span></dd>
            </div>
            <div class="president-meta-row">
              <dt>Năm sinh – Năm mất</dt>
              <dd>${escapeHtml(pres.lifeSpan)}</dd>
            </div>
            <div class="president-meta-row">
              <dt>Chiến lược chủ đạo</dt>
              <dd class="is-strategy">${escapeHtml(pres.strategyName)}</dd>
            </div>
            <div class="president-meta-row">
              <dt>Quy mô lực lượng &amp; viện trợ</dt>
              <dd>${escapeHtml(pres.troopLevelMetric)} · ${escapeHtml(pres.aidMetric)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="president-bio-box">
        <span class="president-sub-kicker">THÔNG TIN &amp; BỐI CẢNH ĐỐI VỚI VIỆT NAM</span>
        <p class="president-role-lead">${escapeHtml(pres.vietnamRole)}</p>
        <p class="president-bio-detail">${escapeHtml(pres.bioInfo)}</p>
      </div>

      <div class="president-policies-box">
        <span class="president-sub-kicker">CHÍNH SÁCH &amp; CHIẾN LƯỢC ÁP DỤNG TẠI VIỆT NAM</span>
        <ol class="president-policy-list">
          ${policiesHtml}
        </ol>
      </div>

      <footer class="president-card-foot">
        <div class="president-turning-point">
          <span class="president-sub-kicker">BƯỚC NGOẶT LỊCH SỬ GIAI ĐOẠN</span>
          <p>${escapeHtml(pres.turningPoint)}</p>
        </div>
        <div class="president-chapters-row">
          <span class="president-chapters-label">Đọc sâu theo chương:</span>
          <div class="president-chapter-chips">
            ${chapterLinksHtml}
          </div>
        </div>
      </footer>
    </article>
  `;
}

function renderPresidentsSummary() {
  if (!presidentsSection || !usPresidentsSummary.length) return;

  const isSingle = activePresidentFilter !== 'all';
  const visibleItems = isSingle
    ? usPresidentsSummary.filter((item) => item.id === activePresidentFilter)
    : usPresidentsSummary;
  const activeIdx = isSingle
    ? usPresidentsSummary.findIndex((item) => item.id === activePresidentFilter)
    : -1;

  const summaryKpis = [
    { value: '6 đời Tổng thống', label: 'Truman → Eisenhower → Kennedy → Johnson → Nixon → Ford (1945–1975)' },
    { value: '3 Dân chủ · 3 Cộng hòa', label: 'Tính liên tục trong chính sách can thiệp của Nhà Trắng suốt 30 năm' },
    { value: 'Đỉnh ~543.000 quân', label: 'Lực lượng viễn chinh Mỹ trực tiếp tham chiến năm 1968 trước khi phải xuống thang' },
    { value: '27/1/1973 → 30/4/1975', label: 'Từ Hiệp định Pa-ri rút quân Mỹ tới hoàn toàn chấm dứt can thiệp mùa Xuân 1975' },
  ];

  const kpisHtml = summaryKpis
    .map(
      (kpi) => `
      <div class="presidents-kpi">
        <strong>${escapeHtml(kpi.value)}</strong>
        <span>${escapeHtml(kpi.label)}</span>
      </div>
    `,
    )
    .join('');

  const arcColumnsHtml = usPresidentsSummary
    .map((p, i) => {
      const arc = ARC_SCALES[p.id] || { pct: 30, shortTerm: p.term, badge: p.strategyName };
      const isSelected = activePresidentFilter === p.id;
      return `
        <button type="button" class="presidents-arc-col${isSelected ? ' is-active' : ''}" data-select-president="${escapeHtml(p.id)}" aria-pressed="${isSelected ? 'true' : 'false'}" title="Xem tóm tắt ${escapeHtml(p.name)}">
          <span class="arc-order">#${escapeHtml(p.orderNumber)}</span>
          <div class="arc-bar-track" aria-hidden="true">
            <span class="arc-bar-fill is-${escapeHtml(p.partyCode)}" style="--arc-pct:${arc.pct}%"></span>
          </div>
          <strong class="arc-name">${escapeHtml(p.name.split(' ').slice(-1)[0])}</strong>
          <small class="arc-term">${escapeHtml(arc.shortTerm)}</small>
          <span class="arc-strategy">${escapeHtml(arc.badge)}</span>
        </button>
      `;
    })
    .join('');

  const filterButtonsHtml = `
    <button type="button" class="presidents-filter-btn${!isSingle ? ' is-active' : ''}" data-filter-president="all" aria-pressed="${!isSingle ? 'true' : 'false'}">
      <span>00 · Tất cả</span>
      <strong>6 đời Tổng thống (1945–1975)</strong>
    </button>
    ${usPresidentsSummary
      .map((p) => {
        const active = activePresidentFilter === p.id;
        return `
          <button type="button" class="presidents-filter-btn${active ? ' is-active' : ''}" data-filter-president="${escapeHtml(p.id)}" aria-pressed="${active ? 'true' : 'false'}">
            <span>#${escapeHtml(p.orderNumber)} · ${escapeHtml(p.party)}</span>
            <strong>${escapeHtml(p.name)}</strong>
          </button>
        `;
      })
      .join('')}
  `;

  const singleNavHtml =
    isSingle && activeIdx >= 0
      ? `
      <div class="presidents-single-nav">
        <button type="button" class="presidents-step-btn" data-filter-president="all">☰ Xem đủ 6 đời Tổng thống</button>
        <div class="presidents-step-pair">
          <button type="button" class="presidents-step-btn" ${activeIdx === 0 ? 'disabled' : ''} data-filter-president="${activeIdx > 0 ? escapeHtml(usPresidentsSummary[activeIdx - 1].id) : ''}">
            ‹ Đời trước${activeIdx > 0 ? `: ${escapeHtml(usPresidentsSummary[activeIdx - 1].name)}` : ''}
          </button>
          <button type="button" class="presidents-step-btn" ${activeIdx === usPresidentsSummary.length - 1 ? 'disabled' : ''} data-filter-president="${activeIdx < usPresidentsSummary.length - 1 ? escapeHtml(usPresidentsSummary[activeIdx + 1].id) : ''}">
            ${activeIdx < usPresidentsSummary.length - 1 ? `Đời tiếp: ${escapeHtml(usPresidentsSummary[activeIdx + 1].name)}` : 'Hết giai đoạn'} ›
          </button>
        </div>
      </div>
    `
      : '';

  const cardsHtml = visibleItems
    .map((p) => renderPresidentCard(p, usPresidentsSummary.findIndex((item) => item.id === p.id)))
    .join('');

  presidentsSection.innerHTML = `
    <header class="presidents-summary-head">
      <p class="intro-eyebrow">TÓM TẮT CUỘC CHIẾN XUYÊN SUỐT 1945–1975 · GÓC NHÌN ĐỐI CHIẾU</p>
      <h2 id="presidents-summary-title">6 đời Tổng thống Mỹ &amp; các chiến lược áp dụng ở Việt Nam</h2>
      <p class="presidents-summary-lead">Theo dõi sáu nhiệm kỳ Nhà Trắng kế tiếp nhau từ năm 1945 đến 1975 là cách nhìn trực diện quá trình can thiệp, leo thang rồi thất bại hoàn toàn của Hoa Kỳ tại Việt Nam — từ viện trợ thực dân Pháp, chiến tranh đơn phương, “Chiến tranh đặc biệt”, “Chiến tranh cục bộ”, “Việt Nam hóa” đến rút lui toàn diện mùa Xuân 1975.</p>
      <div class="presidents-kpi-grid">${kpisHtml}</div>
    </header>

    <div class="presidents-arc-panel" aria-label="Biểu đồ mức độ can thiệp quân sự Mỹ qua 6 đời Tổng thống">
      <div class="presidents-arc-head">
        <span>MỨC ĐỘ CAN THIỆP &amp; CHUYỂN HƯỚNG CHIẾN LƯỢC (1945–1975)</span>
        <small>Bấm từng cột để lọc hoặc đối chiếu nhanh từng đời Tổng thống</small>
      </div>
      <div class="presidents-arc-grid">${arcColumnsHtml}</div>
    </div>

    <div class="presidents-filter-bar" role="group" aria-label="Lọc xem từng Tổng thống Mỹ">
      ${filterButtonsHtml}
    </div>

    ${singleNavHtml}

    <div class="presidents-grid${isSingle ? ' is-single' : ''}">
      ${cardsHtml}
    </div>

    <aside class="presidents-synthesis-box">
      <strong>TỔNG KẾT XUYÊN SUỐT BA THẬP KỶ</strong>
      <p>Qua cả 6 đời Tổng thống thuộc cả hai đảng Dân chủ và Cộng hòa, Hoa Kỳ đã thử mọi nấc thang chiến lược — từ chi trả tới 80% chiến phí cho Pháp, dựng chính quyền Sài Gòn, tung hơn nửa triệu quân viễn chinh với Sấm Rền và B-52 Linebacker II đến rút quân qua “Việt Nam hóa” — nhưng đều lần lượt thất bại trước đường lối kháng chiến chính nghĩa và sức mạnh đại đoàn kết của dân tộc Việt Nam.</p>
    </aside>
  `;
}

if (presidentsSection) {
  renderPresidentsSummary();

  presidentsSection.addEventListener('click', (event) => {
    const zoomBtn = event.target.closest('[data-zoom-president]');
    if (zoomBtn) {
      openPresidentZoom(zoomBtn.dataset.zoomPresident, zoomBtn);
      return;
    }

    const filterBtn = event.target.closest('[data-filter-president]');
    if (filterBtn && !filterBtn.disabled) {
      const nextId = filterBtn.dataset.filterPresident || 'all';
      activePresidentFilter = nextId;
      renderPresidentsSummary();
      return;
    }

    const arcBtn = event.target.closest('[data-select-president]');
    if (arcBtn) {
      const targetId = arcBtn.dataset.selectPresident;
      activePresidentFilter = activePresidentFilter === targetId ? 'all' : targetId;
      renderPresidentsSummary();
    }
  });
}
