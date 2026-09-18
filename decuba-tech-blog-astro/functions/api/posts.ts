interface Env { GITHUB_TOKEN: string }
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!context.env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  const headers = { Authorization: `Bearer ${context.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin' };
  const listing = await fetch('https://api.github.com/repos/ldecuba/decuba.tech/contents/decuba-tech-blog-astro/src/content/posts?ref=main', { headers });
  if (!listing.ok) return Response.json({ error: 'GitHub posts could not be loaded.' }, { status: listing.status });
  const files = await listing.json<{ name: string; download_url: string }[]>();
  const posts = await Promise.all(files.filter(file => file.name.endsWith('.md') || file.name.endsWith('.json')).map(async file => ({ filename: file.name, content: await (await fetch(file.download_url)).text() })));
  return Response.json({ posts });
};
