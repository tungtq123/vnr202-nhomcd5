import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { chapters, sources, questions, videos, scoreAnswers } from './dist/data.mjs';

assert.equal(chapters.length, 6);
assert.equal(questions.length, 12);
assert.equal(videos.length, 7);
assert.equal(Object.keys(sources).length, 16);
assert.equal(new Set(chapters.map((chapter) => chapter.id)).size, 6);
for (const [index, chapter] of chapters.entries()) {
  assert.equal(questions.filter((question) => question.chapter === index).length, 2);
  assert.ok(videos.some((video) => video.id === chapter.video));
  for (const event of chapter.events) assert.ok(sources[event.source]);
  for (const key of chapter.sources) assert.ok(sources[key]);
  if (chapter.image) await access('.' + '/dist' + chapter.image);
}
for (const question of questions) {
  assert.ok(sources[question.source]);
  assert.equal(question.options.length, 4);
  assert.ok(question.answer >= 0 && question.answer < 4);
}
assert.equal(scoreAnswers(questions, questions.map((question) => question.answer)), 12);
assert.equal(scoreAnswers(questions, []), 0);
assert.equal(scoreAnswers(questions, questions.map((question) => (question.answer + 1) % 4)), 0);
assert.equal(scoreAnswers(questions.slice(0, 2), [questions[0].answer, (questions[1].answer + 1) % 4]), 1);
const media = JSON.parse(await readFile('dist/assets/media.json', 'utf8'));
for (const video of videos) {
  const metadata = media[video.id];
  assert.ok(metadata && metadata.page.startsWith('https://'));
  assert.ok(metadata.stream?.startsWith('https://') || metadata.iframe?.startsWith('https://'));
  if (video.image) await access('dist' + video.image);
}
for (const source of Object.values(sources)) assert.ok(new URL(source.url).protocol === 'https:');
const html = await readFile('dist/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML ids');
for (const match of html.matchAll(/href="#([^\"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]}`);
for (const match of html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)) await access('dist' + match[1]);
assert.match(html, /lang="vi"/);
assert.doesNotMatch(html, /Starter Project|codex-preview/);
console.log('Passed: chapter and source integrity, media metadata, all quiz scoring paths, local assets, HTML ids and navigation anchors.');
