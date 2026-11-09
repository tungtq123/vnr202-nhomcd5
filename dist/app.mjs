import { chapters, sources, videos, questions, scoreAnswers } from './data.mjs';

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const playIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5 14 8 3 14.5Z" fill="currentColor"/></svg>';
let chapterIndex = 0;
let resourceKind = 'video';
let media = {};
let quizItems = [];
let quizAnswers = [];
let quizIndex = 0;
let quizScope = 'Toàn bộ hành trình';
let lastModalTrigger = null;

function sourceLink(key, text = 'Đọc nguồn') {
  const source = sources[key];
  return `<a class="source-link" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(text)} <span aria-hidden="true">↗</span></a>`;
}

function setChapter(index, updateUrl = true) {
  chapterIndex = Math.max(0, Math.min(chapters.length - 1, index));
  const chapter = chapters[chapterIndex];
  for (const [i, tab] of [...document.querySelectorAll('.timeline-tab')].entries()) {
    tab.setAttribute('aria-selected', String(i === chapterIndex));
    tab.tabIndex = i === chapterIndex ? 0 : -1;
  }
  const visual = chapter.image
    ? `<img class="chapter-image" src="${chapter.image}" alt="${escape(chapter.caption)}" width="650" height="500" loading="lazy" /><div class="chapter-image-caption"><span>${escape(chapter.caption)}<small>${escape(chapter.credit)}</small></span>${sourceLink(chapter.imageSource, 'Nguồn ảnh')}</div>`
    : `<div class="chapter-poster"><span class="poster-label">HỒ SƠ LỊCH SỬ / 0${chapterIndex + 1}</span><span class="poster-year">${escape(chapter.period)}</span><p class="poster-title">${escape(chapter.label)}</p><span class="poster-foot">ĐỌC TƯ LIỆU · HIỂU BỐI CẢNH</span></div>`;
  const video = videos.find((item) => item.id === chapter.video);
  const panel = $('#chapter-panel');
  panel.setAttribute('aria-labelledby', `tab-${chapter.id}`);
  panel.innerHTML = `<div class="chapter-visual">${visual}<button class="chapter-video" data-video="${chapter.video}"><span class="round-play">${playIcon}</span><span><small>VIDEO ĐỒNG HÀNH · ${escape(video.publisher)}</small><b>${escape(video.title)}</b></span><span aria-hidden="true">↗</span></button></div><article class="chapter-text"><p class="eyebrow">${escape(chapter.theme)}</p><h3>${escape(chapter.title)}</h3><p class="chapter-intro">${escape(chapter.intro)}</p><div class="events">${chapter.events.map((event) => `<div class="event"><p class="event-date">${escape(event.date)}</p><h4>${escape(event.title)}</h4><p>${escape(event.text)}</p>${sourceLink(event.source, sources[event.source].name)}${event.extraSource ? ` · ${sourceLink(event.extraSource, 'Đối chiếu kết quả')}` : ''}</div>`).join('')}</div><div class="context-note"><strong>ĐỌC LỊCH SỬ TRONG BỐI CẢNH</strong>${escape(chapter.context)}</div><div class="chapter-actions"><button class="button secondary" data-quiz="${chapterIndex}">Ôn tập chặng này <span aria-hidden="true">↗</span></button><a href="#tu-lieu" data-filter-chapter="${chapterIndex}">Xem tư liệu liên quan ↗</a></div></article>`;
  $('#chapter-position').textContent = `HỒ SƠ 0${chapterIndex + 1} / 06`;
  $('#prev-chapter').disabled = chapterIndex === 0;
  $('#next-chapter').disabled = chapterIndex === chapters.length - 1;
  if (updateUrl) history.replaceState(null, '', `#chang-${chapter.id}`);
}

$('#timeline').innerHTML = chapters.map((chapter, index) => `<button class="timeline-tab" role="tab" id="tab-${chapter.id}" aria-controls="chapter-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}" data-chapter="${index}"><strong>${escape(chapter.period)}</strong><span>${escape(chapter.label)}</span></button>`).join('');
$('#timeline').addEventListener('click', (event) => {
  const tab = event.target.closest('[data-chapter]');
  if (tab) setChapter(Number(tab.dataset.chapter));
});
$('#timeline').addEventListener('keydown', (event) => {
  let next;
  if (event.key === 'ArrowRight') next = (chapterIndex + 1) % chapters.length;
  if (event.key === 'ArrowLeft') next = (chapterIndex + chapters.length - 1) % chapters.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = chapters.length - 1;
  if (next !== undefined) {
    event.preventDefault();
    setChapter(next);
    $(`#tab-${chapters[next].id}`).focus();
  }
});
for (const [id, direction] of [['prev-chapter', -1], ['next-chapter', 1]]) {
  $(`#${id}`).addEventListener('click', () => {
    setChapter(chapterIndex + direction);
    $('#hanh-trinh').scrollIntoView({ behavior: 'instant', block: 'start' });
    $(`#tab-${chapters[chapterIndex].id}`).focus({ preventScroll: true });
  });
}

function readHash() {
  const index = chapters.findIndex((chapter) => location.hash === `#chang-${chapter.id}`);
  if (index >= 0) {
    setChapter(index, false);
    $('#hanh-trinh').scrollIntoView({ behavior: 'instant', block: 'start' });
  }
}
setChapter(0, false);
readHash();
window.addEventListener('hashchange', readHash);

function renderResources() {
  const selectedPeriod = $('#period-filter').value;
  const currentChapter = selectedPeriod === 'all' ? null : chapters[Number(selectedPeriod)];
  const items = resourceKind === 'video'
    ? videos.filter((video) => !currentChapter || video.chapter === Number(selectedPeriod))
    : Object.entries(sources).filter(([, source]) => !currentChapter || source.period === currentChapter.period);
  $('#resource-status').textContent = `Hiển thị ${items.length} ${resourceKind === 'video' ? 'video tư liệu' : 'tài liệu đọc'}${currentChapter ? ` giai đoạn ${currentChapter.period}` : ' ở tất cả giai đoạn'}.`;
  $('#resource-grid').innerHTML = items.length ? items.map((item) => {
    if (resourceKind === 'document') {
      const [key, source] = item;
      return `<article class="resource-card document"><div class="resource-meta"><span>${escape(source.type)}</span><span>${escape(source.period)}</span></div><h3><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)}</a></h3><p class="resource-publisher">${escape(source.name)}</p>${sourceLink(key, 'Mở tài liệu gốc')}</article>`;
    }
    const video = item;
    const image = video.image
      ? `<img src="${video.image}" alt="${escape(video.imageNote)}" loading="lazy" width="650" height="370" />`
      : `<span class="typographic-thumb" aria-hidden="true"><small>${escape(video.type.toUpperCase())}</small><strong>${escape(chapters[video.chapter].period)}</strong><span>HỒ SƠ LỊCH SỬ</span></span>`;
    return `<article class="resource-card"><button class="video-thumb" data-video="${video.id}" aria-label="Xem video: ${escape(video.title)}">${image}<span class="round-play">${playIcon}</span><span class="thumb-period">${escape(chapters[video.chapter].period)}</span></button><div class="resource-meta"><span>${escape(video.type)}</span><span>PHÁT HÀNH ${video.year}</span></div><h3><button data-video="${video.id}">${escape(video.title)}</button></h3><p class="resource-publisher">${escape(video.publisher)}</p><a class="resource-origin" href="${escape(media[video.id]?.page || '#nguon')}" target="_blank" rel="noopener noreferrer">Trang nguồn <span aria-hidden="true">↗</span></a></article>`;
  }).join('') : '<p class="empty-state">Chưa có tư liệu thuộc loại này cho giai đoạn đã chọn. Hãy chọn loại tư liệu hoặc giai đoạn khác.</p>';
}
document.querySelectorAll('[data-kind]').forEach((button) => button.addEventListener('click', () => {
  resourceKind = button.dataset.kind;
  document.querySelectorAll('[data-kind]').forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  renderResources();
}));
$('#period-filter').addEventListener('change', renderResources);

function openDialog(dialog, trigger) {
  lastModalTrigger = trigger;
  dialog.showModal();
}
async function openVideo(id, trigger) {
  const video = videos.find((item) => item.id === id);
  const entry = media[id];
  if (!video || !entry) return;
  $('#video-title').textContent = video.title;
  $('#video-meta').textContent = `${video.publisher} · PHÁT HÀNH ${video.year}`;
  $('#video-summary').textContent = `Tư liệu đồng hành với chặng ${chapters[video.chapter].period}. ${video.imageNote ? `${video.imageNote}. ` : ''}Bản tóm tắt và các mốc đối chiếu nằm trong hồ sơ của chặng tương ứng.`;
  $('#video-origin').href = entry.page;
  $('#video-status').textContent = 'Nếu trình phát không tải được, bạn có thể xem tại trang nguồn.';
  const container = $('#video-container');
  container.replaceChildren();
  if (entry.stream) {
    const player = document.createElement('video');
    player.controls = true;
    player.preload = 'metadata';
    player.playsInline = true;
    player.src = entry.stream;
    player.setAttribute('aria-label', video.title);
    if (video.image) player.poster = video.image;
    player.addEventListener('error', () => {
      $('#video-status').textContent = 'Nguồn video hiện không phát được trên trình duyệt này. Mở “Xem tại trang nguồn” để tiếp tục.';
    });
    container.append(player);
  } else if (entry.iframe) {
    const frame = document.createElement('iframe');
    frame.src = entry.iframe;
    frame.title = video.title;
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    container.append(frame);
  } else {
    container.innerHTML = '<p class="empty-state">Tư liệu này được phát tại trang của đơn vị cung cấp.</p>';
  }
  openDialog($('#video-dialog'), trigger);
}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog.id === 'video-dialog') {
      dialog.querySelector('video')?.pause();
      $('#video-container').replaceChildren();
    }
    if (lastModalTrigger?.isConnected) lastModalTrigger.focus({ preventScroll: true });
  });
}

function startQuiz(chapter = null, trigger) {
  quizItems = chapter === null ? [...questions] : questions.filter((question) => question.chapter === chapter);
  quizAnswers = [];
  quizIndex = 0;
  quizScope = chapter === null ? 'Toàn bộ hành trình' : `Chặng ${chapters[chapter].period}`;
  renderQuiz();
  openDialog($('#quiz-dialog'), trigger);
}
function renderQuiz() {
  const question = quizItems[quizIndex];
  const selected = quizAnswers[quizIndex];
  const answered = selected !== undefined;
  const right = selected === question.answer;
  $('#quiz-content').innerHTML = `<p class="eyebrow quiz-eyebrow">GÓC ÔN TẬP / ${escape(quizScope.toUpperCase())}</p><div class="quiz-progress-info"><span>Câu ${quizIndex + 1} / ${quizItems.length}</span><span>${escape(chapters[question.chapter].period)}</span></div><div class="quiz-progress" role="progressbar" aria-label="Tiến độ trả lời" aria-valuemin="0" aria-valuemax="${quizItems.length}" aria-valuenow="${quizAnswers.filter((answer) => answer !== undefined).length}"><span style="width:${(quizIndex + Number(answered)) / quizItems.length * 100}%"></span></div><h2 id="quiz-title">${escape(question.question)}</h2><div class="answer-options" role="group" aria-label="Chọn đáp án">${question.options.map((option, index) => `<button class="answer-option ${answered && index === question.answer ? 'correct' : ''} ${answered && selected === index && !right ? 'wrong' : ''}" data-answer="${index}" aria-disabled="${answered}" aria-pressed="${selected === index}"><span>${'ABCD'[index]}</span>${escape(option)}${answered && index === question.answer ? '<span>✓ Đáp án đúng</span>' : answered && selected === index ? '<span>× Bạn đã chọn</span>' : ''}</button>`).join('')}</div>${answered ? `<div class="answer-explanation" id="answer-feedback" tabindex="-1" role="status"><strong>${right ? 'Chính xác.' : 'Cùng ghi nhớ lại.'}</strong>${escape(question.explanation)}<br />${sourceLink(question.source, 'Đối chiếu nguồn: ' + sources[question.source].name)}</div>` : ''}<div class="quiz-controls"><button class="text-button" data-quiz-prev ${quizIndex === 0 ? 'disabled' : ''}>← Câu trước</button><button class="button primary" data-quiz-next ${answered ? '' : 'disabled'}>${quizIndex === quizItems.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'} <span aria-hidden="true">→</span></button></div>`;
  $('#quiz-dialog').scrollTop = 0;
}
function showQuizResult() {
  const score = scoreAnswers(quizItems, quizAnswers);
  const wrongChapters = [...new Set(quizItems.filter((question, index) => question.answer !== quizAnswers[index]).map((question) => question.chapter))];
  const fullQuiz = quizItems.length === questions.length;
  if (fullQuiz) {
    try { localStorage.setItem('dau-an-hoa-binh-score', JSON.stringify({ score, total: quizItems.length })); } catch { /* Storage can be unavailable in private browsing. */ }
    updateSavedScore();
  }
  $('#quiz-content').innerHTML = `<div class="quiz-result"><p class="eyebrow quiz-eyebrow">HOÀN THÀNH / ${escape(quizScope.toUpperCase())}</p><h2 id="quiz-title" style="margin-top:25px">Mỗi lần ôn lại,<br />hiểu thêm một điều.</h2><div class="quiz-score">${score}<small> / ${quizItems.length}</small></div><p class="result-message">${score === quizItems.length ? 'Bạn đã trả lời đúng tất cả câu hỏi. Hãy tiếp tục đọc nguồn để hiểu sâu hơn bối cảnh của từng sự kiện.' : 'Bạn đã hoàn thành bài ôn tập. Những chặng dưới đây giúp bạn xem lại kiến thức cần củng cố.'}</p>${wrongChapters.length ? `<div class="result-review">${wrongChapters.map((index) => `<a href="#chang-${chapters[index].id}" data-revisit="${index}">Ôn lại chặng ${escape(chapters[index].period)} · ${escape(chapters[index].label)} ↗</a>`).join('')}</div>` : ''}<button class="button primary" data-quiz-retry>Làm lại bài này <span aria-hidden="true">↗</span></button><button class="quiz-exit" data-quiz-close>Trở về hành trình lịch sử</button></div>`;
  $('#quiz-title').tabIndex = -1;
  $('#quiz-title').focus();
}
function updateSavedScore() {
  try {
    const saved = JSON.parse(localStorage.getItem('dau-an-hoa-binh-score'));
    if (saved && Number.isInteger(saved.score) && saved.total === 12 && saved.score >= 0 && saved.score <= 12) $('#saved-score').textContent = `Lần ôn tập toàn bộ gần nhất: ${saved.score}/${saved.total} câu đúng. Kết quả được lưu trên thiết bị này.`;
  } catch { /* Learning remains available without local storage. */ }
}
$('#start-quiz').addEventListener('click', (event) => startQuiz(null, event.currentTarget));
$('#quiz-content').addEventListener('click', (event) => {
  const answer = event.target.closest('[data-answer]');
  if (answer && quizAnswers[quizIndex] === undefined) {
    quizAnswers[quizIndex] = Number(answer.dataset.answer);
    renderQuiz();
    $('#answer-feedback').focus();
    return;
  }
  if (event.target.closest('[data-quiz-next]') && quizAnswers[quizIndex] !== undefined) {
    if (quizIndex === quizItems.length - 1) showQuizResult();
    else { quizIndex++; renderQuiz(); $('#quiz-title').tabIndex = -1; $('#quiz-title').focus(); }
  }
  if (event.target.closest('[data-quiz-prev]') && quizIndex > 0) { quizIndex--; renderQuiz(); }
  if (event.target.closest('[data-quiz-retry]')) { quizIndex = 0; quizAnswers = []; renderQuiz(); }
  if (event.target.closest('[data-quiz-close]')) $('#quiz-dialog').close();
  const revisit = event.target.closest('[data-revisit]');
  if (revisit) { $('#quiz-dialog').close(); setChapter(Number(revisit.dataset.revisit)); $('#hanh-trinh').scrollIntoView({ behavior: 'instant' }); }
});

$('#quick-options').addEventListener('click', (event) => {
  const button = event.target.closest('[data-value]');
  if (!button) return;
  document.querySelectorAll('#quick-options button').forEach((item) => {
    const value = Number(item.dataset.value);
    item.classList.toggle('correct', value === 1);
    item.classList.toggle('wrong', item === button && value !== 1);
    item.setAttribute('aria-pressed', String(item === button));
  });
  $('#quick-feedback').innerHTML = `${Number(button.dataset.value) === 1 ? 'Chính xác!' : 'Đáp án đúng là B.'} Hiệp định Paris được ký chính thức ngày 27/1/1973. <a href="${sources.paris.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Đối chiếu TTXVN ↗</a>`;
});

document.addEventListener('click', (event) => {
  const video = event.target.closest('[data-video]');
  if (video) openVideo(video.dataset.video, video);
  const quiz = event.target.closest('[data-quiz]');
  if (quiz) startQuiz(Number(quiz.dataset.quiz), quiz);
  const filter = event.target.closest('[data-filter-chapter]');
  if (filter) { $('#period-filter').value = filter.dataset.filterChapter; renderResources(); }
});
$('#menu-toggle').addEventListener('click', () => {
  const expanded = $('#menu-toggle').getAttribute('aria-expanded') === 'true';
  $('#menu-toggle').setAttribute('aria-expanded', String(!expanded));
  $('#menu-toggle').setAttribute('aria-label', expanded ? 'Mở điều hướng' : 'Đóng điều hướng');
  $('#mobile-nav').hidden = expanded;
});
$('#mobile-nav').addEventListener('click', (event) => {
  if (event.target.closest('a')) { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', 'Mở điều hướng'); }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', 'Mở điều hướng'); $('#menu-toggle').focus(); }
});
$('#source-list').innerHTML = Object.values(sources).map((source, index) => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${String(index + 1).padStart(2, '0')}. ${escape(source.title)} <span aria-hidden="true">↗</span><small>${escape(source.name)} · ${escape(source.period)}</small></a>`).join('');
updateSavedScore();
try {
  const response = await fetch('/assets/media.json');
  if (!response.ok) throw new Error('Media metadata unavailable');
  media = await response.json();
} catch {
  media = {
    dienbien: { page: 'https://www.youtube.com/watch?v=OraI2rKcJC4' },
    dongkhoi: { page: 'https://dbndnghean.vn/video/phong-trao-dong-khoi-buoc-ngoat-cua-cach-mang-mien-nam--phim-tai-lieu-khang-chien-chong-my-11114.htm' },
    apbac: { page: 'https://nvsk.vnanet.vn/chien-thang-ap-bac-1-124654.vna' },
    mauthan: { page: 'https://www.youtube.com/watch?v=-VPGVS0VKas' },
    hanoi: { page: 'https://www.youtube.com/watch?v=ysS-HHHzRBw' },
    paris: { page: 'https://www.youtube.com/watch?v=8hj7twvfkvw' },
    saigon: { page: 'https://www.youtube.com/watch?v=ecJSxFzvSKk' },
  };
}
$('#video-source-list').innerHTML = '<p class="eyebrow">NGUỒN VIDEO</p>' + videos.map((video) => `<a href="${escape(media[video.id]?.page || '#tu-lieu')}" target="_blank" rel="noopener noreferrer">${escape(video.title)} ↗<small>${escape(video.publisher)} · Phát hành ${video.year}</small></a>`).join('');
renderResources();
