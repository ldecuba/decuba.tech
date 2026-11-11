import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeries, seriesContext, seriesIdFor, isPublicBlogPost } from '../src/lib/series.js';
const catalog = [{ id: 'control', title: 'Control', description: 'Agent governance.' }];
const post = (id, order, overrides = {}) => ({ id, data: { title: id, seriesId: 'control', seriesOrder: order, published: true, date: '2025-01-01', ...overrides } });
test('reading order uses episode numbers and supports legacy names', () => {
  const series = buildSeries([post('second', 2, { date: '2024-01-01' }), post('first', 1), post('last', undefined)], catalog);
  assert.deepEqual(series[0].posts.map(p => p.id), ['first', 'second', 'last']);
  assert.equal(seriesIdFor({ series: 'Control' }, catalog), 'control');
});
test('drafts, future episodes, standalone posts and unknown series stay out of public groups', () => {
  const series = buildSeries([post('public', 1), post('draft', 2, { published: false }), post('scheduled', 3, { date: '2099-01-01' }), post('standalone', 1, { seriesId: undefined }), post('unknown', 1, { seriesId: 'other' })], catalog, new Date('2026-11-11'));
  assert.equal(series.length, 1);
  assert.deepEqual(series[0].posts.map(p => p.id), ['public']);
  assert.deepEqual(buildSeries([post('draft', 1, { published: false })], catalog), []);
});
test('previous and next use only public episodes and handle the boundaries', () => {
  const first = post('first', 1), hidden = post('hidden', 2, { published: false }), last = post('last', 3);
  const groups = buildSeries([last, hidden, first], catalog);
  const start = seriesContext(first, groups, catalog), end = seriesContext(last, groups, catalog);
  assert.equal(start.previous, undefined); assert.equal(start.next.id, 'last');
  assert.equal(end.previous.id, 'first'); assert.equal(end.next, undefined);
  assert.equal(end.number, 3); assert.equal(end.position, 2); assert.equal(end.posts.length, 2);
  assert.equal(seriesContext(hidden, groups, catalog), null);
});

test('blog listings contain only public standalone articles', () => {
  const now = new Date('2026-11-11');
  assert.equal(isPublicBlogPost(post('standalone', undefined, { seriesId: undefined }), now), true);
  assert.equal(isPublicBlogPost(post('episode', 1), now), false);
  assert.equal(isPublicBlogPost(post('legacy-episode', undefined, { seriesId: undefined, series: 'Control' }), now), false);
  assert.equal(isPublicBlogPost(post('draft', undefined, { seriesId: undefined, published: false }), now), false);
  assert.equal(isPublicBlogPost(post('scheduled', undefined, { seriesId: undefined, date: '2099-01-01' }), now), false);
});
