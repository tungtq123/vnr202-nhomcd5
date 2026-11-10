import { introChapters, sources } from './data.mjs';
import {
  UPRISING_ARCHIPELAGOS,
  UPRISING_CITIES,
  UPRISING_MAP_NOTE,
  UPRISING_MAP_VIEWBOX,
  UPRISING_PROVINCES,
  UPRISING_REGION_MAP,
} from './uprising-map-data.mjs';
import { $, escapeHtml, initMobileNav, sourceLink } from './utils.mjs';

const TINY_DOT_HIT_IDS = new Set([
  'phuc-yen',
  'son-tay',
  'kien-an',
  'cho-lon',
  'go-cong',
  'sa-dec',
  'my-tho',
  'tan-an',
  'ha-tien',
]);

initMobileNav();

try {
  sessionStorage.setItem('dau-an-hoa-binh-intro', '1');
} catch {
  /* Storage can be unavailable in private browsing. */
}

const main = $('#noi-dung');
const params = new URLSearchParams(window.location.search);
const chapterNum = Number(params.get('c') || 1);
const currentIndex = introChapters.findIndex((item) => item.sceneNumber === chapterNum);
const chapter = currentIndex >= 0 ? introChapters[currentIndex] : null;

function renderDiagramSvg(diagram) {
  if (!diagram) return '';
  if (diagram.type === 'opportunity-matrix') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 226" role="img" aria-label="Sơ đồ hai nhóm điều kiện tạo thời cơ chín muồi tháng 8/1945">
        <rect x="8" y="10" width="252" height="98" rx="4" fill="#252c24" stroke="#475145" stroke-width="1.2"/>
        <text x="20" y="30" fill="#d2b49d" font-size="10" font-weight="600" letter-spacing="1">01 · THẾ GIỚI (15/8/1945)</text>
        <text x="20" y="52" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">Nhật đầu hàng Đồng minh</text>
        <text x="20" y="74" fill="#c7c8ba" font-size="11">• Thế chiến II đi đến hồi kết</text>
        <text x="20" y="92" fill="#c7c8ba" font-size="11">• Đầu hàng vô điều kiện (15/8)</text>

        <rect x="280" y="10" width="252" height="98" rx="4" fill="#252c24" stroke="#475145" stroke-width="1.2"/>
        <text x="292" y="30" fill="#d2b49d" font-size="10" font-weight="600" letter-spacing="1">02 · TRONG NƯỚC (ĐÔNG DƯƠNG)</text>
        <text x="292" y="52" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">4 điều kiện chín muồi</text>
        <text x="292" y="74" fill="#c7c8ba" font-size="11">• Nhật rệu rã · Nạn đói (&gt; 2 triệu)</text>
        <text x="292" y="92" fill="#c7c8ba" font-size="11">• Đảng, dân sẵn sàng · Trung gian theo</text>

        <path d="M134 108 L134 130 L260 130 L260 146" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <path d="M406 108 L406 130 L280 130 L280 146" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,154 262,142 278,142" fill="#c94b38"/>

        <rect x="30" y="156" width="480" height="58" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.5"/>
        <text x="270" y="179" text-anchor="middle" fill="#f4f1e9" font-size="14" font-family="Playfair Display, Georgia, serif" font-weight="600">THỜI CƠ CÁCH MẠNG CHÍN MUỒI</text>
        <text x="270" y="199" text-anchor="middle" fill="#e6d6c8" font-size="11">Đảng lãnh đạo toàn dân nổi dậy Tổng khởi nghĩa giành chính quyền</text>
      </svg>
    `;
  }
  if (diagram.type === 'interactive-uprising-map') {
    const provincesHtml = UPRISING_PROVINCES.map((p) => {
      const hitCircle =
        p.dot && TINY_DOT_HIT_IDS.has(p.id)
          ? `<circle class="map-hit-helper" cx="${p.dot[0]}" cy="${p.dot[1]}" r="4.2"/>`
          : p.id === 'con-dao'
            ? `<circle class="map-hit-helper" cx="${p.cx}" cy="${p.cy}" r="7.5"/>`
            : '';
      const dotCircle = p.dot
        ? `<circle class="map-region-dot" cx="${p.dot[0]}" cy="${p.dot[1]}" r="2.7"/>`
        : '';
      return `
        <g class="map-region is-status-${escapeHtml(p.status)}" data-region-id="${escapeHtml(p.id)}" tabindex="0" role="button" aria-label="${escapeHtml(`${p.name} — ${p.dayLabel}`)}">
          <path class="map-region-shape" d="${p.path}"/>
          ${hitCircle}
          ${dotCircle}
        </g>
      `;
    }).join('');

    const citiesHtml = UPRISING_CITIES.map((c) => `
      <g class="map-region is-city-hub is-status-${escapeHtml(c.status)}" data-region-id="${escapeHtml(c.id)}" tabindex="0" role="button" aria-label="${escapeHtml(`${c.name} — ${c.dayLabel}`)}">
        <circle class="map-hit-helper" cx="${c.cx}" cy="${c.cy}" r="5.8"/>
        <circle class="map-city-ring" cx="${c.cx}" cy="${c.cy}" r="${c.r}"/>
        <circle class="map-region-dot is-city-core" cx="${c.cx}" cy="${c.cy}" r="2.1"/>
      </g>
    `).join('');

    const archipelagosHtml = UPRISING_ARCHIPELAGOS.map((a) => `
      <g class="map-region is-archipelago is-status-${escapeHtml(a.status)}" data-region-id="${escapeHtml(a.id)}" tabindex="0" role="button" aria-label="${escapeHtml(a.name)}">
        <rect class="map-island-hitbox" x="${a.hitBox.x}" y="${a.hitBox.y}" width="${a.hitBox.width}" height="${a.hitBox.height}" rx="4"/>
        <g class="map-island-dots">${a.islets.map(([ix, iy, ir]) => `<circle cx="${ix}" cy="${iy}" r="${ir}"/>`).join('')}</g>
        <text class="map-island-label" x="${a.labelX}" y="${a.labelY}" text-anchor="middle">${escapeHtml(a.labelText)}</text>
      </g>
    `).join('');

    return `
      <div class="uprising-map-viewport">
        <svg class="uprising-interactive-map" id="uprising-interactive-map" viewBox="${UPRISING_MAP_VIEWBOX}" role="group" aria-label="Bản đồ tương tác Tổng khởi nghĩa tháng Tám năm 1945 (72 tỉnh trước CMT8)">
          <g class="map-provinces-layer">${provincesHtml}</g>
          <path id="uprising-active-overlay" class="map-active-overlay"/>
          <g class="map-cities-layer">${citiesHtml}</g>
          <circle id="uprising-active-dot" class="map-active-dot" r="0"/>
          <text class="map-sea-label" x="822" y="318" text-anchor="middle" aria-hidden="true">BIỂN ĐÔNG</text>
          <g class="map-islands-layer">${archipelagosHtml}</g>
        </svg>
      </div>
    `;
  }
  if (diagram.type === 'era-shift') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 500 202" role="img" aria-label="Sơ đồ bước ngoặt lịch sử trước và sau Cách mạng tháng Tám 1945">
        <rect x="8" y="12" width="214" height="178" rx="4" fill="#4e160f" stroke="#a25a4c" stroke-width="1.2"/>
        <text x="20" y="34" fill="#f0c9ad" font-size="10" font-weight="600" letter-spacing="1">TRƯỚC THÁNG 8/1945</text>
        <text x="20" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Ba tầng xiềng xích</text>
        <text x="20" y="84" fill="#ead9ca" font-size="11">• Thực dân Pháp (&gt; 80 năm)</text>
        <text x="20" y="104" fill="#ead9ca" font-size="11">• Quân phiệt Nhật (~ 5 năm)</text>
        <text x="20" y="124" fill="#ead9ca" font-size="11">• Quân chủ (&gt; 1.000 năm)</text>
        <text x="20" y="152" fill="#e3c39b" font-size="11">→ Đảng hoạt động bí mật</text>
        <text x="20" y="170" fill="#e3c39b" font-size="11">→ Nhân dân thân phận nô lệ</text>

        <path d="M228 101 L266 101" stroke="#f6e7d4" stroke-width="2.2"/>
        <polygon points="272,101 261,94 261,108" fill="#f6e7d4"/>
        <text x="250" y="86" text-anchor="middle" fill="#f6e7d4" font-size="10" font-weight="700">8/1945</text>

        <rect x="278" y="12" width="214" height="178" rx="4" fill="#82291c" stroke="#f3d5b5" stroke-width="1.4"/>
        <text x="290" y="34" fill="#ffe7c7" font-size="10" font-weight="600" letter-spacing="1">SAU NGÀY 02/9/1945</text>
        <text x="290" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Kỷ nguyên Độc lập</text>
        <text x="290" y="84" fill="#fff7ee" font-size="11">• Nước VN Dân chủ Cộng hòa</text>
        <text x="290" y="104" fill="#fff7ee" font-size="11">• Độc lập, tự do gắn với</text>
        <text x="298" y="120" fill="#fff7ee" font-size="11">giải phóng xã hội</text>
        <text x="290" y="152" fill="#ffe7c7" font-size="11">→ Đảng trở thành đảng cầm quyền</text>
        <text x="290" y="170" fill="#ffe7c7" font-size="11">→ Nhân dân làm chủ đất nước</text>
      </svg>
    `;
  }
  if (diagram.type === 'resistance-context-matrix') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 236" role="img" aria-label="Sơ đồ hai mặt bối cảnh lịch sử 1945–1946 dẫn tới cuộc kháng chiến toàn quốc">
        <rect x="8" y="10" width="252" height="106" rx="4" fill="#252c24" stroke="#5f7a65" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="10" font-weight="600" letter-spacing="1">01 · THUẬN LỢI CƠ BẢN</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">Thế đứng mới của dân tộc</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="11">• Hệ thống XHCN &amp; phong trào GPDT lên cao</text>
        <text x="20" y="90" fill="#c7c8ba" font-size="11">• Nhân dân làm chủ nước VNDCCH</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="11">• Đảng và Chủ tịch Hồ Chí Minh lãnh đạo</text>

        <rect x="280" y="10" width="252" height="106" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="10" font-weight="600" letter-spacing="1">02 · “NGÀN CÂN TREO SỢI TÓC”</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13.5" font-family="Playfair Display, Georgia, serif">Ba thứ giặc &amp; Nội phản</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="11">• &gt; 20 vạn quân Tưởng, Anh, Pháp, Nhật</text>
        <text x="292" y="90" fill="#e5cbc2" font-size="11">• Giặc đói, &gt; 90% mù chữ, ngân khố cạn</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="11">• Chính quyền non trẻ, chưa được công nhận</text>

        <path d="M134 116 L134 138 L260 138 L260 154" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <path d="M406 116 L406 138 L280 138 L280 154" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,162 262,150 278,150" fill="#c94b38"/>

        <rect x="24" y="164" width="492" height="62" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.5"/>
        <text x="270" y="187" text-anchor="middle" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif" font-weight="600">HÒA ĐỂ TIẾN → TOÀN QUỐC KHÁNG CHIẾN (19/12/1946)</text>
        <text x="270" y="207" text-anchor="middle" fill="#e6d6c8" font-size="11">Đường lối: Toàn dân · Toàn diện · Trường kỳ · Tự lực cánh sinh</text>
      </svg>
    `;
  }
  if (diagram.type === 'dienbien-fortress') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 228" role="img" aria-label="Sơ đồ 3 phân khu Điện Biên Phủ và bước ngoặt chuyển phương châm 26/1/1954">
        <rect x="8" y="10" width="252" height="122" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="20" y="30" fill="#f0beaa" font-size="10" font-weight="700" letter-spacing="1">PHÁP – MỸ · TẬP ĐOÀN CỨ ĐIỂM</text>
        <text x="20" y="51" fill="#ffd9c7" font-size="13.5" font-family="Playfair Display, Georgia, serif">3 Phân khu · 49 Cứ điểm</text>
        <text x="20" y="72" fill="#e5cbc2" font-size="11">• Bắc: Him Lam, Độc Lập, Bản Kéo</text>
        <text x="20" y="90" fill="#e5cbc2" font-size="11">• Trung tâm: Mường Thanh, Đồi Đông</text>
        <text x="20" y="108" fill="#e5cbc2" font-size="11">• Nam: Hồng Cúm &amp; sân bay dự bị</text>
        <text x="20" y="124" fill="#f0beaa" font-size="10.2" font-weight="600">→ Phụ thuộc 100% cầu hàng không</text>

        <rect x="280" y="10" width="252" height="122" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="292" y="30" fill="#b7d3be" font-size="10" font-weight="700" letter-spacing="1">QUÂN TA · SƯỜN NÚI VÂY LÒNG CHẢO</text>
        <text x="292" y="51" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">Thế trận 26/1/1954</text>
        <text x="292" y="72" fill="#c7c8ba" font-size="11">• Kéo pháo ra khỏi công sự tạm</text>
        <text x="292" y="90" fill="#c7c8ba" font-size="11">• Đắp hầm pháo kiên cố trên cao</text>
        <text x="292" y="108" fill="#c7c8ba" font-size="11">• Đào &gt;400 km chiến hào siết dần</text>
        <text x="292" y="124" fill="#b7d3be" font-size="10.2" font-weight="600">→ “Vây, lấn, tấn, phá, triệt, diệt”</text>

        <path d="M134 132 L134 148 L260 148 L260 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <path d="M406 132 L406 148 L280 148 L280 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <polygon points="270,166 262,155 278,155" fill="#e6d6c8"/>

        <rect x="18" y="166" width="504" height="52" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="187" text-anchor="middle" fill="#f4f1e9" font-size="13" font-family="Playfair Display, Georgia, serif" font-weight="600">CHUYỂN TỪ “ĐÁNH NHANH, THẮNG NHANH” → “ĐÁNH CHẮC, TIẾN CHẮC”</text>
        <text x="270" y="206" text-anchor="middle" fill="#e6d6c8" font-size="10.8">Khẩu hiệu hành động: “Tất cả cho tiền tuyến, tất cả để chiến thắng”</text>
      </svg>
    `;
  }
  if (diagram.type === 'dienbien-impact') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 500 206" role="img" aria-label="Sơ đồ tác động chiến lược của Chiến thắng Điện Biên Phủ 1954">
        <rect x="10" y="12" width="144" height="182" rx="4" fill="#44130d" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="22" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">07/5/1954</text>
        <text x="22" y="56" fill="#ffffff" font-size="14" font-family="Playfair Display, Georgia, serif">Điện Biên Phủ</text>
        <text x="22" y="84" fill="#f2e5d9" font-size="10.8">• Hạ 49 cứ điểm,</text>
        <text x="28" y="100" fill="#f2e5d9" font-size="10.8">loại ~16.200 địch</text>
        <text x="22" y="126" fill="#f2e5d9" font-size="10.8">• Bắt sống tướng</text>
        <text x="28" y="142" fill="#f2e5d9" font-size="10.8">Đờ Ca-xtơ-ri</text>
        <text x="22" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Phá sản Na-va</text>

        <path d="M158 103 L178 103" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="184,103 175,97 175,109" fill="#f0c9ad"/>

        <rect x="186" y="12" width="146" height="182" rx="4" fill="#5e1b12" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="198" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">08/5 – 21/7/1954</text>
        <text x="198" y="56" fill="#ffffff" font-size="14" font-family="Playfair Display, Georgia, serif">Hội nghị Giơ-ne-vơ</text>
        <text x="198" y="84" fill="#f2e5d9" font-size="10.8">• Đàm phán thế</text>
        <text x="204" y="100" fill="#f2e5d9" font-size="10.8">người chiến thắng</text>
        <text x="198" y="126" fill="#f2e5d9" font-size="10.8">• Pháp công nhận</text>
        <text x="204" y="142" fill="#f2e5d9" font-size="10.8">độc lập Đông Dương</text>
        <text x="198" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Miền Bắc giải phóng</text>

        <path d="M336 103 L356 103" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="362,103 353,97 353,109" fill="#f0c9ad"/>

        <rect x="364" y="12" width="126" height="182" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="376" y="34" fill="#ffe7c7" font-size="9.5" font-weight="700" letter-spacing="1">TẦM VÓC THẾ KỶ XX</text>
        <text x="376" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Chấn động địa cầu</text>
        <text x="376" y="84" fill="#fff7ee" font-size="10.6">• Thuộc địa thắng</text>
        <text x="382" y="100" fill="#fff7ee" font-size="10.6">cường quốc thực dân</text>
        <text x="376" y="126" fill="#fff7ee" font-size="10.6">• Cổ vũ Á – Phi –</text>
        <text x="382" y="142" fill="#fff7ee" font-size="10.6">Mỹ Latinh đứng lên</text>
        <text x="376" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Sụp đổ thực dân cũ</text>
      </svg>
    `;
  }
  if (diagram.type === 'geneva-context-matrix') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 230" role="img" aria-label="Sơ đồ hai nhóm nhân tố trong nước và quốc tế dẫn tới Hội nghị Giơ-ne-vơ năm 1954">
        <rect x="8" y="10" width="252" height="106" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="10" font-weight="700" letter-spacing="1">01 · CHIẾN TRƯỜNG (7/5/1954)</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">Thắng lợi Điện Biên Phủ</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="11">• Phá sản hoàn toàn Kế hoạch Na-va</text>
        <text x="20" y="90" fill="#c7c8ba" font-size="11">• Loại ~16.200 địch ở 49 cứ điểm</text>
        <text x="20" y="106" fill="#b7d3be" font-size="10.5" font-weight="600">→ Pháp bế tắc, buộc phải đàm phán</text>

        <rect x="280" y="10" width="252" height="106" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="10" font-weight="700" letter-spacing="1">02 · QUỐC TẾ (2–5/1954)</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13.5" font-family="Playfair Display, Georgia, serif">Bàn cờ 5 cường quốc</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="11">• Hội nghị Béc-lin triệu tập Giơ-ne-vơ</text>
        <text x="292" y="90" fill="#e5cbc2" font-size="11">• Lợi ích Liên Xô, TQ, Anh, Pháp đan xen</text>
        <text x="292" y="106" fill="#f0beaa" font-size="10.5" font-weight="600">→ Mỹ phản đối, ráo riết tìm thế chân Pháp</text>

        <path d="M134 116 L134 136 L260 136 L260 152" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 116 L406 136 L280 136 L280 152" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,160 262,149 278,149" fill="#e6d6c8"/>

        <rect x="20" y="160" width="500" height="58" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="183" text-anchor="middle" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif" font-weight="600">KHAI MẠC HỘI NGHỊ GIƠ-NE-VƠ VỀ ĐÔNG DƯƠNG (8/5/1954)</text>
        <text x="270" y="203" text-anchor="middle" fill="#e6d6c8" font-size="10.8">9 đoàn tham dự · VNDCCH giữ thế thắng nhưng đấu trí gay go tới 21/7/1954</text>
      </svg>
    `;
  }
  if (diagram.type === 'dongkhoi-context-crisis') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 232" role="img" aria-label="Sơ đồ từ nỗi khổ hậu chiến và ách khủng bố Mỹ – Diệm đến Nghị quyết Trung ương 15">
        <rect x="8" y="10" width="252" height="108" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="10" font-weight="700" letter-spacing="1">01 · HẬU CHIẾN (1954–1959)</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.5" font-family="Playfair Display, Georgia, serif">Nỗi khổ chồng chất</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="11">• Kinh tế kiệt quệ, mất ruộng cày</text>
        <text x="20" y="90" fill="#c7c8ba" font-size="11">• Gia đình ly tán qua Vĩ tuyến 17</text>
        <text x="20" y="108" fill="#b7d3be" font-size="10.5" font-weight="600">→ Hòa bình mong manh bị dập tắt</text>

        <rect x="280" y="10" width="252" height="108" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="10" font-weight="700" letter-spacing="1">02 · MỸ – DIỆM KHỦNG BỐ</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13.5" font-family="Playfair Display, Georgia, serif">“Tố cộng” &amp; Luật 10/59</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="11">• Phá Tổng tuyển cử, dựng VNCH</text>
        <text x="292" y="90" fill="#e5cbc2" font-size="11">• Máy chém 10/59, thảm sát Phú Lợi</text>
        <text x="292" y="108" fill="#f0beaa" font-size="10.5" font-weight="600">→ Đẩy dân vào bước đường cùng</text>

        <path d="M134 118 L134 138 L260 138 L260 154" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 118 L406 138 L280 138 L280 154" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,162 262,151 278,151" fill="#e6d6c8"/>

        <rect x="16" y="162" width="508" height="60" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="185" text-anchor="middle" fill="#f4f1e9" font-size="12.6" font-family="Playfair Display, Georgia, serif" font-weight="600">NGHỊ QUYẾT TRUNG ƯƠNG 15 (1/1959) &amp; PHẢN ỨNG CỨU NƯỚC</text>
        <text x="270" y="206" text-anchor="middle" fill="#e6d6c8" font-size="10.6">Chính trị là chủ yếu kết hợp vũ trang · Mở Đường Trường Sơn → Vùng lên Đồng khởi</text>
      </svg>
    `;
  }
  if (diagram.type === 'dongkhoi-meaning-shift') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 206" role="img" aria-label="Sơ đồ bước ngoặt chuyển từ thế giữ gìn lực lượng sang thế tiến công chiến lược">
        <rect x="8" y="12" width="156" height="182" rx="4" fill="#44130d" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">1954 – 1958</text>
        <text x="20" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Giữ gìn lực lượng</text>
        <text x="20" y="84" fill="#f2e5d9" font-size="10.8">• Đấu tranh chính trị</text>
        <text x="26" y="100" fill="#f2e5d9" font-size="10.8">đòi thi hành Giơ-ne-vơ</text>
        <text x="20" y="126" fill="#f2e5d9" font-size="10.8">• Chịu tổn thất nặng</text>
        <text x="26" y="142" fill="#f2e5d9" font-size="10.8">trước Luật 10/59</text>
        <text x="20" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Tích tụ mầm nổi dậy</text>

        <path d="M168 103 L184 103" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="190,103 181,97 181,109" fill="#f0c9ad"/>

        <rect x="192" y="12" width="156" height="182" rx="4" fill="#5e1b12" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="204" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">1959 – 1960</text>
        <text x="204" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Cao trào Đồng khởi</text>
        <text x="204" y="84" fill="#f2e5d9" font-size="10.8">• NQ 15 + Bến Tre</text>
        <text x="210" y="100" fill="#f2e5d9" font-size="10.8">bùng nổ khắp Nam Bộ</text>
        <text x="204" y="126" fill="#f2e5d9" font-size="10.8">• “Hai chân, ba mũi”</text>
        <text x="210" y="142" fill="#f2e5d9" font-size="10.8">và Đội quân tóc dài</text>
        <text x="204" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Tan rã tề ngụy</text>

        <path d="M352 103 L368 103" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="374,103 365,97 365,109" fill="#f0c9ad"/>

        <rect x="376" y="12" width="156" height="182" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9.5" font-weight="700" letter-spacing="1">TỪ 20/12/1960</text>
        <text x="388" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Thế tiến công mới</text>
        <text x="388" y="84" fill="#fff7ee" font-size="10.8">• 1.383/2.627 xã</text>
        <text x="394" y="100" fill="#fff7ee" font-size="10.8">Nam Bộ làm chủ</text>
        <text x="388" y="126" fill="#fff7ee" font-size="10.8">• Mặt trận Dân tộc</text>
        <text x="394" y="142" fill="#fff7ee" font-size="10.8">Giải phóng ra đời</text>
        <text x="388" y="168" fill="#ffe7c7" font-size="10.5" font-weight="600">→ Mỹ đổi chiến lược</text>
      </svg>
    `;
  }
  if (diagram.type === 'specialwar-context-regime') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ cơ chế Chiến tranh đặc biệt của Mỹ và khủng hoảng chính quyền VNCH 1961–1965">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.6" font-weight="700" letter-spacing=".8">01 · TRỤ CỘT “CHIẾN TRANH ĐẶC BIỆT”</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Cố vấn Mỹ + Quân Sài Gòn</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.8">• Bộ chỉ huy MACV, &gt;16.000–23.300 cố vấn</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.8">• Tăng quân đội SG 17 → 56 vạn, trực thăng</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.8">• Thiết giáp M113 &amp; 16.000 “Ấp chiến lược”</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Staley–Taylor &amp; Johnson–McNamara</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.6" font-weight="700" letter-spacing=".8">02 · BIẾN ĐỘNG THƯỢNG TẦNG SÀI GÒN</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13.2" font-family="Playfair Display, Georgia, serif">Đảo chính Diệm → Cửa xoay</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.8">• 1–2/11/1963: Lật đổ, sát hại Diệm – Nhu</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.8">• Dương Văn Minh (11/1963) → N. Khánh (1/1964)</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.8">• Sửu – Hương – Quát → Thiệu – Kỳ (6/1965)</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Hơn 10 cuộc đảo chính, chỉnh lý</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.5" font-family="Playfair Display, Georgia, serif" font-weight="600">PHÁ SẢN TỪ ẤP CHIẾN LƯỢC ĐẾN THƯỢNG TẦNG VNCH (1961–1965)</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.5">Thất bại quân sự ở Ấp Bắc &amp; phong trào đô thị làm sụp đổ chỗ dựa chính trị của Mỹ</text>
      </svg>
    `;
  }
  if (diagram.type === 'specialwar-meaning-shift') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 212" role="img" aria-label="Sơ đồ bước ngoặt đánh bại Chiến tranh đặc biệt từ Ấp Bắc 1963 đến Đồng Xoài 1965">
        <rect x="8" y="12" width="156" height="188" rx="4" fill="#44130d" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">1961 – 01/1963</text>
        <text x="20" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Phá ấp &amp; Ấp Bắc</text>
        <text x="20" y="84" fill="#f2e5d9" font-size="10.6">• 3 vùng, 3 mũi giáp công</text>
        <text x="26" y="100" fill="#f2e5d9" font-size="10.6">bám đất giữ làng</text>
        <text x="20" y="126" fill="#f2e5d9" font-size="10.6">• Đánh bại “trực thăng</text>
        <text x="26" y="142" fill="#f2e5d9" font-size="10.6">vận”, “thiết xa vận”</text>
        <text x="20" y="172" fill="#ffe7c7" font-size="10.4" font-weight="600">→ Khẳng định khả năng thắng</text>

        <path d="M168 106 L184 106" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="190,106 181,100 181,112" fill="#f0c9ad"/>

        <rect x="192" y="12" width="156" height="188" rx="4" fill="#5e1b12" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="204" y="34" fill="#f0c9ad" font-size="9.5" font-weight="700" letter-spacing="1">1964 – HÈ 1965</text>
        <text x="204" y="56" fill="#ffffff" font-size="13.5" font-family="Playfair Display, Georgia, serif">Bình Giã – Đồng Xoài</text>
        <text x="204" y="84" fill="#f2e5d9" font-size="10.6">• An Lão, Bình Giã mở</text>
        <text x="210" y="100" fill="#f2e5d9" font-size="10.6">màn đánh vận động lớn</text>
        <text x="204" y="126" fill="#f2e5d9" font-size="10.6">• Ba Gia, Đồng Xoài diệt</text>
        <text x="210" y="142" fill="#f2e5d9" font-size="10.6">chủ lực tổng dự bị SG</text>
        <text x="204" y="172" fill="#ffe7c7" font-size="10.4" font-weight="600">→ Sụp đổ hệ thống Ấp CL</text>

        <path d="M352 106 L368 106" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="374,106 365,100 365,112" fill="#f0c9ad"/>

        <rect x="376" y="12" width="156" height="188" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9.5" font-weight="700" letter-spacing="1">TỪ GIỮA 1965</text>
        <text x="388" y="56" fill="#ffffff" font-size="13.2" font-family="Playfair Display, Georgia, serif">Phá sản Chiến tranh ĐB</text>
        <text x="388" y="84" fill="#fff7ee" font-size="10.6">• Xương sống ngụy quân,</text>
        <text x="394" y="100" fill="#fff7ee" font-size="10.6">ngụy quyền lung lay gốc</text>
        <text x="388" y="126" fill="#fff7ee" font-size="10.6">• Buộc Mỹ bị động chuyển</text>
        <text x="394" y="142" fill="#fff7ee" font-size="10.6">sang “Chiến tranh cục bộ”</text>
        <text x="388" y="172" fill="#ffe7c7" font-size="10.4" font-weight="600">→ Thế tiến công vững chắc</text>
      </svg>
    `;
  }
  if (diagram.type === 'localwar-context-strategy') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ bối cảnh 1965 và hai gọng kìm Chiến tranh cục bộ của Mỹ">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.6" font-weight="700" letter-spacing=".8">01 · BỐI CẢNH ĐẦU NĂM 1965</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Phá sản “Chiến tranh đặc biệt”</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.8">• Bình Giã, Ba Gia, Đồng Xoài (Hè 1965)</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.8">• Khủng hoảng đảo chính nối tiếp ở Sài Gòn</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.8">• Tiền đề Vịnh Bắc Bộ (8/1964) leo thang Bắc</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Nguy cơ sụp đổ chế độ tay sai</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.6" font-weight="700" letter-spacing=".8">02 · TRỰC TIẾP MỸ HÓA CHIẾN TRANH</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13.2" font-family="Playfair Display, Georgia, serif">Mỹ + 5 Đồng minh + SG</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.8">• Quân Mỹ lên &gt;53 vạn + ~7 vạn đồng minh</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.8">• 2 gọng kìm “Tìm diệt” và “Bình định”</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.8">• 2 mùa khô (1965–1967) &amp; Sấm Rền miền Bắc</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Tổng lực &gt;1,2 triệu quân &amp; B-52</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.4" font-family="Playfair Display, Georgia, serif" font-weight="600">NGHỊ QUYẾT TW 11, 12 (1965): QUYẾT TÂM ĐÁNH THẮNG GIẶC MỸ</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.5">Kiên trì thế tiến công · “Tìm Mỹ mà đánh, lùng ngụy mà diệt” → Tiến tới Xuân 1968</text>
      </svg>
    `;
  }
  if (diagram.type === 'northern-airwar-defense') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 212" role="img" aria-label="Sơ đồ miền Bắc chống chiến tranh phá hoại lần thứ nhất và chi viện miền Nam 1964–1968">
        <rect x="8" y="12" width="156" height="188" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0beaa" font-size="9.5" font-weight="700" letter-spacing="1">8/1964 – 1968</text>
        <text x="20" y="56" fill="#ffd9c7" font-size="13.5" font-family="Playfair Display, Georgia, serif">Sấm Rền &amp; Phong tỏa</text>
        <text x="20" y="84" fill="#e5cbc2" font-size="10.6">• Vịnh Bắc Bộ 5/8/1964</text>
        <text x="26" y="100" fill="#e5cbc2" font-size="10.6">&amp; Sấm Rền từ 3/1965</text>
        <text x="20" y="126" fill="#e5cbc2" font-size="10.6">• ~643.000 tấn bom trút</text>
        <text x="26" y="142" fill="#e5cbc2" font-size="10.6">xuống 6 TP, đê, cầu</text>
        <text x="20" y="172" fill="#f0beaa" font-size="10.2" font-weight="600">→ Âm mưu chặt đứt hậu phương</text>

        <path d="M168 106 L184 106" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="190,106 181,100 181,112" fill="#d2b49d"/>

        <rect x="192" y="12" width="156" height="188" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.3"/>
        <text x="204" y="34" fill="#b7d3be" font-size="9.5" font-weight="700" letter-spacing="1">CHIẾN ĐẤU · SẢN XUẤT</text>
        <text x="204" y="56" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Thế trận nhiều tầng</text>
        <text x="204" y="84" fill="#c7c8ba" font-size="10.6">• Cao xạ, SAM-2, MiG &amp;</text>
        <text x="210" y="100" fill="#c7c8ba" font-size="10.6">dân quân “tay cày súng”</text>
        <text x="204" y="126" fill="#c7c8ba" font-size="10.6">• “Ba sẵn sàng”, “Ba đảm”</text>
        <text x="210" y="142" fill="#c7c8ba" font-size="10.6">giữ vững Đường Trường Sơn</text>
        <text x="204" y="172" fill="#b7d3be" font-size="10.2" font-weight="600">→ Giữ nhịp sản xuất &amp; chi viện</text>

        <path d="M352 106 L368 106" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="374,106 365,100 365,112" fill="#d2b49d"/>

        <rect x="376" y="12" width="156" height="188" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9.5" font-weight="700" letter-spacing="1">ĐẾN 01/11/1968</text>
        <text x="388" y="56" fill="#ffffff" font-size="13.2" font-family="Playfair Display, Georgia, serif">Buộc Mỹ ngừng ném</text>
        <text x="388" y="84" fill="#fff7ee" font-size="10.6">• Hạ 3.243 máy bay</text>
        <text x="394" y="100" fill="#fff7ee" font-size="10.6">(báo cáo Mỹ: ~922–938)</text>
        <text x="388" y="126" fill="#fff7ee" font-size="10.6">• Bắn chìm 143 tàu chiến,</text>
        <text x="394" y="142" fill="#fff7ee" font-size="10.6">tàu biệt kích trên biển</text>
        <text x="388" y="172" fill="#ffe7c7" font-size="10.2" font-weight="600">→ Phá sản mục tiêu Mỹ</text>
      </svg>
    `;
  }
  if (diagram.type === 'vietnamization-context-strategy') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ hoàn cảnh sau 1968 và chiến lược Việt Nam hóa – Đông Dương hóa chiến tranh 1969–1973">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.6" font-weight="700" letter-spacing=".8">01 · HOÀN CẢNH TỪ NĂM 1969</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Sau bước ngoặt Mậu Thân</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.8">• Mỹ buộc rút dần &gt;54 vạn quân bộ binh</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.8">• Ra đời CP CMLT CHMNVN (6/6/1969)</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.8">• Bác Hồ từ trần (2/9) · Giữ vững Di chúc</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Vượt tổn thất, giữ tuyến Trường Sơn</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.6" font-weight="700" letter-spacing=".8">02 · HỌC THUYẾT NIXON (1969–1973)</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13" font-family="Playfair Display, Georgia, serif">Việt Nam hóa &amp; Đông Dương hóa</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.8">• Quân Sài Gòn (&gt;1 triệu) + Hỏa lực Mỹ</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.8">• Bình định “Phượng Hoàng” ráo riết ở MN</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.8">• Mở rộng đánh Cam-pu-chia (70), Lào (71)</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Dùng Đông Dương đánh Đông Dương</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.4" font-family="Playfair Display, Georgia, serif" font-weight="600">LIÊN MINH 3 NƯỚC ĐÔNG DƯƠNG &amp; THẾ “VỪA ĐÁNH, VỪA ĐÀM”</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.5">Đánh bại Lào – Cam-pu-chia → Bùng nổ Tiến công chiến lược 1972 → Tới Hiệp định Pa-ri</text>
      </svg>
    `;
  }
  if (diagram.type === 'linebacker2-air-defense') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 218" role="img" aria-label="Sơ đồ miền Bắc chống chiến tranh phá hoại lần thứ hai và 12 ngày đêm Điện Biên Phủ trên không 1972">
        <rect x="8" y="12" width="156" height="194" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0beaa" font-size="9.2" font-weight="700" letter-spacing=".8">4/1972 – 12/1972</text>
        <text x="20" y="55" fill="#ffd9c7" font-size="13" font-family="Playfair Display, Georgia, serif">Hủy diệt bằng B-52</text>
        <text x="20" y="82" fill="#e5cbc2" font-size="10.4">• Thả thủy lôi phong tỏa</text>
        <text x="26" y="97" fill="#e5cbc2" font-size="10.4">cảng Hải Phòng (5/1972)</text>
        <text x="20" y="120" fill="#e5cbc2" font-size="10.4">• Linebacker II (18–29/12):</text>
        <text x="26" y="135" fill="#e5cbc2" font-size="10.4">~193–207 B-52, &gt;2 vạn tấn</text>
        <text x="26" y="150" fill="#e5cbc2" font-size="10.4">bom vào HN – Hải Phòng</text>
        <text x="20" y="178" fill="#f0beaa" font-size="10" font-weight="600">→ ~1.624–2.368 dân thiệt mạng</text>

        <path d="M168 109 L184 109" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="190,109 181,103 181,115" fill="#d2b49d"/>

        <rect x="192" y="12" width="156" height="194" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.3"/>
        <text x="204" y="34" fill="#b7d3be" font-size="9.2" font-weight="700" letter-spacing=".8">18 – 29/12/1972</text>
        <text x="204" y="55" fill="#f4f1e9" font-size="13" font-family="Playfair Display, Georgia, serif">“Vạch nhiễu tìm thù”</text>
        <text x="204" y="82" fill="#c7c8ba" font-size="10.4">• Tên lửa SAM-2 cải tiến</text>
        <text x="210" y="97" fill="#c7c8ba" font-size="10.4">bắt sống dải nhiễu B-52</text>
        <text x="204" y="120" fill="#c7c8ba" font-size="10.4">• MiG-21 (Phạm Tuân…),</text>
        <text x="210" y="135" fill="#c7c8ba" font-size="10.4">cao xạ &amp; dân quân tự vệ</text>
        <text x="210" y="150" fill="#c7c8ba" font-size="10.4">hiệp đồng bảo vệ Thủ đô</text>
        <text x="204" y="178" fill="#b7d3be" font-size="10" font-weight="600">→ Sơ tán &gt;50 vạn dân Hà Nội</text>

        <path d="M352 109 L368 109" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="374,109 365,103 365,115" fill="#d2b49d"/>

        <rect x="376" y="12" width="156" height="194" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9.2" font-weight="700" letter-spacing=".8">ĐIỆN BIÊN PHỦ TRÊN KHÔNG</text>
        <text x="388" y="55" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Đập tan uy thế B-52</text>
        <text x="388" y="82" fill="#fff7ee" font-size="10.4">• 12 ngày: hạ 81 máy bay</text>
        <text x="394" y="97" fill="#fff7ee" font-size="10.4">(gồm 34 B-52, 5 F-111)</text>
        <text x="388" y="120" fill="#fff7ee" font-size="10.4">• Tổng đợt II (4/72–1/73):</text>
        <text x="394" y="135" fill="#fff7ee" font-size="10.4">735 chiếc, gồm 61 B-52</text>
        <text x="394" y="150" fill="#fff7ee" font-size="10.4">(SAC nhận 15 B-52 mất hẳn)</text>
        <text x="388" y="178" fill="#ffe7c7" font-size="10" font-weight="600">→ Mỹ ngừng bom 30/12 · Ký Pa-ri</text>
      </svg>
    `;
  }
  if (diagram.type === 'paris-accords-turning-point') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 212" role="img" aria-label="Sơ đồ bước ngoặt từ thắng lợi chiến trường đến Hiệp định Pa-ri 27/1/1973">
        <rect x="8" y="12" width="156" height="188" rx="4" fill="#44130d" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0c9ad" font-size="9.2" font-weight="700" letter-spacing=".8">1972 · CHIẾN TRƯỜNG</text>
        <text x="20" y="56" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Thế mạnh buộc đàm phán</text>
        <text x="20" y="84" fill="#f2e5d9" font-size="10.6">• Tiến công 1972 &amp; 81 ngày</text>
        <text x="26" y="100" fill="#f2e5d9" font-size="10.6">đêm Thành cổ Quảng Trị</text>
        <text x="20" y="126" fill="#f2e5d9" font-size="10.6">• Đập tan B-52 trên bầu</text>
        <text x="26" y="142" fill="#f2e5d9" font-size="10.6">trời Hà Nội (12/1972)</text>
        <text x="20" y="172" fill="#ffe7c7" font-size="10.2" font-weight="600">→ Mỹ cạn con bài ép ký</text>

        <path d="M168 106 L184 106" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="190,106 181,100 181,112" fill="#f0c9ad"/>

        <rect x="192" y="12" width="156" height="188" rx="4" fill="#5e1b12" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="204" y="34" fill="#f0c9ad" font-size="9.2" font-weight="700" letter-spacing=".8">27/1/1973 · PA-RI</text>
        <text x="204" y="56" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">9 Chương · 23 Điều</text>
        <text x="204" y="84" fill="#f2e5d9" font-size="10.6">• Mỹ công nhận độc lập,</text>
        <text x="210" y="100" fill="#f2e5d9" font-size="10.6">thống nhất, toàn vẹn VN</text>
        <text x="204" y="126" fill="#f2e5d9" font-size="10.6">• Rút hết quân Mỹ 60 ngày;</text>
        <text x="210" y="142" fill="#f2e5d9" font-size="10.6">LLVT MN giữ nguyên vị trí</text>
        <text x="204" y="172" fill="#ffe7c7" font-size="10.2" font-weight="600">→ Đính kèm 4 Nghị định thư</text>

        <path d="M352 106 L368 106" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="374,106 365,100 365,112" fill="#f0c9ad"/>

        <rect x="376" y="12" width="156" height="188" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9.2" font-weight="700" letter-spacing=".8">TỪ 29/3/1973</text>
        <text x="388" y="56" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">“Đánh cho Mỹ cút”</text>
        <text x="388" y="84" fill="#fff7ee" font-size="10.6">• Lính Mỹ cuối cùng rời</text>
        <text x="394" y="100" fill="#fff7ee" font-size="10.6">miền Nam (29/3/1973)</text>
        <text x="388" y="126" fill="#fff7ee" font-size="10.6">• Xoay hẳn so sánh lực</text>
        <text x="394" y="142" fill="#fff7ee" font-size="10.6">lượng theo hướng có lợi</text>
        <text x="388" y="172" fill="#ffe7c7" font-size="10.2" font-weight="600">→ Tiến tới “ngụy nhào” 1975</text>
      </svg>
    `;
  }
  if (diagram.type === 'spring1975-context-strategy') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ hoàn cảnh sau Hiệp định Pa-ri và quyết tâm giải phóng miền Nam 1975">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.4" font-weight="700" letter-spacing=".8">01 · SAU PA-RI (1973–1974)</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Thế và lực xoay chiều</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.8">• Mỹ cuốn cờ MACV (29/3/1973)</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.8">• Watergate, Mỹ giảm viện trợ SG</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.8">• Lập 4 quân đoàn &amp; ống dầu TS</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Đánh trả âm mưu lấn chiếm</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.4" font-weight="700" letter-spacing=".8">02 · TRINH SÁT CHIẾN LƯỢC</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13" font-family="Playfair Display, Georgia, serif">Phước Long → Kế hoạch 1975</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.8">• NQ TW 21 (7/73): Giữ thế tiến công</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.8">• Giải phóng Phước Long (6/1/75)</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.8">• Khẳng định Mỹ không quay lại</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Chọn Tây Nguyên làm điểm nổ</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.2" font-family="Playfair Display, Georgia, serif" font-weight="600">HỘI NGHỊ BỘ CHÍNH TRỊ (CUỐI 1974 – ĐẦU 1975): CHỚP THỜI CƠ</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.4">Kế hoạch 1975–1976 · “Thời cơ đến lập tức giải phóng miền Nam ngay năm 1975”</text>
      </svg>
    `;
  }
  if (diagram.type === 'war-aftermath-agent-orange') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 248" role="img" aria-label="Sơ đồ bốn mảng hậu quả nặng nề Việt Nam phải gánh chịu sau cuộc chiến tranh 1954–1975">
        <rect x="8" y="8" width="256" height="110" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="20" y="28" fill="#f0beaa" font-size="9.4" font-weight="700" letter-spacing=".8">01 · SINH MẠNG CON NGƯỜI</text>
        <text x="20" y="49" fill="#ffd9c7" font-size="13.2" font-family="Playfair Display, Georgia, serif">Mất mát chưa từng có</text>
        <text x="20" y="70" fill="#e5cbc2" font-size="10.6">• ~2 tr dân chết; &gt;2 tr thương tật</text>
        <text x="20" y="87" fill="#e5cbc2" font-size="10.6">• ~1,1 tr liệt sĩ; &gt;60 vạn TB–BB</text>
        <text x="20" y="106" fill="#ffe7c7" font-size="9.8" font-weight="600">→ &gt;30 vạn liệt sĩ chưa thấy hài cốt</text>

        <rect x="276" y="8" width="256" height="110" rx="4" fill="#252c24" stroke="#c94b38" stroke-width="1.2"/>
        <text x="288" y="28" fill="#d2b49d" font-size="9.4" font-weight="700" letter-spacing=".8">02 · BOM ĐẠN &amp; BOM MÌN</text>
        <text x="288" y="49" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">&gt; 15 triệu tấn bom đạn</text>
        <text x="288" y="70" fill="#c7c8ba" font-size="10.6">• Gấp ~3x WWII · &gt;12x Triều Tiên</text>
        <text x="288" y="87" fill="#c7c8ba" font-size="10.6">• 80 vạn tấn mìn sót trên &gt;6,1 tr ha</text>
        <text x="288" y="106" fill="#f0beaa" font-size="9.8" font-weight="600">→ &gt;4 vạn dân chết trong thời bình</text>

        <rect x="8" y="130" width="256" height="110" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="150" fill="#b7d3be" font-size="9.4" font-weight="700" letter-spacing=".8">03 · HẠ TẦNG KIỆT QUỆ</text>
        <text x="20" y="171" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Tàn phá huyết mạch cả nước</text>
        <text x="20" y="192" fill="#c7c8ba" font-size="10.6">• 70% cảng, 80% Đ.sắt, 60% Đ.bộ</text>
        <text x="20" y="209" fill="#c7c8ba" font-size="10.6">• San bằng TP/thị xã lớn miền Bắc</text>
        <text x="20" y="228" fill="#b7d3be" font-size="9.8" font-weight="600">→ Cầu đường, điện, trường, y tế vỡ</text>

        <rect x="276" y="130" width="256" height="110" rx="4" fill="#3a211c" stroke="#e0614c" stroke-width="1.3"/>
        <text x="288" y="150" fill="#ffe7c7" font-size="9.4" font-weight="700" letter-spacing=".8">04 · THẢM HỌA DIOXIN</text>
        <text x="288" y="171" fill="#ffffff" font-size="13.2" font-family="Playfair Display, Georgia, serif">~80 triệu lít chất độc</text>
        <text x="288" y="192" fill="#f2e5d9" font-size="10.6">• 61% da cam; &gt;3,06 tr ha (3,3 tr)</text>
        <text x="288" y="209" fill="#f2e5d9" font-size="10.6">• 4,8 tr phơi nhiễm; &gt;3 tr nạn nhân</text>
        <text x="288" y="228" fill="#ffe7c7" font-size="9.8" font-weight="600">→ Di truyền sang thế hệ thứ 3, 4</text>
      </svg>
    `;
  }
  if (diagram.type === 'postparis-sabotage-balance') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ hoàn cảnh sau Hiệp định Pa-ri 1973 và âm mưu phá hoại của Mỹ – chính quyền Sài Gòn">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.4" font-weight="700" letter-spacing=".8">01 · HOÀN CẢNH (29/3/1973)</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Mỹ cuốn cờ, rút bộ binh</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.6">• Lính Mỹ cuối rời SG (29/3/1973)</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.6">• Ở MN: 2 chính quyền, 2 quân đội</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.6">• Watergate &amp; Mỹ cắt giảm viện trợ</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Thế “da báo” giằng co quyết liệt</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.4" font-weight="700" letter-spacing=".8">02 · PHÁ HOẠI HIỆP ĐỊNH PA-RI</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13" font-family="Playfair Display, Georgia, serif">“Tràn ngập lãnh thổ” &amp; DAO</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.6">• Thiệu hô “4 không”, mở bình định</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.6">• Giam &gt;20 vạn tù CT, phá HĐ 3 TP</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.6">• Mỹ giữ &gt;2 vạn DAO, đổ F-5E/M-48</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Tiếp tục chiến tranh thực dân mới</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.2" font-family="Playfair Display, Georgia, serif" font-weight="600">NGHỊ QUYẾT TW 21 (7/1973): GIỮ VỮNG CON ĐƯỜNG BẠO LỰC CÁCH MẠNG</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.4">Kiên quyết phản công chống lấn chiếm → Từ Chương Thiện, Thượng Đức đến Phước Long</text>
      </svg>
    `;
  }
  if (diagram.type === 'ch10-rear-corps-trails') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 244" role="img" aria-label="Sơ đồ hậu phương miền Bắc khôi phục kinh tế, lập các quân đoàn chủ lực và mở rộng Đường Trường Sơn 1973–1975">
        <rect x="8" y="10" width="252" height="114" rx="4" fill="#252c24" stroke="#6c8d73" stroke-width="1.2"/>
        <text x="20" y="30" fill="#b7d3be" font-size="9.4" font-weight="700" letter-spacing=".8">01 · HẬU PHƯƠNG MIỀN BẮC</text>
        <text x="20" y="51" fill="#f4f1e9" font-size="13.2" font-family="Playfair Display, Georgia, serif">Hàn gắn &amp; Khôi phục (73–74)</text>
        <text x="20" y="72" fill="#c7c8ba" font-size="10.6">• Rà thủy lôi, nối lại cầu – cảng</text>
        <text x="20" y="89" fill="#c7c8ba" font-size="10.6">• Nông–công nghiệp gần/vượt 1965</text>
        <text x="20" y="106" fill="#c7c8ba" font-size="10.6">• Huy động &gt;20 vạn quân vào Nam</text>
        <text x="20" y="120" fill="#b7d3be" font-size="9.8" font-weight="600">→ Dốc sức người, của cho tiền tuyến</text>

        <rect x="280" y="10" width="252" height="114" rx="4" fill="#321d1a" stroke="#c94b38" stroke-width="1.2"/>
        <text x="292" y="30" fill="#f0beaa" font-size="9.4" font-weight="700" letter-spacing=".8">02 · QUÂN ĐOÀN &amp; TRƯỜNG SƠN</text>
        <text x="292" y="51" fill="#ffd9c7" font-size="13" font-family="Playfair Display, Georgia, serif">Lập Quân đoàn &amp; Đường 8m</text>
        <text x="292" y="72" fill="#e5cbc2" font-size="10.6">• Lập QĐ 1 (73), QĐ 2 &amp; QĐ 4 (74)</text>
        <text x="292" y="89" fill="#e5cbc2" font-size="10.6">• Đường TS Đông thông tới B2</text>
        <text x="292" y="106" fill="#e5cbc2" font-size="10.6">• &gt;5.000 km ống dẫn xăng dầu</text>
        <text x="292" y="120" fill="#f0beaa" font-size="9.8" font-weight="600">→ Đủ sức đánh hiệp đồng quy mô lớn</text>

        <path d="M134 124 L134 144 L260 144 L260 160" fill="none" stroke="#6c8d73" stroke-width="1.8"/>
        <path d="M406 124 L406 144 L280 144 L280 160" fill="none" stroke="#c94b38" stroke-width="1.8"/>
        <polygon points="270,168 262,157 278,157" fill="#e6d6c8"/>

        <rect x="16" y="168" width="508" height="64" rx="4" fill="#3a211c" stroke="#c94b38" stroke-width="1.4"/>
        <text x="270" y="191" text-anchor="middle" fill="#f4f1e9" font-size="12.2" font-family="Playfair Display, Georgia, serif" font-weight="600">THẾ VÀ LỰC VƯỢT TRỘI TRƯỚC THỀM XUÂN 1975</text>
        <text x="270" y="211" text-anchor="middle" fill="#e6d6c8" font-size="10.4">Binh đoàn chủ lực cơ động + tăng pháo hạng nặng đứng chân vững chắc trên các hướng</text>
      </svg>
    `;
  }
  if (diagram.type === 'ch10-spring1975-preconditions') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 218" role="img" aria-label="Sơ đồ các tiền đề trực tiếp và quyết tâm chiến lược của Bộ Chính trị dẫn tới Tổng tiến công và nổi dậy Xuân 1975">
        <rect x="8" y="12" width="156" height="194" rx="4" fill="#44130d" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="20" y="34" fill="#f0c9ad" font-size="9" font-weight="700" letter-spacing=".8">TRINH SÁT CHIẾN LƯỢC</text>
        <text x="20" y="55" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Phước Long (6/1/1975)</text>
        <text x="20" y="80" fill="#f2e5d9" font-size="10.2">• Giải phóng trọn tỉnh</text>
        <text x="26" y="95" fill="#f2e5d9" font-size="10.2">đầu tiên gần Sài Gòn</text>
        <text x="20" y="116" fill="#f2e5d9" font-size="10.2">• VNCH bất lực tái chiếm;</text>
        <text x="26" y="131" fill="#f2e5d9" font-size="10.2">Mỹ răn đe suông từ xa</text>
        <text x="20" y="152" fill="#f2e5d9" font-size="10.2">• Thiệu kêu cứu vô hiệu</text>
        <text x="20" y="185" fill="#ffe7c7" font-size="10" font-weight="600">→ Mỹ khó quay lại MN</text>

        <path d="M168 109 L184 109" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="190,109 181,103 181,115" fill="#f0c9ad"/>

        <rect x="192" y="12" width="156" height="194" rx="4" fill="#5e1b12" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="204" y="34" fill="#f0c9ad" font-size="9" font-weight="700" letter-spacing=".8">THẾ &amp; LỰC ĐẢO CHIỀU</text>
        <text x="204" y="55" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Thời cơ chín muồi</text>
        <text x="204" y="80" fill="#f2e5d9" font-size="10.2">• Quân đoàn, tăng pháo</text>
        <text x="210" y="95" fill="#f2e5d9" font-size="10.2">và ống dầu sẵn sàng</text>
        <text x="204" y="116" fill="#f2e5d9" font-size="10.2">• Watergate, cắt viện trợ</text>
        <text x="210" y="131" fill="#f2e5d9" font-size="10.2">làm ngụy quân rệu rã</text>
        <text x="204" y="152" fill="#f2e5d9" font-size="10.2">• Miền Bắc hồi phục mạnh</text>
        <text x="204" y="185" fill="#ffe7c7" font-size="10" font-weight="600">→ So sánh nghiêng hẳn ta</text>

        <path d="M352 109 L368 109" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="374,109 365,103 365,115" fill="#f0c9ad"/>

        <rect x="376" y="12" width="156" height="194" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9" font-weight="700" letter-spacing=".8">18/12/74 – 8/1/1975</text>
        <text x="388" y="55" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Quyết tâm Xuân 1975</text>
        <text x="388" y="80" fill="#fff7ee" font-size="10.2">• Kế hoạch 2 năm 75–76,</text>
        <text x="394" y="95" fill="#fff7ee" font-size="10.2">chọn Tây Nguyên mở đầu</text>
        <text x="388" y="116" fill="#fff7ee" font-size="10.2">• Thời cơ đến 1975 thì</text>
        <text x="394" y="131" fill="#fff7ee" font-size="10.2">giải phóng ngay năm 1975</text>
        <text x="388" y="152" fill="#fff7ee" font-size="10.2">• Giảm tối đa đổ nát đô thị</text>
        <text x="388" y="185" fill="#ffe7c7" font-size="10" font-weight="600">→ Mở màn Buôn Ma Thuột</text>
      </svg>
    `;
  }
  if (diagram.type === 'reunification-context-matrix') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 226" role="img" aria-label="Sơ đồ bối cảnh sau 30/4/1975 và các bước chuẩn bị thống nhất đất nước về mặt nhà nước">
        <rect x="8" y="12" width="156" height="202" rx="4" fill="#232921" stroke="#5f7a65" stroke-width="1.25"/>
        <text x="20" y="34" fill="#b7d3be" font-size="9" font-weight="700" letter-spacing=".8">SAU 30/4/1975</text>
        <text x="20" y="54" fill="#f4f1e9" font-size="13" font-family="Playfair Display, Georgia, serif">Hai nhà nước song hành</text>
        <text x="20" y="80" fill="#d1d2c5" font-size="10.2">• Lãnh thổ đã liền một dải</text>
        <text x="20" y="98" fill="#d1d2c5" font-size="10.2">• Bắc: VNDCCH (Quốc hội V)</text>
        <text x="20" y="116" fill="#d1d2c5" font-size="10.2">• Nam: CP CMLT &amp; Quân quản</text>
        <text x="20" y="134" fill="#d1d2c5" font-size="10.2">• Vết thương chiến tranh lớn</text>
        <text x="20" y="152" fill="#d1d2c5" font-size="10.2">• KTXH hai miền còn lệch</text>
        <text x="20" y="194" fill="#ffe7c7" font-size="10" font-weight="600">→ Cần thống nhất thiết chế</text>

        <path d="M168 113 L184 113" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="190,113 181,107 181,119" fill="#d2b49d"/>

        <rect x="192" y="12" width="156" height="202" rx="4" fill="#4e1b14" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="204" y="34" fill="#f0c9ad" font-size="9" font-weight="700" letter-spacing=".8">15–21/11/1975 · SÀI GÒN</text>
        <text x="204" y="54" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Hiệp thương chính trị</text>
        <text x="204" y="80" fill="#f2e5d9" font-size="10.2">• Thực hiện NQ TW 24 (8/1975)</text>
        <text x="204" y="98" fill="#f2e5d9" font-size="10.2">• 25 đb Bắc (Trường Chinh)</text>
        <text x="204" y="116" fill="#f2e5d9" font-size="10.2">• 25 đb Nam (Phạm Hùng)</text>
        <text x="204" y="134" fill="#f2e5d9" font-size="10.2">• Nhất trí đường lối hợp nhất</text>
        <text x="204" y="152" fill="#f2e5d9" font-size="10.2">• Bầu một Quốc hội chung</text>
        <text x="204" y="194" fill="#ffe7c7" font-size="10" font-weight="600">→ Chốt Tổng tuyển cử 1976</text>

        <path d="M352 113 L368 113" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="374,113 365,107 365,119" fill="#f0c9ad"/>

        <rect x="376" y="12" width="156" height="202" rx="4" fill="#7d2518" stroke="#ffe7c7" stroke-width="1.4"/>
        <text x="388" y="34" fill="#ffe7c7" font-size="9" font-weight="700" letter-spacing=".8">12/1975 – 3/1976</text>
        <text x="388" y="54" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Chuẩn bị toàn quốc</text>
        <text x="388" y="80" fill="#fff7ee" font-size="10.2">• Hai miền phê chuẩn (12/75)</text>
        <text x="388" y="98" fill="#fff7ee" font-size="10.2">• Lập HĐBC toàn quốc: 22 TV</text>
        <text x="388" y="116" fill="#fff7ee" font-size="10.2">• Ấn định ngày 25/4/1976</text>
        <text x="388" y="134" fill="#fff7ee" font-size="10.2">• Trả quyền công dân MN</text>
        <text x="388" y="152" fill="#fff7ee" font-size="10.2">• Lập sổ &gt; 23 triệu cử tri</text>
        <text x="388" y="194" fill="#ffe7c7" font-size="10" font-weight="600">→ Ngày hội 25/4/1976</text>
      </svg>
    `;
  }
  if (diagram.type === 'election-1976-breakdown') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 236" role="img" aria-label="Biểu đồ tỷ lệ cử tri đi bầu 98,77% và cơ cấu 492 đại biểu Quốc hội khóa VI ngày 25/4/1976">
        <rect x="8" y="8" width="524" height="82" rx="4" fill="#faf9f5" stroke="#dedad0" stroke-width="1.1"/>
        <text x="20" y="27" fill="#a63727" font-size="9.5" font-weight="700" letter-spacing=".8">TỶ LỆ CỬ TRI ĐI BỎ PHIẾU NGÀY 25/4/1976 (&gt; 23 TRIỆU CỬ TRI)</text>

        <text x="20" y="47" fill="#262b25" font-size="10.5" font-weight="600">Cả nước</text>
        <rect x="92" y="38" width="356" height="11" rx="2" fill="#e9e6dc"/>
        <rect x="92" y="38" width="351.6" height="11" rx="2" fill="#a63727"/>
        <text x="456" y="47" fill="#a63727" font-size="10.8" font-weight="700">98,77%</text>

        <text x="20" y="65" fill="#4d5148" font-size="10">Miền Bắc</text>
        <rect x="92" y="56" width="356" height="9" rx="2" fill="#e9e6dc"/>
        <rect x="92" y="56" width="353.7" height="9" rx="2" fill="#355b46"/>
        <text x="456" y="64" fill="#355b46" font-size="10.2" font-weight="700">99,36%</text>

        <text x="20" y="81" fill="#4d5148" font-size="10">Miền Nam</text>
        <rect x="92" y="72" width="356" height="9" rx="2" fill="#e9e6dc"/>
        <rect x="92" y="72" width="351.0" height="9" rx="2" fill="#c94b38"/>
        <text x="456" y="80" fill="#a63727" font-size="10.2" font-weight="700">98,59%</text>

        <rect x="8" y="98" width="524" height="130" rx="4" fill="#ffffff" stroke="#dedad0" stroke-width="1.1"/>
        <text x="20" y="118" fill="#262b25" font-size="10.5" font-weight="700" letter-spacing=".4">492 ĐẠI BIỂU TRÚNG CỬ QUỐC HỘI KHÓA VI (VÒNG 1)</text>
        <text x="518" y="118" text-anchor="end" fill="#54584e" font-size="10" font-weight="600">249 Bắc · 243 Nam</text>

        <rect x="20" y="128" width="253" height="18" rx="2" fill="#355b46"/>
        <text x="146" y="140.5" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="600">Miền Bắc: 249 đại biểu (50,6%)</text>
        <rect x="275" y="128" width="245" height="18" rx="2" fill="#a63727"/>
        <text x="397" y="140.5" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="600">Miền Nam: 243 đại biểu (49,4%)</text>

        <text x="20" y="166" fill="#4d5148" font-size="10">• Cán bộ CT: <tspan font-weight="700" fill="#262b25">141</tspan></text>
        <text x="148" y="166" fill="#4d5148" font-size="10">• Nông dân: <tspan font-weight="700" fill="#262b25">100</tspan></text>
        <text x="268" y="166" fill="#4d5148" font-size="10">• Trí thức – nhân sĩ: <tspan font-weight="700" fill="#262b25">98</tspan></text>
        <text x="418" y="166" fill="#4d5148" font-size="10">• Công nhân: <tspan font-weight="700" fill="#262b25">80</tspan></text>

        <text x="20" y="185" fill="#4d5148" font-size="10">• Quân đội: <tspan font-weight="700" fill="#262b25">54</tspan></text>
        <text x="148" y="185" fill="#4d5148" font-size="10">• Tôn giáo: <tspan font-weight="700" fill="#262b25">13</tspan></text>
        <text x="268" y="185" fill="#4d5148" font-size="10">• Thủ công nghiệp: <tspan font-weight="700" fill="#262b25">6</tspan></text>
        <text x="418" y="185" fill="#a63727" font-size="10" font-weight="700">Tổng = 492 ghế</text>

        <rect x="20" y="197" width="500" height="22" rx="3" fill="#fff6f3" stroke="#e4c3bc" stroke-width="1"/>
        <text x="270" y="211.5" text-anchor="middle" fill="#6b251b" font-size="9.8" font-weight="600">Đại diện toàn dân: 132 Phụ nữ (26%) · 67 Dân tộc thiểu số (13,6%) · 58 Thanh niên · 94 Ngoài Đảng</text>
      </svg>
    `;
  }
  if (diagram.type === 'sixth-national-assembly-1976') {
    return `
      <svg class="part-svg-diagram" viewBox="0 0 540 224" role="img" aria-label="Sơ đồ các quyết nghị trọng đại của Kỳ họp thứ nhất Quốc hội khóa VI từ 24/6 đến 3/7/1976">
        <rect x="8" y="12" width="156" height="200" rx="4" fill="#631d14" stroke="#f0c9ad" stroke-width="1.3"/>
        <text x="20" y="34" fill="#ffe7c7" font-size="9" font-weight="700" letter-spacing=".8">NGHỊ QUYẾT 02/7/1976</text>
        <text x="20" y="54" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Biểu tượng Quốc gia</text>
        <text x="20" y="80" fill="#fff7ee" font-size="10.2">• Quốc hiệu: CHXHCN</text>
        <text x="26" y="95" fill="#fff7ee" font-size="10.2">Việt Nam</text>
        <text x="20" y="114" fill="#fff7ee" font-size="10.2">• Quốc kỳ: Cờ đỏ sao vàng</text>
        <text x="20" y="132" fill="#fff7ee" font-size="10.2">• Quốc huy &amp; Quốc ca</text>
        <text x="20" y="150" fill="#fff7ee" font-size="10.2">• Thủ đô: Hà Nội</text>
        <text x="20" y="168" fill="#fff7ee" font-size="10.2">• TP. Hồ Chí Minh</text>
        <text x="20" y="196" fill="#ffe7c7" font-size="9.8" font-weight="600">→ Thống nhất tên &amp; biểu tượng</text>

        <path d="M168 112 L184 112" stroke="#f0c9ad" stroke-width="2"/>
        <polygon points="190,112 181,106 181,118" fill="#f0c9ad"/>

        <rect x="192" y="12" width="156" height="200" rx="4" fill="#232921" stroke="#d2b49d" stroke-width="1.25"/>
        <text x="204" y="34" fill="#d2b49d" font-size="9" font-weight="700" letter-spacing=".8">KIỆN TOÀN BỘ MÁY</text>
        <text x="204" y="54" fill="#ffffff" font-size="13" font-family="Playfair Display, Georgia, serif">Lãnh đạo Nhà nước</text>
        <text x="204" y="80" fill="#e8e6dc" font-size="10.2">• Chủ tịch nước:</text>
        <text x="210" y="95" fill="#ffe7c7" font-size="10.2" font-weight="600">Tôn Đức Thắng</text>
        <text x="204" y="114" fill="#e8e6dc" font-size="10.2">• Phó CT: N. Lương Bằng,</text>
        <text x="210" y="129" fill="#e8e6dc" font-size="10.2">Nguyễn Hữu Thọ</text>
        <text x="204" y="148" fill="#e8e6dc" font-size="10.2">• CT UBTVQH: Trường Chinh</text>
        <text x="204" y="166" fill="#e8e6dc" font-size="10.2">• Thủ tướng: Phạm Văn Đồng</text>
        <text x="204" y="196" fill="#b7d3be" font-size="9.8" font-weight="600">→ Quyền lực tập trung nhất</text>

        <path d="M352 112 L368 112" stroke="#d2b49d" stroke-width="2"/>
        <polygon points="374,112 365,106 365,118" fill="#d2b49d"/>

        <rect x="376" y="12" width="156" height="200" rx="4" fill="#1e241d" stroke="#5f7a65" stroke-width="1.25"/>
        <text x="388" y="34" fill="#b7d3be" font-size="9" font-weight="700" letter-spacing=".8">HIẾN PHÁP &amp; TIẾP NỐI</text>
        <text x="388" y="54" fill="#f4f1e9" font-size="13" font-family="Playfair Display, Georgia, serif">Mở kỷ nguyên mới</text>
        <text x="388" y="80" fill="#d1d2c5" font-size="10.2">• Lập UB Dự thảo Hiến pháp</text>
        <text x="394" y="95" fill="#d1d2c5" font-size="10.2">(36 vị · CT Trường Chinh)</text>
        <text x="388" y="116" fill="#d1d2c5" font-size="10.2">• Đại hội IV Đảng (12/1976)</text>
        <text x="388" y="136" fill="#d1d2c5" font-size="10.2">• Việt Nam gia nhập LHQ</text>
        <text x="394" y="151" fill="#d1d2c5" font-size="10.2">#149 (20/9/1977)</text>
        <text x="388" y="170" fill="#d1d2c5" font-size="10.2">• Hiến pháp 1980 (12/1980)</text>
        <text x="388" y="196" fill="#ffe7c7" font-size="9.8" font-weight="600">→ Trọn vẹn 1945–1976</text>
      </svg>
    `;
  }
  return '';
}

function flattenPartMilestones(part) {
  const list = [];
  (part.stages || []).forEach((st, stageIdx) => {
    (st.events || []).forEach((ev, evIdx) => {
      list.push({
        globalIdx: list.length,
        stageIdx,
        evIdx,
        stageCode: st.code,
        stagePeriod: st.period,
        stageTitle: st.title,
        ...ev,
      });
    });
  });
  return list;
}

function getMilestoneCueLabel(item, isSelected) {
  if (isSelected) return 'Đang xem ↗';
  if (item?.video) return item?.noImage ? 'Xem video & chi tiết →' : 'Xem ảnh, video & chi tiết →';
  return item?.noImage ? 'Xem chi tiết →' : 'Xem ảnh & chi tiết →';
}

function renderMilestoneMediaHtml(item, totalCount) {
  if (item.noImage) return '';
  const codeNum = String(item.globalIdx + 1).padStart(2, '0');
  const totalNum = String(totalCount).padStart(2, '0');
  if (item.images?.length) {
    const cardsHtml = item.images
      .map((img, i) => {
        const innerImg = `
          <div class="milestone-pair-frame">
            <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.caption || item.title)}" width="600" height="480" />
          </div>
          ${img.caption ? `<span class="milestone-pair-cap"><b>${i + 1}.</b> ${escapeHtml(img.caption)}${img.docId ? ' <em>· Đọc ↗</em>' : ''}</span>` : ''}
        `;
        if (img.docId) {
          return `<button type="button" class="milestone-pair-card is-doc-trigger" data-doc-open="${escapeHtml(img.docId)}" aria-label="Mở pop-up đọc ${escapeHtml(img.caption || img.alt || 'tư liệu')}">${innerImg}</button>`;
        }
        return `<div class="milestone-pair-card">${innerImg}</div>`;
      })
      .join('');
    return `<div class="milestone-photo-grid${item.images.length === 2 ? ' is-pair' : ''}">${cardsHtml}</div>`;
  }
  if (item.image) {
    const zoomAttrs = item.zoomable
      ? `data-zoom-src="${escapeHtml(item.image)}" data-zoom-alt="${escapeHtml(item.imageAlt || item.title)}" data-zoom-title="${escapeHtml(item.title)}" data-zoom-caption="${escapeHtml(item.imageCaption || item.photoHint || '')}"`
      : '';
    const imgMarkup = `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.title)}" width="960" height="600" />`;
    const frameMarkup = item.zoomable
      ? `
        <button type="button" class="milestone-photo-frame is-zoomable${item.isDocument ? ' is-document' : ''}" ${zoomAttrs} aria-label="Phóng to ảnh ${escapeHtml(item.imageAlt || item.title)}">
          ${imgMarkup}
          <span class="milestone-zoom-badge">Phóng to ↗</span>
        </button>
      `
      : `
        <div class="milestone-photo-frame${item.isDocument ? ' is-document' : ''}">
          ${imgMarkup}
        </div>
      `;
    return `
      ${frameMarkup}
      ${item.imageCaption || item.photoHint ? `<figcaption class="milestone-photo-cap"><span>${escapeHtml(item.imageCaption || item.photoHint)}</span>${item.imageCredit ? `<small>${escapeHtml(item.imageCredit)}</small>` : ''}</figcaption>` : ''}
    `;
  }
  return `
    <div class="milestone-photo-slot" role="img" aria-label="Khung chờ ảnh tư liệu cho mốc ${escapeHtml(item.date)}: ${escapeHtml(item.title)}">
      <div class="milestone-slot-badge">KHUNG CHỜ ẢNH TƯ LIỆU · MỐC ${codeNum}/${totalNum}</div>
      <svg class="milestone-slot-icon" viewBox="0 0 48 36" width="44" height="33" aria-hidden="true">
        <rect x="2" y="2" width="44" height="32" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="15" cy="13" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 30 L17 19 L26 26 L34 18 L43 27" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
      <p class="milestone-slot-hint">${escapeHtml(item.photoHint || 'Sẵn sàng chèn ảnh tư liệu lịch sử phù hợp với mốc sự kiện này.')}</p>
    </div>
  `;
}

function renderMilestoneFactsHtml(facts) {
  if (!facts?.length) return '';
  return facts
    .map((fact) => {
      const colonIdx = fact.indexOf(':');
      if (colonIdx > 0 && colonIdx < 36) {
        const label = fact.slice(0, colonIdx).trim();
        const value = fact.slice(colonIdx + 1).trim();
        return `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`;
      }
      return `<li>${escapeHtml(fact)}</li>`;
    })
    .join('');
}

function formatCombatValueHtml(text) {
  const str = String(text || '');
  if (str.startsWith('Không xác định')) {
    const rest = str.slice('Không xác định'.length);
    return `<span class="combat-unknown-tag">Không xác định</span>${rest ? ` ${escapeHtml(rest.trim())}` : ''}`;
  }
  return escapeHtml(str);
}

function renderMilestoneExtraHtml(item) {
  const chunks = [];

  if (item.documents?.length) {
    const docBtnsHtml = item.documents
      .map(
        (doc, idx) => `
          <button type="button" class="milestone-doc-btn" data-doc-open="${escapeHtml(doc.id)}">
            <span class="milestone-doc-num">${String(idx + 1).padStart(2, '0')}</span>
            <span class="milestone-doc-label">${escapeHtml(doc.buttonLabel || doc.title)}</span>
            <span class="milestone-doc-arrow" aria-hidden="true">Đọc ↗</span>
          </button>
        `,
      )
      .join('');
    chunks.push(`
      <div class="milestone-doc-tray">
        <p class="milestone-extra-kicker">TƯ LIỆU NGUYÊN VĂN &amp; BẢN DỊCH · BẤM ĐỂ MỞ POP-UP</p>
        <div class="milestone-doc-buttons">${docBtnsHtml}</div>
      </div>
    `);
  }

  if (item.combatBalance || item.casualties) {
    const taBalLabel = item.combatBalance?.taLabel || 'PHÍA TA (VIỆT NAM)';
    const enemyBalLabel = item.combatBalance?.enemyLabel || 'PHÍA PHÁP';
    const enemyBalVal = item.combatBalance?.enemy ?? item.combatBalance?.phap;
    const taCasLabel = item.casualties?.taLabel || 'TỔN THẤT PHÍA TA';
    const enemyCasLabel = item.casualties?.enemyLabel || 'TỔN THẤT PHÍA PHÁP';
    const enemyCasVal = item.casualties?.enemy ?? item.casualties?.phap;
    const panels = [];
    if (item.combatBalance) {
      panels.push(`
        <section class="milestone-combat-block is-balance">
          <p class="milestone-extra-kicker">${escapeHtml(item.combatBalance.heading || 'Tương quan lực lượng hai bên')}</p>
          <div class="milestone-combat-cols">
            <div class="milestone-combat-side is-ta">
              <small>${escapeHtml(taBalLabel)}</small>
              <p>${formatCombatValueHtml(item.combatBalance.ta)}</p>
            </div>
            <div class="milestone-combat-side is-phap">
              <small>${escapeHtml(enemyBalLabel)}</small>
              <p>${formatCombatValueHtml(enemyBalVal)}</p>
            </div>
          </div>
        </section>
      `);
    }
    if (item.casualties) {
      panels.push(`
        <section class="milestone-combat-block is-casualties">
          <p class="milestone-extra-kicker">${escapeHtml(item.casualties.heading || 'Tổn thất hai bên sau thời điểm')}</p>
          <div class="milestone-combat-cols">
            <div class="milestone-combat-side is-ta">
              <small>${escapeHtml(taCasLabel)}</small>
              <p>${formatCombatValueHtml(item.casualties.ta)}</p>
            </div>
            <div class="milestone-combat-side is-phap">
              <small>${escapeHtml(enemyCasLabel)}</small>
              <p>${formatCombatValueHtml(enemyCasVal)}</p>
            </div>
          </div>
        </section>
      `);
    }
    chunks.push(`<div class="milestone-combat-wrap">${panels.join('')}</div>`);
  }

  if (item.video && (item.video.embedUrl || item.video.youtubeId)) {
    chunks.push(`<section class="milestone-video-block">${renderYoutubeCard(item.video)}</section>`);
  }

  return chunks.join('');
}

function renderMilestoneInspectorShell(part) {
  const milestones = flattenPartMilestones(part);
  const first = milestones[0];
  const cfg = part.media?.milestoneInspector || {};
  if (!first) return '';

  const totalStr = String(milestones.length).padStart(2, '0');
  const firstMediaHtml = renderMilestoneMediaHtml(first, milestones.length);
  const firstExtraHtml = renderMilestoneExtraHtml(first);
  return `
    <div class="diagram-stage-shell is-milestone-panel" id="${escapeHtml(part.id)}-milestone-panel">
      <div class="diagram-card is-on-white">
        <div class="diagram-card-head">
          <strong>${escapeHtml(cfg.title || 'Hồ sơ & Ảnh tư liệu theo mốc')}</strong>
          ${cfg.subtitle ? `<p>${escapeHtml(cfg.subtitle)}</p>` : ''}
        </div>

        <div class="milestone-inspector" aria-live="polite">
          <div class="milestone-nav-bar">
            <div class="milestone-nav-meta">
              <span class="milestone-stage-pill" id="ms-stage-pill">${escapeHtml(first.stageCode)} · ${escapeHtml(first.stagePeriod)}</span>
              <span class="milestone-date-pill" id="ms-date-pill">${escapeHtml(first.date)}</span>
            </div>
            <div class="milestone-step-controls">
              <span class="milestone-counter" id="ms-counter">Mốc 01 / ${totalStr}</span>
              <div class="milestone-step-arrows">
                <button type="button" class="milestone-arrow-btn" data-ms-prev aria-label="Xem mốc trước" disabled>‹</button>
                <button type="button" class="milestone-arrow-btn" data-ms-next aria-label="Xem mốc tiếp theo"${milestones.length <= 1 ? ' disabled' : ''}>›</button>
              </div>
            </div>
          </div>

          <figure class="milestone-media-box" id="ms-photo-box"${firstMediaHtml ? '' : ' hidden'}>
            ${firstMediaHtml}
          </figure>

          <article class="milestone-detail-body">
            <h3 id="ms-title">${escapeHtml(first.title)}</h3>
            <p class="milestone-extended" id="ms-extended">${escapeHtml(first.extendedDetail || first.detail)}</p>
            <ul class="milestone-facts" id="ms-facts">
              ${renderMilestoneFactsHtml(first.keyFacts)}
            </ul>
            <div class="milestone-extra" id="ms-extra"${firstExtraHtml ? '' : ' hidden'}>
              ${firstExtraHtml}
            </div>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderYoutubeCard(video) {
  const thumb = video.thumbnail || (video.youtubeId ? `https://i.ytimg.com/vi/${escapeHtml(video.youtubeId)}/hqdefault.jpg` : '');
  const metaParts = [video.channel ? `Kênh: ${video.channel}` : '', 'YouTube'].filter(Boolean).join(' · ');
  if (video.embedUrl) {
    return `
      <article class="youtube-box is-playable" data-embed="${escapeHtml(video.embedUrl)}" data-title="${escapeHtml(video.title || '')}">
        ${video.tag ? `<p class="yt-card-tag">${escapeHtml(video.tag)}</p>` : ''}
        <button type="button" class="youtube-poster-btn" aria-label="Phát video ${escapeHtml(video.title || 'YouTube')}">
          ${thumb ? `<img class="yt-thumb" src="${escapeHtml(thumb)}" alt="Ảnh xem trước video: ${escapeHtml(video.title || '')}" width="480" height="360" loading="lazy" />` : ''}
          <span class="yt-poster-overlay"><span class="yt-play-badge" aria-hidden="true">▶</span><span class="yt-play-label">Phát video</span></span>
        </button>
        <div class="yt-card-body">
          <h3>${escapeHtml(video.title || '')}</h3>
          ${video.note ? `<p>${escapeHtml(video.note)}</p>` : ''}
          <div class="yt-card-foot">
            <span>${escapeHtml(metaParts)}</span>
            ${video.watchUrl ? `<a class="source-link" href="${escapeHtml(video.watchUrl)}" target="_blank" rel="noopener noreferrer">Mở trên YouTube ↗</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }
  return `
    <div class="youtube-box is-slot">
      <span class="yt-slot-tag">VIDEO YOUTUBE / MINH HỌA BỔ SUNG</span>
      <strong>${escapeHtml(video.title || '')}</strong>
      <p>${escapeHtml(video.note || '')}</p>
    </div>
  `;
}

function formatLabeledBulletHtml(text) {
  const str = String(text || '');
  const colonIdx = str.indexOf(':');
  if (colonIdx > 0 && colonIdx < 52) {
    const label = str.slice(0, colonIdx).trim();
    const rest = str.slice(colonIdx + 1).trim();
    return `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(rest)}`;
  }
  return escapeHtml(str);
}

function renderWarTollSection(wt) {
  if (!wt) return '';
  const metricsColsClass = wt.metrics?.length === 4 ? ' is-4-cols' : '';
  const metricsHtml = wt.metrics?.length
    ? `<div class="famine-metrics${metricsColsClass}">${wt.metrics.map((metric) => `<div class="famine-metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('')}</div>`
    : '';

  const renderSide = (side, variantClass) =>
    side
      ? `
        <div class="context-balance-side ${variantClass}">
          <h4>${escapeHtml(side.label)}</h4>
          <ul>
            ${(side.items || []).map((item) => `<li>${formatLabeledBulletHtml(item)}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

  const casualtiesBlockHtml =
    wt.ta || wt.enemy
      ? `
        <section class="context-subblock is-critical" aria-label="${escapeHtml(wt.casualtiesHeading || 'Tổn thất quân ta và địch giai đoạn 1945–1954')}">
          ${wt.casualtiesTag ? `<p class="part-sub-tag">${escapeHtml(wt.casualtiesTag)}</p>` : ''}
          <h3>${escapeHtml(wt.casualtiesHeading || 'Tổn thất của quân ta và quân địch (1945–1954)')}</h3>
          ${wt.casualtiesLead ? `<p class="war-toll-lead">${escapeHtml(wt.casualtiesLead)}</p>` : ''}
          <div class="context-balance-cols">
            ${renderSide(wt.ta, 'is-ta')}
            ${renderSide(wt.enemy, 'is-phap')}
          </div>
        </section>
      `
      : '';

  const damageCardsHtml = wt.destructionCards?.length
    ? `
      <div class="war-damage-grid">
        ${wt.destructionCards
          .map(
            (card) => `
              <article class="war-damage-card">
                ${card.code ? `<span class="war-damage-code">${escapeHtml(card.code)}</span>` : ''}
                <h4>${escapeHtml(card.title)}</h4>
                ${card.stat ? `<strong class="war-damage-stat">${escapeHtml(card.stat)}</strong>` : ''}
                <p>${escapeHtml(card.text)}</p>
              </article>
            `,
          )
          .join('')}
      </div>
    `
    : '';

  const destructionBlockHtml = wt.destructionCards?.length
    ? `
      <section class="context-subblock war-toll-destruction" aria-label="${escapeHtml(wt.destructionHeading || 'Bom đạn và mức độ tàn phá Việt Nam trong chiến tranh 1945–1954')}">
        ${wt.destructionTag ? `<p class="part-sub-tag">${escapeHtml(wt.destructionTag)}</p>` : ''}
        <h3>${escapeHtml(wt.destructionHeading || 'Bom đạn, hỏa lực & mức độ tàn phá Việt Nam phải gánh chịu')}</h3>
        ${wt.destructionLead ? `<p class="war-toll-lead">${escapeHtml(wt.destructionLead)}</p>` : ''}
        ${damageCardsHtml}
        ${wt.sourceNote ? `<p class="war-toll-source-note"><strong>Ghi chú tư liệu:</strong> ${escapeHtml(wt.sourceNote)}</p>` : ''}
      </section>
    `
    : '';

  return `<div class="war-toll-wrap">${metricsHtml}${casualtiesBlockHtml}${destructionBlockHtml}</div>`;
}

function renderForceComparison(fc) {
  if (!fc) return '';
  const metricsHtml = fc.metrics?.length
    ? `<div class="famine-metrics">${fc.metrics.map((metric) => `<div class="famine-metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('')}</div>`
    : '';
  const renderSide = (side, variantClass) =>
    side
      ? `
        <div class="context-balance-side ${variantClass}">
          <h4>${escapeHtml(side.label)}</h4>
          <ul>
            ${(side.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

  return `
    <section class="context-subblock context-balance-block" aria-label="${escapeHtml(fc.heading || 'Tương quan lực lượng hai bên')}">
      ${fc.tag ? `<p class="part-sub-tag">${escapeHtml(fc.tag)}</p>` : ''}
      <h3>${escapeHtml(fc.heading || 'Tương quan lực lượng giữa hai bên')}</h3>
      ${metricsHtml}
      <div class="context-balance-cols">
        ${renderSide(fc.ta, 'is-ta')}
        ${renderSide(fc.enemy || fc.phap, 'is-phap')}
      </div>
    </section>
  `;
}

function renderOverviewFigure(ov) {
  if (!ov?.src) return '';
  const imgMarkup = `<img src="${escapeHtml(ov.src)}" alt="${escapeHtml(ov.alt || ov.tag || '')}" width="960" height="335" />`;
  const zoomBtnAttrs = `data-zoom-src="${escapeHtml(ov.src)}" data-zoom-alt="${escapeHtml(ov.alt || '')}" data-zoom-title="${escapeHtml(ov.tag || 'Tổng quan diễn biến')}" data-zoom-caption="${escapeHtml(ov.caption || '')}"`;
  const headHtml =
    ov.tag || ov.zoomable
      ? `
        <div class="part-overview-head">
          ${ov.tag ? `<p class="part-overview-tag">${escapeHtml(ov.tag)}</p>` : '<span></span>'}
          ${ov.zoomable ? `<button type="button" class="zoom-chip-btn" ${zoomBtnAttrs} aria-label="Phóng to ảnh ${escapeHtml(ov.alt || ov.tag || 'Tổng quan')}">Phóng to ↗</button>` : ''}
        </div>
      `
      : '';
  const mediaMarkup = ov.zoomable
    ? `
      <button type="button" class="part-overview-zoom-btn" ${zoomBtnAttrs} aria-label="Phóng to ảnh: ${escapeHtml(ov.alt || ov.tag || 'Tổng quan')}">
        ${imgMarkup}
      </button>
    `
    : `<div class="part-overview-frame">${imgMarkup}</div>`;

  return `
    <figure class="part-overview-figure">
      ${headHtml}
      ${mediaMarkup}
      ${ov.caption ? `<figcaption>${escapeHtml(ov.caption)}</figcaption>` : ''}
    </figure>
  `;
}

function renderPostOutcome(po) {
  if (!po) return '';
  const sidesHtml = (po.sides || [])
    .map(
      (side) => `
        <article class="campaign-outcome-card is-${escapeHtml(side.variant || 'ta')}">
          <header class="campaign-outcome-card-head">
            <span class="campaign-outcome-code">${escapeHtml(side.code)}</span>
            ${side.role ? `<small>${escapeHtml(side.role)}</small>` : ''}
          </header>
          <dl class="campaign-outcome-rows">
            ${(side.rows || [])
              .map(
                (row) => `
                  <div class="campaign-outcome-row">
                    <dt>${escapeHtml(row.label)}</dt>
                    <dd>${escapeHtml(row.value)}</dd>
                  </div>
                `,
              )
              .join('')}
          </dl>
        </article>
      `,
    )
    .join('');

  return `
    <section class="campaign-outcome-box" aria-labelledby="campaign-outcome-heading">
      ${po.eyebrow ? `<p class="campaign-outcome-eyebrow">${escapeHtml(po.eyebrow)}</p>` : ''}
      <h3 id="campaign-outcome-heading">${escapeHtml(po.title)}</h3>
      ${po.lead ? `<p class="campaign-outcome-lead">${escapeHtml(po.lead)}</p>` : ''}
      <div class="campaign-outcome-grid">${sidesHtml}</div>
      ${po.note ? `<p class="campaign-outcome-note"><strong>→ GHI NHẬN LỊCH SỬ:</strong> ${escapeHtml(po.note)}</p>` : ''}
    </section>
  `;
}

function renderHeroesShowcase(part) {
  const heroes = part.heroes;
  if (!heroes?.items?.length) return '';
  const cardsHtml = heroes.items
    .map((hero) => {
      const headHtml = `
        <header class="hero-story-head">
          <div class="hero-story-num-wrap">
            <span class="hero-story-num">${escapeHtml(hero.number)}</span>
            <div class="hero-story-title-group">
              <span class="hero-story-badge">${escapeHtml(hero.badge)}</span>
              <h4>${escapeHtml(hero.name)}</h4>
              <p class="hero-story-life">${escapeHtml(hero.lifeSpan)} · ${escapeHtml(hero.hometown)}</p>
            </div>
          </div>
          ${hero.unit ? `<p class="hero-story-unit">${escapeHtml(hero.unit)}</p>` : ''}
        </header>
      `;
      const topHtml = hero.image
        ? `
          <div class="hero-story-top has-photo">
            <button
              type="button"
              class="hero-story-portrait-btn"
              data-zoom-src="${escapeHtml(hero.image)}"
              data-zoom-alt="${escapeHtml(hero.imageAlt || `Chân dung Anh hùng ${hero.name}`)}"
              data-zoom-title="${escapeHtml(`Anh hùng ${hero.name}`)}"
              data-zoom-caption="${escapeHtml(`${hero.badge} · ${hero.lifeSpan} · ${hero.honor || hero.unit}`)}"
              aria-label="${escapeHtml(`Phóng to chân dung Anh hùng ${hero.name}`)}"
              title="Nhấn để xem phóng to chân dung"
            >
              <img
                src="${escapeHtml(hero.image)}"
                alt="${escapeHtml(hero.imageAlt || `Chân dung Anh hùng ${hero.name}`)}"
                width="480"
                height="640"
              />
            </button>
            ${headHtml}
          </div>
        `
        : headHtml;

      return `
        <article class="hero-story-card">
          ${topHtml}
          ${hero.quote ? `<blockquote class="hero-story-quote">${escapeHtml(hero.quote)}</blockquote>` : ''}
          <p class="hero-story-text">${escapeHtml(hero.story)}</p>
          ${hero.honor ? `<footer class="hero-story-honor"><span aria-hidden="true">★</span><span>${escapeHtml(hero.honor)}</span></footer>` : ''}
        </article>
      `;
    })
    .join('');

  return `
    <div class="wrap part-heroes-showcase" aria-labelledby="${escapeHtml(part.id)}-heroes-heading">
      <header class="heroes-showcase-head">
        ${heroes.eyebrow ? `<p class="part-eyebrow">${escapeHtml(heroes.eyebrow)}</p>` : ''}
        <h3 id="${escapeHtml(part.id)}-heroes-heading">${escapeHtml(heroes.title)}</h3>
        ${heroes.subtitle ? `<p class="heroes-showcase-sub">${escapeHtml(heroes.subtitle)}</p>` : ''}
      </header>
      <div class="heroes-grid">${cardsHtml}</div>
    </div>
  `;
}

function renderMilitaryZonesShowcase(part) {
  const mz = part.militaryZones;
  if (!mz?.groups?.length) return '';

  const groupsHtml = mz.groups
    .map((group) => {
      const timelineHtml = group.timeline?.length
        ? `<div class="mz-timeline-list">${group.timeline
            .map(
              (item) => `
                <article class="mz-timeline-item">
                  <span class="mz-period-pill">${escapeHtml(item.period)}</span>
                  <div class="mz-timeline-copy">
                    <h5>${escapeHtml(item.title)}</h5>
                    <p>${escapeHtml(item.text)}</p>
                  </div>
                </article>
              `,
            )
            .join('')}</div>`
        : '';

      const effectsHtml = group.effects?.length
        ? `<div class="mz-effects-grid">${group.effects
            .map(
              (fx) => `
                <article class="mz-effect-card">
                  ${fx.code ? `<span class="meaning-code">${escapeHtml(fx.code)}</span>` : ''}
                  <h5>${escapeHtml(fx.title)}</h5>
                  <p>${escapeHtml(fx.text)}</p>
                </article>
              `,
            )
            .join('')}</div>`
        : '';

      const mergesHtml = group.merges?.length
        ? `<div class="mz-merge-rows">${group.merges
            .map(
              (mItem) => `
                <article class="mz-merge-row">
                  <div class="mz-merge-route">
                    <span class="mz-badge is-former">${escapeHtml(mItem.fromCode)}</span>
                    <span class="mz-merge-arrow" aria-hidden="true">→</span>
                    <span class="mz-badge is-target">${escapeHtml(mItem.toCode)}</span>
                  </div>
                  <div class="mz-merge-copy">
                    <h5>${escapeHtml(mItem.title)}</h5>
                    <p>${escapeHtml(mItem.detail)}</p>
                  </div>
                </article>
              `,
            )
            .join('')}</div>`
        : '';

      return `
        <article class="mz-card${group.variant === 'merge' ? ' is-merge' : ''}">
          <header class="mz-card-head">
            ${group.tag ? `<p class="part-sub-tag">${escapeHtml(group.tag)}</p>` : ''}
            <h4>${escapeHtml(group.heading)}</h4>
            ${group.lead ? `<p class="mz-card-lead">${escapeHtml(group.lead)}</p>` : ''}
          </header>
          ${timelineHtml}
          ${effectsHtml}
          ${mergesHtml}
          ${group.note ? `<p class="dossier-note mz-card-note">${escapeHtml(group.note)}</p>` : ''}
        </article>
      `;
    })
    .join('');

  const mapData = mz.map;
  const mapCardHtml = mapData?.image
    ? (() => {
        const zoomTitle = mapData.cardTitle || mz.title || 'Bản đồ các Quân khu Việt Nam';
        const zoomAlt = mapData.imageAlt || mapData.caption || zoomTitle;
        const zoomCap = mapData.caption || '';
        const zoomAttrs = `data-zoom-src="${escapeHtml(mapData.image)}" data-zoom-alt="${escapeHtml(zoomAlt)}" data-zoom-title="${escapeHtml(zoomTitle)}" data-zoom-caption="${escapeHtml(zoomCap)}"`;
        return `
          <figure class="mz-map-card">
            <div class="mz-map-head">
              <div class="mz-map-head-copy">
                ${mapData.cardTag ? `<span class="meaning-code">${escapeHtml(mapData.cardTag)}</span>` : ''}
                ${mapData.cardTitle ? `<h4>${escapeHtml(mapData.cardTitle)}</h4>` : ''}
                ${mapData.cardSubtitle ? `<p>${escapeHtml(mapData.cardSubtitle)}</p>` : ''}
              </div>
              ${mapData.zoomable ? `<button type="button" class="mz-zoom-btn" ${zoomAttrs} aria-label="Phóng to ${escapeHtml(zoomTitle)}">Phóng to ↗</button>` : ''}
            </div>
            ${
              mapData.zoomable
                ? `<button type="button" class="mz-map-frame is-zoomable" ${zoomAttrs} aria-label="Phóng to ${escapeHtml(zoomTitle)}"><img src="${escapeHtml(mapData.image)}" alt="${escapeHtml(zoomAlt)}" width="${mapData.imageWidth || 523}" height="${mapData.imageHeight || 1024}" /></button>`
                : `<div class="mz-map-frame"><img src="${escapeHtml(mapData.image)}" alt="${escapeHtml(zoomAlt)}" width="${mapData.imageWidth || 523}" height="${mapData.imageHeight || 1024}" /></div>`
            }
            <figcaption class="mz-map-cap">
              ${mapData.caption ? `<span>${escapeHtml(mapData.caption)}</span>` : ''}
              ${mapData.credit ? `<small>${escapeHtml(mapData.credit)}</small>` : ''}
            </figcaption>
          </figure>
        `;
      })()
    : '';

  const currentListHtml = mz.currentZones?.items?.length
    ? `
      <aside class="mz-current-box" aria-label="${escapeHtml(mz.currentZones.title || 'Hệ thống quân khu hiện nay')}">
        ${mz.currentZones.tag ? `<p class="part-sub-tag">${escapeHtml(mz.currentZones.tag)}</p>` : ''}
        <h4>${escapeHtml(mz.currentZones.title)}</h4>
        <ul class="mz-zone-chips">
          ${mz.currentZones.items
            .map(
              (z) => `
                <li class="mz-zone-chip${z.merged ? ' is-former' : ''}">
                  <strong>${escapeHtml(z.code)}</strong>
                  <span>${escapeHtml(z.note)}</span>
                </li>
              `,
            )
            .join('')}
        </ul>
      </aside>
    `
    : '';

  return `
    <div class="wrap part-military-zones-showcase" id="${escapeHtml(mz.id || `${part.id}-quan-khu`)}" aria-labelledby="${escapeHtml(part.id)}-mz-heading">
      <header class="heroes-showcase-head">
        ${mz.eyebrow ? `<p class="part-eyebrow">${escapeHtml(mz.eyebrow)}</p>` : ''}
        <h3 id="${escapeHtml(part.id)}-mz-heading">${escapeHtml(mz.title)}</h3>
        ${mz.subtitle ? `<p class="heroes-showcase-sub">${escapeHtml(mz.subtitle)}</p>` : ''}
      </header>
      <div class="military-zones-grid">
        <div class="mz-main-col">${groupsHtml}</div>
        <div class="mz-aside-col">${mapCardHtml}${currentListHtml}</div>
      </div>
    </div>
  `;
}

function renderMediaBlock(part) {
  const m = part.media || {};
  const partsHtml = [];

  if (part.theme !== 'white' && m.videos?.length) {
    partsHtml.push(...m.videos.map((video) => renderYoutubeCard(video)));
  }

  if (part.theme === 'white' && m.sequence?.length) {
    const first = m.sequence[0];
    const buttons = m.sequence
      .map(
        (frame, i) =>
          `<button type="button" class="daily-map-btn${i === 0 ? ' is-active' : ''}" data-day-idx="${i}" aria-pressed="${i === 0}">${escapeHtml(frame.date)}</button>`,
      )
      .join('');
    partsHtml.push(`
      <div class="diagram-stage-shell" id="${escapeHtml(part.id)}-diagram-slot">
        <div class="stage-mode-tabs" role="tablist" aria-label="Chọn kiểu minh họa Diễn biến">
          <button type="button" class="stage-tab is-active" data-stage-tab="diagram" role="tab" aria-selected="true">Bản đồ tương tác (16/8–28/8)</button>
          <button type="button" class="stage-tab" data-stage-tab="maps" role="tab" aria-selected="false">12 Lược đồ từng ngày (16/8–28/8)</button>
        </div>

        <div class="stage-panel is-active" data-stage-panel="diagram">
          ${
            m.diagram
              ? `<div class="diagram-card is-on-white"><div class="diagram-card-head"><strong>${escapeHtml(m.diagram.title)}</strong><p>${escapeHtml(m.diagram.subtitle)}</p></div>${renderDiagramSvg(m.diagram)}<p class="uprising-map-note">${UPRISING_MAP_NOTE.startsWith('Ghi chú:') ? `<strong>Ghi chú:</strong>${escapeHtml(UPRISING_MAP_NOTE.slice('Ghi chú:'.length))}` : escapeHtml(UPRISING_MAP_NOTE)}</p></div>`
              : ''
          }
        </div>

        <div class="stage-panel" data-stage-panel="maps" hidden>
          <figure class="daily-map-figure">
            <img id="daily-map-img" src="${escapeHtml(first.image)}" alt="Bản đồ diễn biến Tổng khởi nghĩa ngày ${escapeHtml(first.date)}/1945" width="1024" height="489" />
            <figcaption>
              <strong id="daily-map-date">Ngày ${escapeHtml(first.date)}/1945</strong>
              <span id="daily-map-summary">${escapeHtml(first.summary)}</span>
            </figcaption>
          </figure>
          <div class="daily-map-buttons" role="group" aria-label="Chọn mốc ngày 16/8 đến 28/8/1945">${buttons}</div>
          <p class="part-media-credit">${escapeHtml(m.sequenceCredit || '')}</p>
        </div>
      </div>
    `);
  } else if (part.theme === 'white' && m.milestoneInspector) {
    partsHtml.push(renderMilestoneInspectorShell(part));
    if (m.diagram) {
      partsHtml.push(`
        <div class="diagram-card is-on-white">
          <div class="diagram-card-head">
            <strong>${escapeHtml(m.diagram.title)}</strong>
            <p>${escapeHtml(m.diagram.subtitle)}</p>
          </div>
          ${renderDiagramSvg(m.diagram)}
        </div>
      `);
    }
  } else {
    if (m.image && part.theme === 'white') {
      const renderCampaignCard = (card) => {
        const cardTitle = card.cardTitle || part.title;
        const cardAlt = card.imageAlt || card.caption || cardTitle;
        const imgEl = `<img src="${escapeHtml(card.image)}" alt="${escapeHtml(cardAlt)}" width="${card.imageWidth || 523}" height="${card.imageHeight || 632}" />`;
        const zoomBtnAttrs = `data-zoom-src="${escapeHtml(card.image)}" data-zoom-alt="${escapeHtml(cardAlt)}" data-zoom-title="${escapeHtml(cardTitle)}" data-zoom-caption="${escapeHtml(card.caption || '')}"`;
        const frameMarkup = card.zoomable
          ? `
            <button type="button" class="campaign-map-frame is-zoomable" ${zoomBtnAttrs} aria-label="Phóng to ${escapeHtml(cardTitle || cardAlt || 'sơ đồ diễn biến')}">
              ${imgEl}
            </button>
          `
          : `<div class="campaign-map-frame">${imgEl}</div>`;

        return `
          <figure class="campaign-map-card${card.isDocument ? ' is-document' : ''}">
            ${
              card.cardTitle || card.zoomable
                ? `
                  <div class="campaign-map-head">
                    <div class="campaign-map-head-copy">
                      ${card.cardTitle ? `<strong>${escapeHtml(card.cardTitle)}</strong>` : ''}
                      ${card.cardSubtitle ? `<p>${escapeHtml(card.cardSubtitle)}</p>` : ''}
                    </div>
                    ${card.zoomable ? `<button type="button" class="zoom-chip-btn" ${zoomBtnAttrs} aria-label="Phóng to ${escapeHtml(cardTitle || 'sơ đồ diễn biến')}">Phóng to ↗</button>` : ''}
                  </div>
                `
                : ''
            }
            ${frameMarkup}
            <figcaption class="campaign-map-cap">
              <span>${escapeHtml(card.caption || '')}</span>
              ${card.credit ? `<small>${escapeHtml(card.credit)}</small>` : ''}
            </figcaption>
          </figure>
        `;
      };

      if (m.secondaryImage?.image) {
        partsHtml.push(`<div class="campaign-media-pair">${renderCampaignCard(m)}${renderCampaignCard(m.secondaryImage)}</div>`);
      } else {
        partsHtml.push(renderCampaignCard(m));
      }
    } else if (m.image) {
      const imgAlt = m.imageAlt || m.caption || part.title;
      const imgEl = `<img src="${escapeHtml(m.image)}" alt="${escapeHtml(imgAlt)}" width="${m.imageWidth || 960}" height="${m.imageHeight || 600}" />`;
      const zoomAttrs = `data-zoom-src="${escapeHtml(m.image)}" data-zoom-alt="${escapeHtml(imgAlt)}" data-zoom-title="${escapeHtml(m.cardTitle || part.title)}" data-zoom-caption="${escapeHtml(m.caption || '')}"`;
      const mediaInner = m.zoomable
        ? `
          <button type="button" class="part-photo-zoom-btn" ${zoomAttrs} aria-label="Phóng to ảnh ${escapeHtml(imgAlt)}">
            ${imgEl}
            <span class="milestone-zoom-badge">Phóng to ↗</span>
          </button>
        `
        : imgEl;
      partsHtml.push(`
        <figure class="part-photo${m.isDocument ? ' is-document' : ''}${m.contain ? ' is-contain' : ''}">
          ${mediaInner}
          <figcaption>
            <span>${escapeHtml(m.caption || '')}</span>
            ${m.credit ? `<small>${escapeHtml(m.credit)}</small>` : ''}
          </figcaption>
        </figure>
      `);
    }
    if (part.theme !== 'white' && m.gallery?.length) {
      const galleryCardsHtml = m.gallery
        .map((gItem) => {
          const gAlt = gItem.imageAlt || gItem.caption || part.title;
          const gImgEl = `<img src="${escapeHtml(gItem.image)}" alt="${escapeHtml(gAlt)}" width="${gItem.imageWidth || 800}" height="${gItem.imageHeight || 560}" />`;
          const gZoomAttrs = `data-zoom-src="${escapeHtml(gItem.image)}" data-zoom-alt="${escapeHtml(gAlt)}" data-zoom-title="${escapeHtml(gItem.cardTitle || gItem.caption || part.title)}" data-zoom-caption="${escapeHtml(gItem.caption || '')}"`;
          const gMediaInner = gItem.zoomable
            ? `
              <button type="button" class="part-photo-zoom-btn" ${gZoomAttrs} aria-label="Phóng to ảnh ${escapeHtml(gAlt)}">
                ${gImgEl}
                <span class="milestone-zoom-badge">Phóng to ↗</span>
              </button>
            `
            : gImgEl;
          return `
            <figure class="part-photo is-gallery-item${gItem.isDocument ? ' is-document' : ''}">
              ${gMediaInner}
              <figcaption>
                <span>${escapeHtml(gItem.caption || '')}</span>
                ${gItem.credit ? `<small>${escapeHtml(gItem.credit)}</small>` : ''}
              </figcaption>
            </figure>
          `;
        })
        .join('');
      const galleryClass =
        m.gallery.length >= 3 && m.gallery.length % 2 === 1 ? 'part-photo-gallery has-lead' : 'part-photo-gallery';
      partsHtml.push(`<div class="${galleryClass}" aria-label="Tư liệu ảnh bổ sung">${galleryCardsHtml}</div>`);
    }
    if (part.theme !== 'white' && m.youtube) {
      partsHtml.push(renderYoutubeCard(m.youtube));
    }
    if (m.diagram) {
      partsHtml.push(`
        <div class="diagram-card">
          <div class="diagram-card-head">
            <strong>${escapeHtml(m.diagram.title)}</strong>
            <p>${escapeHtml(m.diagram.subtitle)}</p>
          </div>
          ${renderDiagramSvg(m.diagram)}
        </div>
      `);
    }
    if (m.dossier) {
      partsHtml.push(renderDossierProfile(m.dossier));
    }
  }

  if (part.theme === 'white' && m.youtube) {
    partsHtml.push(renderYoutubeCard(m.youtube));
  }
  if (part.theme === 'white' && m.videos?.length) {
    partsHtml.push(...m.videos.map((video) => renderYoutubeCard(video)));
  }

  return partsHtml.join('');
}

function renderDossierProfile(dossier) {
  if (!dossier) return '';
  const factsHtml = dossier.facts?.length
    ? `<dl class="dossier-facts-grid">${dossier.facts
        .map(
          (fact) => `
            <div class="dossier-fact-item">
              <dt>${escapeHtml(fact.label)}</dt>
              <dd>${escapeHtml(fact.value)}</dd>
            </div>
          `,
        )
        .join('')}</dl>`
    : '';
  const stagesHtml = dossier.stages?.length
    ? `<div class="dossier-stages-grid">${dossier.stages
        .map(
          (st) => `
            <article class="dossier-stage-card">
              ${st.period ? `<span class="dossier-stage-period">${escapeHtml(st.period)}</span>` : ''}
              <h5>${escapeHtml(st.title)}</h5>
              <ul class="dossier-stage-list">
                ${(st.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </article>
          `,
        )
        .join('')}</div>`
    : '';
  const headTextHtml = `
    <div class="dossier-head-copy">
      ${dossier.eyebrow ? `<p class="dossier-eyebrow">${escapeHtml(dossier.eyebrow)}</p>` : ''}
      <h4>${escapeHtml(dossier.title)}</h4>
      ${dossier.subtitle ? `<p class="dossier-subtitle">${escapeHtml(dossier.subtitle)}</p>` : ''}
    </div>
  `;
  const headHtml = dossier.image
    ? `
      <header class="dossier-profile-head has-photo">
        <div class="dossier-portrait-col">
          <button
            type="button"
            class="dossier-portrait-btn"
            data-zoom-src="${escapeHtml(dossier.image)}"
            data-zoom-alt="${escapeHtml(dossier.imageAlt || `Chân dung ${dossier.title || 'nhân vật lịch sử'}`)}"
            data-zoom-title="${escapeHtml(dossier.title || 'Ảnh chân dung nhân vật lịch sử')}"
            data-zoom-caption="${escapeHtml(dossier.imageCaption || dossier.imageAlt || dossier.title || '')}"
            aria-label="${escapeHtml(`Phóng to ${dossier.imageAlt || dossier.title || 'ảnh chân dung'}`)}"
            title="Nhấn để phóng to ảnh"
          >
            <img
              src="${escapeHtml(dossier.image)}"
              alt="${escapeHtml(dossier.imageAlt || dossier.title || '')}"
              width="${dossier.imageWidth || 405}"
              height="${dossier.imageHeight || 540}"
            />
            <span class="dossier-portrait-zoom">Phóng to ↗</span>
          </button>
        </div>
        ${headTextHtml}
      </header>
    `
    : `<header class="dossier-profile-head">${headTextHtml}</header>`;
  return `
    <section class="dossier-profile-box" aria-label="${escapeHtml(dossier.title || 'Thông tin nhân vật lịch sử')}">
      ${headHtml}
      ${factsHtml}
      ${stagesHtml}
      ${dossier.note ? `<p class="dossier-note">${escapeHtml(dossier.note)}</p>` : ''}
    </section>
  `;
}

function formatColonBulletHtml(text) {
  const str = String(text || '');
  const idx = str.indexOf(': ');
  if (idx > 0 && idx < 72) {
    return `<strong>${escapeHtml(str.slice(0, idx + 1))}</strong>${escapeHtml(str.slice(idx + 1))}`;
  }
  return escapeHtml(str);
}

function renderGroupExplainer(explainer) {
  if (!explainer) return '';
  const metricsHtml = explainer.metrics?.length
    ? `<div class="famine-metrics">${explainer.metrics
        .map((metric) => `<div class="famine-metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`)
        .join('')}</div>`
    : '';
  const colsHtml = explainer.cols?.length
    ? `<div class="group-explainer-cols">${explainer.cols
        .map((col) => {
          const cardClass = col.variant === 'danger' ? ' is-danger' : '';
          const itemsHtml = (col.items || [])
            .map((item) => `<li>${formatColonBulletHtml(item)}</li>`)
            .join('');
          return `
            <article class="group-explainer-card${cardClass}">
              ${col.tag ? `<span class="group-explainer-card-tag">${escapeHtml(col.tag)}</span>` : ''}
              <h5>${escapeHtml(col.title)}</h5>
              <ul class="group-explainer-list">${itemsHtml}</ul>
            </article>
          `;
        })
        .join('')}</div>`
    : '';
  return `
    <section class="group-explainer-box" aria-label="${escapeHtml(explainer.title || 'Chuyên đề giải thích')}">
      <header class="group-explainer-head">
        ${explainer.eyebrow ? `<p class="part-sub-tag">${escapeHtml(explainer.eyebrow)}</p>` : ''}
        <h4>${escapeHtml(explainer.title)}</h4>
        ${explainer.lead ? `<p class="group-explainer-lead">${escapeHtml(explainer.lead)}</p>` : ''}
      </header>
      ${metricsHtml}
      ${colsHtml}
      ${explainer.note ? `<p class="group-explainer-note">${formatColonBulletHtml(explainer.note)}</p>` : ''}
    </section>
  `;
}

function renderCreatorLetter(letter) {
  if (!letter) return '';
  const paragraphsHtml = (letter.paragraphs || [])
    .map((pText, idx) => `<p${idx === 0 ? ' class="is-lead-para"' : ''}>${escapeHtml(pText)}</p>`)
    .join('');
  const actionsHtml = letter.actions?.length
    ? `<div class="creator-letter-actions">${letter.actions
        .map(
          (act) =>
            `<a href="${escapeHtml(act.href)}" class="button ${act.variant === 'primary' ? 'primary' : 'secondary'}">${escapeHtml(act.label)}</a>`,
        )
        .join('')}</div>`
    : '';
  return `
    <article class="creator-letter-box" aria-label="${escapeHtml(letter.eyebrow || 'Lời ngỏ cảm ơn từ nhóm thực hiện')}">
      ${letter.eyebrow ? `<p class="creator-letter-eyebrow">${escapeHtml(letter.eyebrow)}</p>` : ''}
      ${letter.salutation ? `<p class="creator-letter-salutation">${escapeHtml(letter.salutation)}</p>` : ''}
      <div class="creator-letter-body">${paragraphsHtml}</div>
      ${
        letter.pledge
          ? `
            <blockquote class="creator-letter-pledge">
              ${letter.pledgeLabel ? `<strong>${escapeHtml(letter.pledgeLabel)}</strong>` : ''}
              <p>${escapeHtml(letter.pledge)}</p>
            </blockquote>
          `
          : ''
      }
      <footer class="creator-letter-foot">
        <div class="creator-letter-sign">
          ${letter.signature ? `<em>${escapeHtml(letter.signature)}</em>` : ''}
          ${letter.team ? `<strong>${escapeHtml(letter.team)}</strong>` : ''}
        </div>
        ${actionsHtml}
      </footer>
    </article>
  `;
}

function renderPartBody(part) {
  if (part.contentSections?.length) {
    const sectionsHtml = part.contentSections
      .map((sec) => {
        const colsClass = sec.cards?.length === 3 ? ' cols-3' : ' cols-2';
        const cardsHtml = sec.cards?.length
          ? `<div class="content-cards-grid${colsClass}">${sec.cards
              .map(
                (card) => `
                  <article class="content-detail-card">
                    ${card.code ? `<span class="meaning-code">${escapeHtml(card.code)}</span>` : ''}
                    <h4>${escapeHtml(card.title)}</h4>
                    <p>${escapeHtml(card.text)}</p>
                  </article>
                `,
              )
              .join('')}</div>`
          : '';
        const docsHtml = sec.documents?.length
          ? `
            <div class="milestone-doc-tray content-section-docs">
              <p class="milestone-extra-kicker">${escapeHtml(sec.documentsHeading || 'VĂN KIỆN & ĐIẾU VĂN LỊCH SỬ · BẤM ĐỂ MỞ POP-UP')}</p>
              <div class="milestone-doc-buttons">
                ${sec.documents
                  .map(
                    (doc, idx) => `
                      <button type="button" class="milestone-doc-btn" data-doc-open="${escapeHtml(doc.id)}">
                        <span class="milestone-doc-num">${String(idx + 1).padStart(2, '0')}</span>
                        <span class="milestone-doc-label">${escapeHtml(doc.buttonLabel || doc.title)}</span>
                        <span class="milestone-doc-arrow" aria-hidden="true">Đọc ↗</span>
                      </button>
                    `,
                  )
                  .join('')}
              </div>
            </div>
          `
          : '';
        const videoHtml =
          sec.youtube && (sec.youtube.embedUrl || sec.youtube.youtubeId)
            ? `<div class="content-section-video">${renderYoutubeCard(sec.youtube)}</div>`
            : '';
        const extrasHtml =
          docsHtml || videoHtml
            ? `<div class="content-section-extras${docsHtml && videoHtml ? ' has-both' : ''}">${videoHtml}${docsHtml}</div>`
            : '';
        return `
          <section id="${escapeHtml(sec.id)}" class="content-section-block" aria-labelledby="${escapeHtml(sec.id)}-heading">
            <header class="content-section-head">
              ${sec.code ? `<p class="part-sub-tag">${escapeHtml(sec.code)}</p>` : ''}
              <h3 id="${escapeHtml(sec.id)}-heading">${escapeHtml(sec.heading)}</h3>
              ${sec.lead ? `<p class="content-section-lead">${escapeHtml(sec.lead)}</p>` : ''}
            </header>
            ${cardsHtml}
            ${renderCreatorLetter(sec.letter)}
            ${renderDossierProfile(sec.dossier)}
            ${extrasHtml}
            ${sec.note ? `<div class="part-conclusion is-on-meaning"><strong>→ GHI NHẬN LỊCH SỬ</strong><p>${escapeHtml(sec.note)}</p></div>` : ''}
          </section>
        `;
      })
      .join('');
    return `<div class="content-sections-stack">${sectionsHtml}</div>`;
  }

  if (part.groups?.length || part.warToll) {
    const groupsHtml = (part.groups || [])
      .map((group) => {
        const metricsHtml = group.metrics?.length
          ? `<div class="famine-metrics">${group.metrics.map((metric) => `<div class="famine-metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('')}</div>`
          : '';
        const variantClass = group.variant === 'famine' || group.variant === 'critical' ? ` is-${group.variant}` : '';
        const explainerHtml = renderGroupExplainer(group.explainer);
        return `
          <div class="context-subblock${variantClass}">
            <p class="part-sub-tag">${escapeHtml(group.tag)}</p>
            <h3>${escapeHtml(group.heading)}</h3>
            ${metricsHtml}
            <ul class="part-bullet-list">
              ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
            ${explainerHtml}
          </div>
        `;
      })
      .join('');
    const forceHtml = renderForceComparison(part.forceComparison);
    const warTollHtml = renderWarTollSection(part.warToll);
    const conclusionHtml = part.conclusion
      ? `<div class="part-conclusion"><strong>→ ${escapeHtml(part.conclusion.label)}</strong><p>${escapeHtml(part.conclusion.text)}</p></div>`
      : '';
    return `<div class="context-groups">${groupsHtml}${forceHtml}${warTollHtml}</div>${conclusionHtml}`;
  }

  if (part.stages?.length) {
    let msCounter = 0;
    const stagesWithRanges = part.stages.map((st, idx) => {
      const startIdx = msCounter;
      const events = (st.events || []).map((ev) => ({ ...ev, msIdx: msCounter++ }));
      return { ...st, idx, startIdx, events };
    });

    const overviewHtml = renderOverviewFigure(part.overviewImage);
    const colsClass = stagesWithRanges.length === 3 ? ' is-3-cols' : '';
    const jumpBarHtml = `
      <nav class="stage-jump-bar${colsClass}" aria-label="Nhảy nhanh tới từng chặng diễn biến">
        ${stagesWithRanges
          .map(
            (st) => `
              <button type="button" class="stage-jump-btn${st.idx === 0 ? ' is-active' : ''}" data-stage-jump="${st.idx}" data-first-ms="${st.startIdx}" data-target-id="${escapeHtml(st.id)}">
                <span>${escapeHtml(st.code)}</span>
                <small>${escapeHtml(st.period)}</small>
              </button>
            `,
          )
          .join('')}
      </nav>
    `;

    const selectable = Boolean(part.media?.milestoneInspector);
    const stagesHtml = stagesWithRanges
      .map(
        (st) => `
          <section id="${escapeHtml(st.id)}" class="timeline-stage-card${st.idx === 0 ? ' is-focused' : ''}" data-stage-card="${st.idx}" aria-labelledby="${escapeHtml(st.id)}-title">
            <header class="stage-card-head">
              <div class="stage-card-meta">
                <span class="stage-card-code">${escapeHtml(st.code)}</span>
                <span class="stage-card-period">${escapeHtml(st.period)}</span>
              </div>
              <h3 id="${escapeHtml(st.id)}-title">${escapeHtml(st.title)}</h3>
              ${st.summary ? `<p class="stage-card-summary">${escapeHtml(st.summary)}</p>` : ''}
            </header>
            <ol class="part-timeline is-compact">
              ${st.events
                .map((step) => {
                  const isInit = selectable && step.msIdx === 0;
                  const inner = `
                    <span class="part-step-top">
                      <span class="part-step-date">${escapeHtml(step.date)}</span>
                      ${selectable ? `<span class="part-step-cue">${escapeHtml(getMilestoneCueLabel(step, isInit))}</span>` : ''}
                    </span>
                    <div class="part-step-body">
                      <h4>${escapeHtml(step.title)}</h4>
                      <p>${escapeHtml(step.detail)}</p>
                    </div>
                  `;
                  if (selectable) {
                    return `
                      <li class="part-step is-selectable${step.highlight ? ' is-highlight' : ''}${isInit ? ' is-selected' : ''}" data-milestone-idx="${step.msIdx}">
                        <button type="button" class="part-step-trigger" data-milestone-trigger="${step.msIdx}" aria-pressed="${isInit}">${inner}</button>
                      </li>
                    `;
                  }
                  return `<li class="part-step${step.highlight ? ' is-highlight' : ''}">${inner}</li>`;
                })
                .join('')}
            </ol>
            ${st.outcome ? `<div class="stage-outcome"><strong>→ Ý NGHĨA CHẶNG</strong><p>${escapeHtml(st.outcome)}</p></div>` : ''}
          </section>
        `,
      )
      .join('');

    const outcomeHtml = renderPostOutcome(part.postOutcome);
    return `${overviewHtml}${jumpBarHtml}<div class="timeline-stages">${stagesHtml}</div>${outcomeHtml}`;
  }

  if (part.timeline?.length) {
    return `
      <ol class="part-timeline">
        ${part.timeline
          .map(
            (step) => `
              <li class="part-step${step.highlight ? ' is-highlight' : ''}">
                <span class="part-step-date">${escapeHtml(step.date)}</span>
                <div class="part-step-body">
                  <h3>${escapeHtml(step.title)}</h3>
                  <p>${escapeHtml(step.detail)}</p>
                </div>
              </li>
            `,
          )
          .join('')}
      </ol>
    `;
  }

  if (part.pillars?.length) {
    return `
      <div class="meaning-pillars">
        ${part.pillars
          .map(
            (pillar) => `
              <article class="meaning-card">
                <span class="meaning-code">${escapeHtml(pillar.code)}</span>
                <h3>${escapeHtml(pillar.title)}</h3>
                <p>${escapeHtml(pillar.text)}</p>
              </article>
            `,
          )
          .join('')}
      </div>
    `;
  }

  return '';
}

function buildQuizPartGroups(questions) {
  const groups = [];
  const byPartId = new Map();
  questions.forEach((q, idx) => {
    const key = q.partId || q.theme || `part-${idx}`;
    if (!byPartId.has(key)) {
      const group = {
        partId: key,
        partLabel: q.partLabel || 'ÔN TẬP KIẾN THỨC',
        theme: q.theme || 'archive',
        indices: [],
      };
      byPartId.set(key, group);
      groups.push(group);
    }
    byPartId.get(key).indices.push(idx);
  });
  return groups;
}

function formatQuestionRange(indices) {
  if (!indices.length) return '';
  const first = indices[0] + 1;
  const last = indices[indices.length - 1] + 1;
  return first === last ? `Câu ${first}` : `Câu ${first}–${last}`;
}

function renderQuizCallout(chapter, quiz) {
  if (!quiz?.questions?.length) return '';
  const groups = buildQuizPartGroups(quiz.questions);
  const legendHtml = groups
    .map(
      (g) => `
        <span class="quiz-legend-pill theme-${escapeHtml(g.theme)}">
          <i class="quiz-legend-swatch" aria-hidden="true"></i>
          <span><strong>${escapeHtml(formatQuestionRange(g.indices))}</strong> · ${escapeHtml(g.partLabel)}</span>
        </span>
      `,
    )
    .join('');

  return `
    <section class="quiz-callout" aria-labelledby="quiz-callout-heading">
      <div class="quiz-callout-copy">
        <p class="quiz-callout-eyebrow"><span class="red-line"></span> ÔN TẬP KIẾN THỨC · ${escapeHtml(String(quiz.questions.length))} CÂU TRẮC NGHIỆM</p>
        <h2 id="quiz-callout-heading">${escapeHtml(quiz.title)}</h2>
        <p class="quiz-callout-sub">${escapeHtml(quiz.subtitle)}</p>
        <div class="quiz-callout-legend" aria-label="Phân bố câu hỏi theo màu các phần">${legendHtml}</div>
      </div>
      <div class="quiz-callout-action">
        <button type="button" id="open-chapter-quiz" class="button primary quiz-launch-btn">Làm ${escapeHtml(String(quiz.questions.length))} câu trắc nghiệm <span aria-hidden="true">↗</span></button>
        <p id="quiz-callout-status" class="quiz-callout-status" aria-live="polite">Gồm ${escapeHtml(String(quiz.questions.length))} câu · Bố cục pop-up đổi màu theo từng phần của ${escapeHtml(chapter.shortLabel)}</p>
      </div>
    </section>
  `;
}

function initChapterQuiz(chapter, quiz) {
  const triggerBtn = $('#open-chapter-quiz', main);
  const statusEl = $('#quiz-callout-status', main);
  if (!triggerBtn || !quiz?.questions?.length) return;

  const oldDialog = document.getElementById('chapter-quiz-dialog');
  if (oldDialog) oldDialog.remove();

  const dialog = document.createElement('dialog');
  dialog.id = 'chapter-quiz-dialog';
  dialog.className = 'quiz-dialog';
  dialog.setAttribute('aria-labelledby', 'quiz-dialog-title');
  document.body.appendChild(dialog);

  const questions = quiz.questions;
  const total = questions.length;
  const partGroups = buildQuizPartGroups(questions);
  const letters = ['A', 'B', 'C', 'D'];
  const summaryTheme = chapter.detail?.layout === 'three-parts' || chapter.detail?.layout === 'section-bands' ? 'context' : 'archive';

  const state = {
    currentIdx: 0,
    answers: Array(total).fill(null),
    mode: 'question',
  };

  const countStats = () => {
    let answered = 0;
    let correct = 0;
    state.answers.forEach((choice, idx) => {
      if (choice !== null) {
        answered += 1;
        if (choice === questions[idx].answer) correct += 1;
      }
    });
    return { answered, correct };
  };

  const syncCallout = () => {
    const { answered, correct } = countStats();
    if (answered === 0) {
      triggerBtn.innerHTML = `Làm ${total} câu trắc nghiệm <span aria-hidden="true">↗</span>`;
      if (statusEl) {
        statusEl.textContent = `Gồm ${total} câu · Bố cục pop-up đổi màu theo từng phần của ${chapter.shortLabel}`;
      }
    } else if (answered < total) {
      triggerBtn.innerHTML = `Tiếp tục ôn tập (${answered}/${total}) <span aria-hidden="true">↗</span>`;
      if (statusEl) {
        statusEl.textContent = `Đã làm ${answered}/${total} câu · Đúng ${correct} câu`;
      }
    } else {
      const pct = Math.round((correct / total) * 100);
      triggerBtn.innerHTML = `Xem kết quả &amp; làm lại (${correct}/${total}) <span aria-hidden="true">↗</span>`;
      if (statusEl) {
        statusEl.textContent = `Hoàn thành ${total}/${total} câu · Điểm: ${correct}/${total} (${pct}%)`;
      }
    }
  };

  const renderStepsBar = () => {
    const pills = questions
      .map((item, idx) => {
        const picked = state.answers[idx];
        const isCurrent = state.mode === 'question' && state.currentIdx === idx;
        const classes = ['quiz-step-btn', `step-theme-${item.theme}`];
        if (item.variant === 'famine' || item.variant === 'critical') classes.push('is-famine');
        if (isCurrent) classes.push('is-current');
        if (picked !== null) {
          classes.push(picked === item.answer ? 'is-correct' : 'is-wrong');
        }
        const statusDesc =
          picked === null ? 'chưa trả lời' : picked === item.answer ? 'đúng' : 'chưa đúng';
        return `
          <button type="button" class="${classes.join(' ')}" data-quiz-step="${idx}" aria-label="Câu ${idx + 1}: ${escapeHtml(item.partLabel)} (${statusDesc})"${isCurrent ? ' aria-current="step"' : ''}>
            <span class="quiz-step-num">${String(idx + 1).padStart(2, '0')}</span>
            <i class="quiz-step-dot" aria-hidden="true"></i>
          </button>
        `;
      })
      .join('');
    return `<nav class="quiz-steps" aria-label="Chọn nhanh 10 câu hỏi ôn tập">${pills}</nav>`;
  };

  const renderDialog = () => {
    const { answered, correct } = countStats();
    const isSummary = state.mode === 'summary';
    const q = questions[state.currentIdx];
    const picked = state.answers[state.currentIdx];
    const shellTheme = isSummary ? summaryTheme : q.theme;
    const famineClass = !isSummary && (q.variant === 'famine' || q.variant === 'critical') ? ' is-famine' : '';
    const summaryClass = isSummary ? ' is-summary' : '';

    let bodyHtml = '';
    let footerHtml = '';

    if (isSummary) {
      const pct = Math.round((correct / total) * 100);
      let rating = 'Cần ôn lại thêm các mốc chính trong chương';
      if (correct >= 9) rating = 'Xuất sắc — Nắm chắc toàn bộ tiến trình chương';
      else if (correct >= 7) rating = 'Tốt — Vững các sự kiện và ý nghĩa lịch sử';
      else if (correct >= 5) rating = 'Khá — Nên đối chiếu lại phần giải thích từng câu';

      const breakdownHtml = partGroups
        .map((g) => {
          const partCorrect = g.indices.filter((i) => state.answers[i] === questions[i].answer).length;
          return `
            <div class="quiz-part-score theme-${escapeHtml(g.theme)}">
              <span class="quiz-part-score-range">${escapeHtml(formatQuestionRange(g.indices))}</span>
              <strong>${escapeHtml(g.partLabel)}</strong>
              <span class="quiz-part-score-val">${partCorrect} / ${g.indices.length} đúng</span>
            </div>
          `;
        })
        .join('');

      bodyHtml = `
        <div class="quiz-summary">
          <div class="quiz-summary-hero">
            <div class="quiz-score-badge">
              <strong>${correct}<span>/${total}</span></strong>
              <small>${pct}% chính xác</small>
            </div>
            <div class="quiz-summary-copy">
              <p class="quiz-summary-kicker">TỔNG KẾT ÔN TẬP · ${escapeHtml(chapter.shortLabel.toUpperCase())}</p>
              <h3>${escapeHtml(rating)}</h3>
              <p>Đã hoàn thành ${answered}/${total} câu hỏi trắc nghiệm. Bấm từng câu bên trên hoặc nút “Xem lại từng câu” để đối chiếu lời giải chi tiết.</p>
            </div>
          </div>
          <div class="quiz-part-breakdown">${breakdownHtml}</div>
        </div>
      `;

      footerHtml = `
        <button type="button" class="quiz-btn quiz-btn-ghost" data-quiz-action="review">← Xem lại từng câu</button>
        <div class="quiz-footer-right">
          <button type="button" class="quiz-btn quiz-btn-ghost" data-quiz-action="retry">↺ Làm lại 10 câu</button>
          <button type="button" class="quiz-btn quiz-btn-primary" data-quiz-action="close">Đóng bảng ôn tập</button>
        </div>
      `;
    } else {
      const optionsHtml = q.options
        .map((opt, optIdx) => {
          const isPicked = picked === optIdx;
          const isRightAnswer = optIdx === q.answer;
          const optClasses = ['quiz-option'];
          let markerHtml = '';

          if (picked !== null) {
            if (isRightAnswer) {
              optClasses.push('is-correct');
              markerHtml = `<span class="quiz-opt-state">${isPicked ? '✓ Đúng' : '✓ Đáp án đúng'}</span>`;
            } else if (isPicked) {
              optClasses.push('is-wrong');
              markerHtml = '<span class="quiz-opt-state">✕ Chưa đúng</span>';
            }
          }

          return `
            <button type="button" class="${optClasses.join(' ')}" data-quiz-option="${optIdx}"${picked !== null ? ' disabled' : ''}>
              <span class="quiz-opt-key">${letters[optIdx] || optIdx + 1}</span>
              <span class="quiz-opt-text">${escapeHtml(opt)}</span>
              ${markerHtml}
            </button>
          `;
        })
        .join('');

      const explainHtml =
        picked !== null
          ? `
            <div class="quiz-explain" role="status">
              <strong>${picked === q.answer ? '✓ Chính xác' : `✕ Đáp án đúng là ${letters[q.answer]}`}</strong>
              <p>${escapeHtml(q.explanation)}</p>
            </div>
          `
          : '';

      bodyHtml = `
        <div class="quiz-question-card">
          <div class="quiz-q-meta">
            <span class="quiz-part-pill">${escapeHtml(q.partLabel)}</span>
            <span class="quiz-q-counter">Câu ${String(state.currentIdx + 1).padStart(2, '0')} / ${total} · Đúng ${correct}/${answered}</span>
          </div>
          <h3 class="quiz-question-text">${escapeHtml(q.question)}</h3>
          <div class="quiz-options" role="group" aria-label="Các phương án trả lời">${optionsHtml}</div>
          ${explainHtml}
        </div>
      `;

      const canPrev = state.currentIdx > 0;
      const isLast = state.currentIdx === total - 1;
      const summaryShortcut =
        answered === total
          ? '<button type="button" class="quiz-btn quiz-btn-secondary" data-quiz-action="summary">Xem kết quả</button>'
          : '';

      footerHtml = `
        <button type="button" class="quiz-btn quiz-btn-ghost" data-quiz-action="prev"${canPrev ? '' : ' disabled'}>← Câu trước</button>
        <div class="quiz-footer-right">
          ${summaryShortcut}
          <button type="button" class="quiz-btn quiz-btn-primary" data-quiz-action="${isLast ? 'summary' : 'next'}">
            ${isLast ? 'Tổng kết điểm ↗' : 'Câu tiếp →'}
          </button>
        </div>
      `;
    }

    dialog.innerHTML = `
      <div class="quiz-shell theme-${escapeHtml(shellTheme)}${famineClass}${summaryClass}">
        <header class="quiz-head">
          <div class="quiz-head-copy">
            <p class="quiz-eyebrow">${escapeHtml(chapter.shortLabel.toUpperCase())} · ÔN TẬP ${total} CÂU TRẮC NGHIỆM</p>
            <h2 id="quiz-dialog-title">${escapeHtml(quiz.title)}</h2>
          </div>
          <button type="button" class="quiz-close-btn" data-quiz-action="close" aria-label="Đóng pop-up ôn tập">✕</button>
        </header>
        ${renderStepsBar()}
        <div class="quiz-body">${bodyHtml}</div>
        <footer class="quiz-footer">${footerHtml}</footer>
      </div>
    `;

    syncCallout();
  };

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      return;
    }

    const optBtn = e.target.closest?.('[data-quiz-option]');
    if (optBtn) {
      const optIdx = Number(optBtn.getAttribute('data-quiz-option'));
      if (state.answers[state.currentIdx] === null && Number.isInteger(optIdx)) {
        state.answers[state.currentIdx] = optIdx;
        renderDialog();
      }
      return;
    }

    const stepBtn = e.target.closest?.('[data-quiz-step]');
    if (stepBtn) {
      const stepIdx = Number(stepBtn.getAttribute('data-quiz-step'));
      if (Number.isInteger(stepIdx) && stepIdx >= 0 && stepIdx < total) {
        state.mode = 'question';
        state.currentIdx = stepIdx;
        renderDialog();
      }
      return;
    }

    const actionBtn = e.target.closest?.('[data-quiz-action]');
    if (actionBtn) {
      const action = actionBtn.getAttribute('data-quiz-action');
      if (action === 'close') {
        dialog.close();
      } else if (action === 'prev' && state.currentIdx > 0) {
        state.mode = 'question';
        state.currentIdx -= 1;
        renderDialog();
      } else if (action === 'next' && state.currentIdx < total - 1) {
        state.mode = 'question';
        state.currentIdx += 1;
        renderDialog();
      } else if (action === 'summary') {
        state.mode = 'summary';
        renderDialog();
      } else if (action === 'review') {
        state.mode = 'question';
        state.currentIdx = 0;
        renderDialog();
      } else if (action === 'retry') {
        state.answers = Array(total).fill(null);
        state.currentIdx = 0;
        state.mode = 'question';
        renderDialog();
      }
    }
  });

  dialog.addEventListener('close', () => {
    syncCallout();
    triggerBtn.focus({ preventScroll: true });
  });

  triggerBtn.addEventListener('click', () => {
    const firstUnanswered = state.answers.findIndex((a) => a === null);
    if (state.mode === 'summary' && firstUnanswered === -1) {
      state.mode = 'summary';
    } else {
      state.mode = 'question';
      if (firstUnanswered >= 0 && state.answers[state.currentIdx] !== null) {
        state.currentIdx = firstUnanswered;
      }
    }
    renderDialog();
    dialog.showModal();
  });

  syncCallout();
}

function renderChapterFooterNav(idx) {
  const prevChapter = idx > 0 ? introChapters[idx - 1] : null;
  const prevAvailable =
    prevChapter && prevChapter.available && prevChapter.href
      ? prevChapter
      : introChapters
          .slice(0, idx)
          .reverse()
          .find((item) => item.available && item.href) || null;
  const nextChapter = idx + 1 < introChapters.length ? introChapters[idx + 1] : null;
  const prevHtml = prevAvailable
    ? `<a href="${escapeHtml(prevAvailable.href)}" class="text-button"><span aria-hidden="true">←</span> ${escapeHtml(prevAvailable.shortLabel)} · ${escapeHtml(prevAvailable.label)}</a>`
    : '';
  const nextHtml = nextChapter
    ? nextChapter.available && nextChapter.href
      ? `<a href="${escapeHtml(nextChapter.href)}" class="text-button">${escapeHtml(nextChapter.shortLabel)} · ${escapeHtml(nextChapter.label)} <span aria-hidden="true">→</span></a>`
      : `<span class="chapter-next-locked"><strong>${escapeHtml(nextChapter.shortLabel)} · ${escapeHtml(nextChapter.label)}</strong><small>Coming soon</small></span>`
    : '';
  return `
    <div class="chapter-bottom">
      <div class="chapter-bottom-left">
        <a href="/danh-sach-chuong.html" class="text-button"><span aria-hidden="true">←</span> Danh sách 12 chương</a>
        ${prevHtml}
      </div>
      <div>${nextHtml}</div>
    </div>
  `;
}

if (!chapter) {
  document.title = 'Không tìm thấy chương — Dấu ấn hòa bình';
  main.innerHTML = `
    <div class="wrap chapter-single-wrap">
      <nav class="chapter-breadcrumb" aria-label="Đường dẫn trang">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/danh-sach-chuong.html">12 chương chuyên đề</a>
      </nav>
      <section class="chapter-coming-soon">
        <p class="eyebrow"><span class="red-line"></span> KHÔNG TÌM THẤY CHƯƠNG</p>
        <h1>Chương yêu cầu không tồn tại.</h1>
        <p>Hệ thống hiện có 12 chương chuyên đề tương ứng với tiến trình lịch sử Việt Nam từ 1945 đến 1975.</p>
        <div class="hero-actions">
          <a class="button primary" href="/danh-sach-chuong.html"><span aria-hidden="true">←</span> Quay lại 12 chương</a>
          <a class="button secondary" href="/">Về trang chủ</a>
        </div>
      </section>
    </div>
  `;
} else if (!chapter.available || !chapter.detail) {
  const latestAvailable = [...introChapters].reverse().find((item) => item.available && item.href);
  document.title = `${chapter.shortLabel} (Coming soon) — Dấu ấn hòa bình`;
  main.innerHTML = `
    <div class="wrap chapter-single-wrap">
      <nav class="chapter-breadcrumb" aria-label="Đường dẫn trang">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/danh-sach-chuong.html">12 chương chuyên đề</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHtml(chapter.shortLabel)}</span>
      </nav>
      <section class="chapter-coming-soon">
        <p class="eyebrow"><span class="red-line"></span> ${escapeHtml(chapter.shortLabel.toUpperCase())} · ${escapeHtml(chapter.period.toUpperCase())} · COMING SOON</p>
        <h1>${escapeHtml(chapter.label)}</h1>
        <p>Nội dung hồ sơ chi tiết của ${escapeHtml(chapter.shortLabel)} đang được biên tập, đối chiếu tư liệu và sẽ được mở khóa trong thời gian tới.</p>
        <div class="hero-actions">
          <a class="button primary" href="${escapeHtml(latestAvailable?.href || '/chuong.html?c=1')}">Đọc ${escapeHtml(latestAvailable?.shortLabel || 'Chương 1')} ngay <span aria-hidden="true">↗</span></a>
          <a class="button secondary" href="/danh-sach-chuong.html"><span aria-hidden="true">←</span> Quay lại 12 chương</a>
        </div>
      </section>
    </div>
  `;
} else if (chapter.detail.layout === 'three-parts' || chapter.detail.layout === 'section-bands') {
  const d = chapter.detail;
  document.title = `${chapter.shortLabel}: ${chapter.label} — Dấu ấn hòa bình`;

  const statsHtml = d.stats?.length
    ? `<div class="chapter-stats" aria-label="Các mốc chính">${d.stats.map((stat) => `<div class="chapter-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join('')}</div>`
    : '';

  const partsBandsHtml = d.parts
    .map((part) => {
      const mediaHtml = renderMediaBlock(part);
      const hasMedia = Boolean(mediaHtml);
      const mediaClasses = ['part-band-media'];
      if (part.media?.milestoneInspector) mediaClasses.push('has-milestone-panel');
      if (part.media?.gallery?.length) mediaClasses.push('has-media-gallery');
      if (part.theme === 'context' && !part.media?.videos?.length && !part.media?.youtube) {
        mediaClasses.push('is-sticky-context');
      }
      if (
        part.theme === 'white' &&
        !part.media?.sequence?.length &&
        !part.media?.milestoneInspector &&
        part.media?.image &&
        part.media?.youtube
      ) {
        mediaClasses.push('has-campaign-media');
      }
      const mediaAsideHtml = hasMedia
        ? `<aside class="${mediaClasses.join(' ')}" aria-label="Minh họa ${escapeHtml(part.navLabel)}">${mediaHtml}</aside>`
        : '';
      return `
        <section id="${escapeHtml(part.id)}" class="part-band theme-${escapeHtml(part.theme)}" aria-labelledby="${escapeHtml(part.id)}-heading">
          <div class="wrap part-band-grid${hasMedia ? '' : ' is-content-only'}">
            <div class="part-band-copy">
              <p class="part-eyebrow">${escapeHtml(part.eyebrow)}</p>
              <h2 id="${escapeHtml(part.id)}-heading">${escapeHtml(part.title)}</h2>
              <p class="part-lead">${escapeHtml(part.lead)}</p>
              ${renderPartBody(part)}
            </div>
            ${mediaAsideHtml}
          </div>
          ${renderHeroesShowcase(part)}
          ${renderMilitaryZonesShowcase(part)}
        </section>
      `;
    })
    .join('');

  const refListHtml = (d.sources || [])
    .filter((k) => sources[k])
    .map((key, idx) => {
      const src = sources[key];
      return `<a href="${escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer"><span>${String(idx + 1).padStart(2, '0')}. ${escapeHtml(src.title)}</span><small>${escapeHtml(src.name)} · ${escapeHtml(src.period)} ↗</small></a>`;
    })
    .join('');

  main.innerHTML = `
    <div class="wrap chapter-top-wrap">
      <nav class="chapter-breadcrumb" aria-label="Đường dẫn trang">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/danh-sach-chuong.html">12 chương chuyên đề</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHtml(chapter.shortLabel)} · ${escapeHtml(chapter.period)}</span>
      </nav>

      <header class="chapter-hero">
        <p class="eyebrow"><span class="red-line"></span> ${escapeHtml(d.eyebrow)}</p>
        <h1 class="chapter-heading">${escapeHtml(d.title)}</h1>
        <p class="chapter-lead">${escapeHtml(d.lead)}</p>
        <p class="chapter-intro">${escapeHtml(d.summary)}</p>
        ${statsHtml}
      </header>
    </div>

    <div class="chapter-parts">${partsBandsHtml}</div>

    <div class="wrap chapter-bottom-wrap">
      <div class="chapter-afterword">
        ${renderQuizCallout(chapter, d.quiz)}
        <section class="chapter-sources-box" aria-label="Tài liệu tham khảo của ${escapeHtml(chapter.shortLabel)}">
          <strong>NGUỒN TÀI LIỆU ĐỐI CHIẾU</strong>
          <div class="chapter-sources-list">${refListHtml}</div>
        </section>
      </div>

      ${renderChapterFooterNav(currentIndex)}
    </div>
  `;

  // Interactive daily maps, vector map hover popup & stage tabs in white timeline section
  const stageShell = $('.diagram-stage-shell', main);
  const partWithSeq = d.parts.find((p) => p.media?.sequence?.length);
  let clearMapSelection = () => {};

  const mapSvg = $('#uprising-interactive-map', main);
  if (mapSvg) {
    let cursorPopup = document.getElementById('map-cursor-popup');
    if (!cursorPopup) {
      cursorPopup = document.createElement('aside');
      cursorPopup.id = 'map-cursor-popup';
      cursorPopup.className = 'map-cursor-popup';
      cursorPopup.setAttribute('aria-live', 'polite');
      cursorPopup.hidden = true;
      cursorPopup.innerHTML = `
        <div class="map-popup-head">
          <span class="map-popup-day"></span>
          <span class="map-popup-type"></span>
        </div>
        <strong class="map-popup-name"></strong>
        <p class="map-popup-note"></p>
      `;
      document.body.appendChild(cursorPopup);
    }

    const overlayPath = $('#uprising-active-overlay', mapSvg);
    const activeDot = $('#uprising-active-dot', mapSvg);
    const dayEl = $('.map-popup-day', cursorPopup);
    const typeEl = $('.map-popup-type', cursorPopup);
    const nameEl = $('.map-popup-name', cursorPopup);
    const noteEl = $('.map-popup-note', cursorPopup);

    let activeEl = null;
    let activeId = null;

    const positionPopup = (clientX, clientY) => {
      cursorPopup.hidden = false;
      const pad = 12;
      const offset = 16;
      const rect = cursorPopup.getBoundingClientRect();
      let left = clientX + offset;
      let top = clientY + offset;
      if (left + rect.width > window.innerWidth - pad) {
        left = clientX - rect.width - offset;
      }
      if (top + rect.height > window.innerHeight - pad) {
        top = clientY - rect.height - offset;
      }
      const maxLeft = Math.max(pad, window.innerWidth - rect.width - pad);
      const maxTop = Math.max(pad, window.innerHeight - rect.height - pad);
      left = Math.min(Math.max(pad, left), maxLeft);
      top = Math.min(Math.max(pad, top), maxTop);
      cursorPopup.style.left = `${Math.round(left)}px`;
      cursorPopup.style.top = `${Math.round(top)}px`;
    };

    const activateRegion = (regionEl, clientX, clientY) => {
      const id = regionEl?.getAttribute('data-region-id');
      const item = id ? UPRISING_REGION_MAP[id] : null;
      if (!item) return;

      if (activeId !== id) {
        if (activeEl) activeEl.classList.remove('is-active');
        regionEl.classList.add('is-active');
        activeEl = regionEl;
        activeId = id;

        if (overlayPath) {
          if (item.path) {
            overlayPath.setAttribute('d', item.path);
            overlayPath.setAttribute('data-status', item.status);
            overlayPath.classList.add('is-visible');
          } else {
            overlayPath.removeAttribute('d');
            overlayPath.removeAttribute('data-status');
            overlayPath.classList.remove('is-visible');
          }
        }

        if (activeDot) {
          if (item.dot) {
            activeDot.setAttribute('cx', String(item.dot[0]));
            activeDot.setAttribute('cy', String(item.dot[1]));
            activeDot.setAttribute('r', '3.1');
            activeDot.setAttribute('data-status', item.status);
            activeDot.classList.add('is-visible');
          } else {
            activeDot.setAttribute('r', '0');
            activeDot.removeAttribute('cx');
            activeDot.removeAttribute('cy');
            activeDot.removeAttribute('data-status');
            activeDot.classList.remove('is-visible');
          }
        }

        cursorPopup.className = `map-cursor-popup is-status-${item.status}`;
        dayEl.textContent = item.dayLabel;
        typeEl.textContent = item.typeLabel;
        nameEl.textContent = item.name;
        noteEl.textContent = item.note;
      }

      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        positionPopup(clientX, clientY);
      } else {
        const r = regionEl.getBoundingClientRect();
        positionPopup(r.left + r.width / 2, r.top + r.height / 2);
      }
    };

    clearMapSelection = () => {
      if (activeEl) activeEl.classList.remove('is-active');
      activeEl = null;
      activeId = null;
      if (overlayPath) {
        overlayPath.removeAttribute('d');
        overlayPath.removeAttribute('data-status');
        overlayPath.classList.remove('is-visible');
      }
      if (activeDot) {
        activeDot.setAttribute('r', '0');
        activeDot.removeAttribute('cx');
        activeDot.removeAttribute('cy');
        activeDot.removeAttribute('data-status');
        activeDot.classList.remove('is-visible');
      }
      cursorPopup.hidden = true;
    };

    mapSvg.addEventListener('mousemove', (e) => {
      const target = e.target?.closest?.('.map-region');
      if (target) {
        activateRegion(target, e.clientX, e.clientY);
      } else {
        clearMapSelection();
      }
    });

    mapSvg.addEventListener('mouseleave', () => {
      clearMapSelection();
    });

    mapSvg.addEventListener('click', (e) => {
      const target = e.target?.closest?.('.map-region');
      if (target) {
        activateRegion(target, e.clientX || undefined, e.clientY || undefined);
      } else {
        clearMapSelection();
      }
    });

    mapSvg.addEventListener('focusin', (e) => {
      const target = e.target?.closest?.('.map-region');
      if (target) activateRegion(target);
    });

    mapSvg.addEventListener('focusout', (e) => {
      if (!mapSvg.contains(e.relatedTarget)) {
        clearMapSelection();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeId) clearMapSelection();
    });

    document.addEventListener('click', (e) => {
      if (activeId && !mapSvg.contains(e.target)) {
        clearMapSelection();
      }
    });

    window.addEventListener('resize', () => {
      if (activeId) clearMapSelection();
    });
  }

  if (stageShell && partWithSeq) {
    const seq = partWithSeq.media.sequence;
    const tabs = stageShell.querySelectorAll('[data-stage-tab]');
    const panels = stageShell.querySelectorAll('[data-stage-panel]');
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-stage-tab');
        if (target !== 'diagram') clearMapSelection();
        tabs.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          const match = panel.getAttribute('data-stage-panel') === target;
          panel.hidden = !match;
          panel.classList.toggle('is-active', match);
        });
      });
    });

    const mapImg = $('#daily-map-img', stageShell);
    const mapDate = $('#daily-map-date', stageShell);
    const mapSummary = $('#daily-map-summary', stageShell);
    const dayBtns = stageShell.querySelectorAll('[data-day-idx]');
    dayBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-day-idx'));
        const item = seq[idx];
        if (!item || !mapImg) return;
        mapImg.src = item.image;
        mapImg.alt = `Bản đồ diễn biến Tổng khởi nghĩa ngày ${item.date}/1945`;
        if (mapDate) mapDate.textContent = `Ngày ${item.date}/1945`;
        if (mapSummary) mapSummary.textContent = item.summary;
        dayBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
      });
    });
  }

  // Reusable pop-up document dialog for milestones & content sections across the chapter
  let getActiveMilestoneDocs = () => [];
  const docGroups = [];
  d.parts.forEach((p) => {
    if (p.documents?.length) docGroups.push(p.documents);
    (p.contentSections || []).forEach((sec) => {
      if (sec.documents?.length) docGroups.push(sec.documents);
    });
    (p.stages || []).forEach((st) => {
      (st.events || []).forEach((ev) => {
        if (ev.documents?.length) docGroups.push(ev.documents);
      });
    });
  });

  if (docGroups.length) {
    const oldDocDialog = document.getElementById('milestone-doc-dialog');
    if (oldDocDialog) oldDocDialog.remove();
    const docDialog = document.createElement('dialog');
    docDialog.id = 'milestone-doc-dialog';
    docDialog.className = 'doc-dialog';
    docDialog.setAttribute('aria-labelledby', 'doc-dialog-title');
    document.body.appendChild(docDialog);

    let lastDocOpener = null;
    let activeDocsList = [];

    const findDocsListForId = (docId) => {
      const msDocs = getActiveMilestoneDocs();
      if (msDocs.some((item) => item.id === docId)) return msDocs;
      return docGroups.find((grp) => grp.some((item) => item.id === docId)) || msDocs || [];
    };

    const renderDocDialog = (docsList, docId) => {
      const doc = docsList.find((dItem) => dItem.id === docId) || docsList[0];
      if (!doc) return;
      activeDocsList = docsList;

      const tabsHtml =
        docsList.length > 1
          ? `
            <nav class="doc-tabs" style="--doc-tab-cols: ${Math.min(docsList.length, 3)}" aria-label="Chuyển đổi văn kiện tư liệu">
              ${docsList
                .map(
                  (dItem, idx) => `
                    <button type="button" class="doc-tab-btn${dItem.id === doc.id ? ' is-active' : ''}" data-doc-switch="${escapeHtml(dItem.id)}" aria-selected="${dItem.id === doc.id}">
                      <span>${String(idx + 1).padStart(2, '0')}.</span>
                      <span>${escapeHtml(dItem.tabLabel || dItem.title)}</span>
                    </button>
                  `,
                )
                .join('')}
            </nav>
          `
          : '';

      const imageSideHtml = doc.image
        ? `
          <figure class="doc-scan-card">
            <img src="${escapeHtml(doc.image)}" alt="${escapeHtml(doc.imageAlt || doc.title)}" width="480" height="380" />
            <figcaption>${escapeHtml(doc.imageAlt || doc.title)}</figcaption>
          </figure>
        `
        : '';

      const contentHtml = doc.paragraphs?.length
        ? `
          <div class="doc-letter-body">
            ${doc.paragraphs
              .map((pText, pIdx) => {
                const isSalutation = pText.startsWith('Hỡi ') || pText.endsWith('muôn năm!');
                return `<p class="${isSalutation ? 'is-emph' : ''}"${pIdx === 0 ? ' data-first-para' : ''}>${escapeHtml(pText)}</p>`;
              })
              .join('')}
            ${doc.signature ? `<p class="doc-signature">${escapeHtml(doc.signature)}</p>` : ''}
          </div>
        `
        : doc.clauses?.length
          ? `
            <div class="doc-clauses-list">
              ${doc.clauses
                .map(
                  (clause) => `
                    <section class="doc-clause-item">
                      <h4>${escapeHtml(clause.heading)}</h4>
                      <p>${escapeHtml(clause.text)}</p>
                    </section>
                  `,
                )
                .join('')}
            </div>
          `
          : '';

      docDialog.innerHTML = `
        <div class="doc-shell">
          <header class="doc-head">
            <div class="doc-head-copy">
              <p class="doc-eyebrow">${escapeHtml(doc.badge || 'TƯ LIỆU LỊCH SỬ · BẢN DỊCH')}</p>
              <h2 id="doc-dialog-title">${escapeHtml(doc.title)}</h2>
              ${doc.meta ? `<p class="doc-meta">${escapeHtml(doc.meta)}</p>` : ''}
            </div>
            <button type="button" class="doc-close-btn" data-doc-close aria-label="Đóng cửa sổ tư liệu">✕</button>
          </header>
          ${tabsHtml}
          <div class="doc-body">
            <div class="doc-intro-row${imageSideHtml ? ' has-scan' : ''}">
              ${imageSideHtml}
              ${doc.summary ? `<div class="doc-summary-box"><strong>BỐI CẢNH &amp; Ý NGHĨA VĂN KIỆN</strong><p>${escapeHtml(doc.summary)}</p></div>` : ''}
            </div>
            ${contentHtml}
          </div>
          <footer class="doc-foot">
            <span>${escapeHtml(doc.provenance || '')}</span>
            <button type="button" class="button primary doc-done-btn" data-doc-close>Đóng văn kiện</button>
          </footer>
        </div>
      `;
    };

    const openDocPopup = (docId, openerEl) => {
      const docsList = findDocsListForId(docId);
      if (!docsList.length) return;
      lastDocOpener = openerEl || document.activeElement;
      renderDocDialog(docsList, docId);
      if (!docDialog.open) docDialog.showModal();
    };

    docDialog.addEventListener('click', (e) => {
      if (e.target === docDialog || e.target.closest?.('[data-doc-close]')) {
        docDialog.close();
        return;
      }
      const switchBtn = e.target.closest?.('[data-doc-switch]');
      if (switchBtn) {
        const nextDocId = switchBtn.getAttribute('data-doc-switch');
        renderDocDialog(activeDocsList, nextDocId);
      }
    });

    docDialog.addEventListener('close', () => {
      if (lastDocOpener && typeof lastDocOpener.focus === 'function') {
        lastDocOpener.focus({ preventScroll: true });
      }
    });

    main.addEventListener('click', (e) => {
      const docBtn = e.target.closest?.('[data-doc-open]');
      if (!docBtn) return;
      openDocPopup(docBtn.getAttribute('data-doc-open'), docBtn);
    });
  }

  // Interactive milestone inspector & stage jump sync (e.g., Chương 3 Phần 02)
  const partWithMilestones = d.parts.find((p) => p.stages?.length && p.media?.milestoneInspector);
  if (partWithMilestones) {
    const milestones = flattenPartMilestones(partWithMilestones);
    const band = document.getElementById(partWithMilestones.id);
    if (band && milestones.length) {
      const jumpBtns = band.querySelectorAll('[data-stage-jump]');
      const stageCards = band.querySelectorAll('[data-stage-card]');
      const stepItems = band.querySelectorAll('[data-milestone-idx]');
      const stepTriggers = band.querySelectorAll('[data-milestone-trigger]');
      const stagePillEl = $('#ms-stage-pill', band);
      const datePillEl = $('#ms-date-pill', band);
      const counterEl = $('#ms-counter', band);
      const photoBoxEl = $('#ms-photo-box', band);
      const titleEl = $('#ms-title', band);
      const extendedEl = $('#ms-extended', band);
      const factsEl = $('#ms-facts', band);
      const extraEl = $('#ms-extra', band);
      const prevBtn = $('[data-ms-prev]', band);
      const nextBtn = $('[data-ms-next]', band);
      const totalStr = String(milestones.length).padStart(2, '0');
      let activeMsIdx = 0;
      getActiveMilestoneDocs = () => milestones[activeMsIdx]?.documents || [];

      const selectMilestone = (idx, { scrollToStep = false, scrollToStage = false } = {}) => {
        const item = milestones[idx];
        if (!item) return;
        activeMsIdx = idx;

        stepItems.forEach((li) => {
          const liIdx = Number(li.getAttribute('data-milestone-idx'));
          const isMatch = liIdx === idx;
          const liItem = milestones[liIdx];
          li.classList.toggle('is-selected', isMatch);
          const cue = li.querySelector('.part-step-cue');
          if (cue) cue.textContent = getMilestoneCueLabel(liItem, isMatch);
        });
        stepTriggers.forEach((btn) => {
          const isMatch = Number(btn.getAttribute('data-milestone-trigger')) === idx;
          btn.setAttribute('aria-pressed', String(isMatch));
        });
        jumpBtns.forEach((btn, i) => {
          btn.classList.toggle('is-active', i === item.stageIdx);
        });
        stageCards.forEach((card, i) => {
          card.classList.toggle('is-focused', i === item.stageIdx);
        });

        const mediaHtml = renderMilestoneMediaHtml(item, milestones.length);
        const extraHtml = renderMilestoneExtraHtml(item);
        const panelShell = $('.is-milestone-panel', band);
        if (panelShell) panelShell.scrollTop = 0;
        if (stagePillEl) stagePillEl.textContent = `${item.stageCode} · ${item.stagePeriod}`;
        if (datePillEl) datePillEl.textContent = item.date;
        if (counterEl) counterEl.textContent = `Mốc ${String(idx + 1).padStart(2, '0')} / ${totalStr}`;
        if (photoBoxEl) {
          photoBoxEl.innerHTML = mediaHtml;
          photoBoxEl.hidden = !mediaHtml;
        }
        if (titleEl) titleEl.textContent = item.title;
        if (extendedEl) extendedEl.textContent = item.extendedDetail || item.detail;
        if (factsEl) factsEl.innerHTML = renderMilestoneFactsHtml(item.keyFacts);
        if (extraEl) {
          extraEl.innerHTML = extraHtml;
          extraEl.hidden = !extraHtml;
        }
        if (prevBtn) prevBtn.disabled = idx <= 0;
        if (nextBtn) nextBtn.disabled = idx >= milestones.length - 1;

        if (scrollToStage && stageCards[item.stageIdx]) {
          stageCards[item.stageIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (scrollToStep && stepItems[idx]) {
          stepItems[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      };

      stepTriggers.forEach((btn) => {
        btn.addEventListener('click', () => {
          selectMilestone(Number(btn.getAttribute('data-milestone-trigger')), { scrollToStep: false });
        });
      });

      prevBtn?.addEventListener('click', () => {
        if (activeMsIdx > 0) selectMilestone(activeMsIdx - 1, { scrollToStep: true });
      });

      nextBtn?.addEventListener('click', () => {
        if (activeMsIdx < milestones.length - 1) selectMilestone(activeMsIdx + 1, { scrollToStep: true });
      });

      jumpBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const firstMs = Number(btn.getAttribute('data-first-ms'));
          selectMilestone(firstMs, { scrollToStage: true });
        });
      });
    }
  }

  // Stage jump bar sync for timeline bands without a milestone inspector (e.g., Chương 4 Phần 02)
  d.parts
    .filter((p) => p.stages?.length && !p.media?.milestoneInspector)
    .forEach((stagePart) => {
      const band = document.getElementById(stagePart.id);
      if (!band) return;
      const jumpBtns = band.querySelectorAll('[data-stage-jump]');
      const stageCards = band.querySelectorAll('[data-stage-card]');
      jumpBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          jumpBtns.forEach((b, j) => b.classList.toggle('is-active', j === idx));
          stageCards.forEach((c, j) => c.classList.toggle('is-focused', j === idx));
          if (stageCards[idx]) {
            stageCards[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    });

  // Reusable lightbox modal for zoomable campaign maps & overview figures
  const hasZoomableMedia = Boolean(
    main.querySelector('[data-zoom-src]') ||
      d.parts.some((p) => (p.stages || []).some((st) => (st.events || []).some((ev) => ev.zoomable))),
  );
  if (hasZoomableMedia) {
    const oldZoomDialog = document.getElementById('image-zoom-dialog');
    if (oldZoomDialog) oldZoomDialog.remove();
    const zoomDialog = document.createElement('dialog');
    zoomDialog.id = 'image-zoom-dialog';
    zoomDialog.className = 'zoom-dialog';
    zoomDialog.setAttribute('aria-labelledby', 'zoom-dialog-title');
    document.body.appendChild(zoomDialog);

    let lastZoomOpener = null;

    const openZoomModal = (btn) => {
      const src = btn.getAttribute('data-zoom-src');
      if (!src) return;
      const alt = btn.getAttribute('data-zoom-alt') || '';
      const title = btn.getAttribute('data-zoom-title') || 'Ảnh tư liệu phóng to';
      const caption = btn.getAttribute('data-zoom-caption') || alt;
      lastZoomOpener = btn;
      zoomDialog.innerHTML = `
        <div class="zoom-shell">
          <header class="zoom-head">
            <h2 id="zoom-dialog-title">${escapeHtml(title)}</h2>
            <button type="button" class="doc-close-btn" data-zoom-close aria-label="Đóng cửa sổ phóng to ảnh">✕</button>
          </header>
          <div class="zoom-stage">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />
          </div>
          <footer class="zoom-foot">
            <p>${escapeHtml(caption)}</p>
            <button type="button" class="button primary doc-done-btn" data-zoom-close>Đóng ảnh</button>
          </footer>
        </div>
      `;
      if (!zoomDialog.open) zoomDialog.showModal();
    };

    zoomDialog.addEventListener('click', (e) => {
      if (e.target === zoomDialog || e.target.closest?.('[data-zoom-close]')) {
        zoomDialog.close();
      }
    });

    zoomDialog.addEventListener('close', () => {
      if (lastZoomOpener && typeof lastZoomOpener.focus === 'function') {
        lastZoomOpener.focus({ preventScroll: true });
      }
    });

    main.addEventListener('click', (e) => {
      const zoomBtn = e.target.closest?.('[data-zoom-src]');
      if (!zoomBtn) return;
      openZoomModal(zoomBtn);
    });
  }

  // Click-to-load YouTube support for both static and dynamically swapped milestone cards
  main.addEventListener('click', (event) => {
    const btn = event.target.closest?.('.youtube-box.is-playable .youtube-poster-btn, .youtube-box.is-playable .youtube-launch-btn');
    if (!btn) return;
    const box = btn.closest('.youtube-box.is-playable');
    if (!box || box.classList.contains('is-playing')) return;
    const embedUrl = box.getAttribute('data-embed');
    const title = box.getAttribute('data-title') || 'Video YouTube';
    if (!embedUrl) return;
    box.classList.add('is-playing');
    const frameWrap = document.createElement('div');
    frameWrap.className = 'youtube-frame-wrap';
    frameWrap.innerHTML = `<iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    btn.replaceWith(frameWrap);
  });

  initChapterQuiz(chapter, d.quiz);
} else {
  const d = chapter.detail;
  document.title = `${chapter.shortLabel}: ${chapter.label} — Dấu ấn hòa bình`;

  const statsHtml = d.stats?.length
    ? `<div class="chapter-stats" aria-label="Các chặng chính">${d.stats.map((stat) => `<div class="chapter-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join('')}</div>`
    : '';

  const sectionsHtml = (d.sections || []).map((sec) => {
    const itemsHtml = sec.items?.length
      ? `<ul class="event-list">${sec.items.map((pt) => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>`
      : '';
    const primarySource = sec.source && sources[sec.source] ? sourceLink(sources, sec.source, sources[sec.source].name) : '';
    const extraSource = sec.extraSource && sources[sec.extraSource] ? ` · ${sourceLink(sources, sec.extraSource, 'Đối chiếu thêm')}` : '';
    return `<div class="event"><p class="event-date">${escapeHtml(sec.date)}</p><h3>${escapeHtml(sec.title)}</h3>${itemsHtml}${primarySource}${extraSource}</div>`;
  }).join('');

  const refListHtml = (d.sources || []).filter((k) => sources[k]).map((key, idx) => {
    const src = sources[key];
    return `<a href="${escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer"><span>${String(idx + 1).padStart(2, '0')}. ${escapeHtml(src.title)}</span><small>${escapeHtml(src.name)} · ${escapeHtml(src.period)} ↗</small></a>`;
  }).join('');

  main.innerHTML = `
    <div class="wrap chapter-single-wrap">
      <nav class="chapter-breadcrumb" aria-label="Đường dẫn trang">
        <a href="/">Trang chủ</a>
        <span aria-hidden="true">/</span>
        <a href="/danh-sach-chuong.html">12 chương chuyên đề</a>
        <span aria-hidden="true">/</span>
        <span>${escapeHtml(chapter.shortLabel)} · ${escapeHtml(chapter.period)}</span>
      </nav>

      <div class="chapter-panel">
        <div class="chapter-visual">
          <img class="chapter-image" src="${escapeHtml(d.image)}" alt="${escapeHtml(d.imageAlt || d.caption)}" width="800" height="534" />
          <div class="chapter-image-caption">
            <span>${escapeHtml(d.caption)}<small>${escapeHtml(d.credit)}</small></span>
            ${sourceLink(sources, d.imageSource, 'Tư liệu đối chiếu')}
          </div>
          <div class="chapter-side-meta">
            <strong>VỊ TRÍ TRONG 12 CHƯƠNG</strong>
            <p>Hồ sơ ${String(currentIndex + 1).padStart(2, '0')} / ${introChapters.length} · ${escapeHtml(chapter.label)}</p>
            <a href="/?intro=1" class="source-link">↺ Xem lại video tổng quan (3 phút 10s)</a>
          </div>
        </div>

        <article class="chapter-text">
          <p class="eyebrow"><span class="red-line"></span> ${escapeHtml(d.eyebrow)}</p>
          <h1 class="chapter-heading">${escapeHtml(d.title)}</h1>
          <p class="chapter-lead">${escapeHtml(d.lead)}</p>
          <p class="chapter-intro">${escapeHtml(d.summary)}</p>
          ${statsHtml}
          <div class="events">${sectionsHtml}</div>
          ${renderQuizCallout(chapter, d.quiz)}
          <section class="chapter-sources-box" aria-label="Tài liệu tham khảo của ${escapeHtml(chapter.shortLabel)}">
            <strong>NGUỒN TÀI LIỆU ĐỐI CHIẾU</strong>
            <div class="chapter-sources-list">${refListHtml}</div>
          </section>
        </article>
      </div>

      ${renderChapterFooterNav(currentIndex)}
    </div>
  `;

  initChapterQuiz(chapter, d.quiz);
}
