// Shared by public routes and the editor. IDs remain stable when a series is renamed.
export const slugifySeries = value => String(value || '').normalize('NFKD').replace(/[’']/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const seriesIdFor = (data, catalog) => data.seriesId || catalog.find(series => series.title === data.series?.trim())?.id || slugifySeries(data.series);
export const isPublicPost = (post, now = new Date()) => post.data.published === true && new Date(post.data.date) <= now;
export const isPublicBlogPost = (post, now = new Date()) => isPublicPost(post, now) && !post.data.seriesId?.trim() && !post.data.series?.trim();
export const compareEpisodes = (a, b) => (a.data.seriesOrder || Infinity) - (b.data.seriesOrder || Infinity) || new Date(a.data.date) - new Date(b.data.date) || a.id.localeCompare(b.id);
export const buildSeries = (posts, catalog, now = new Date()) => {
  const groups = new Map();
  for (const post of posts.filter(post => isPublicPost(post, now))) {
    const id = seriesIdFor(post.data, catalog);
    if (!id || !catalog.some(series => series.id === id)) continue;
    if (!groups.has(id)) {
      const definition = catalog.find(series => series.id === id);
      groups.set(id, { id, title: definition?.title || post.data.series || id, description: definition?.description || `Read the articles in ${post.data.series || id} in order.`, posts: [] });
    }
    groups.get(id).posts.push(post);
  }
  return [...groups.values()].map(series => ({ ...series, posts: series.posts.sort(compareEpisodes) })).sort((a, b) => a.title.localeCompare(b.title));
};
export const episodeNumber = (post, index) => post.data.seriesOrder || index + 1;
export const seriesContext = (post, groups, catalog) => {
  const series = groups.find(series => series.id === seriesIdFor(post.data, catalog));
  if (!series) return null;
  const index = series.posts.findIndex(entry => entry.id === post.id);
  if (index < 0) return null;
  return { ...series, number: episodeNumber(post, index), position: index + 1, previous: series.posts[index - 1], next: series.posts[index + 1] };
};
