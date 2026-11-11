interface Env { GITHUB_TOKEN: string }
export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!context.env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  const headers = { Authorization: `Bearer ${context.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin' };
  const listing = await fetch('https://api.github.com/repos/ldecuba/decuba.tech/contents/decuba-tech-blog-astro/src/content/posts?ref=main', { headers });
  if (listing.status === 404) return Response.json({ posts: [] });
  if (!listing.ok) return Response.json({ error: 'GitHub posts could not be loaded.' }, { status: listing.status });
  const files = await listing.json<{ name: string; url: string }[]>();
  try {
    const posts = await Promise.all(files.filter(file => file.name.endsWith('.md') || file.name.endsWith('.json')).map(async file => {
      const response = await fetch(file.url, { headers });
      if (!response.ok) throw new Error('Post could not be loaded.');
      const result = await response.json<{ content: string }>();
      const content = new TextDecoder().decode(Uint8Array.from(atob(result.content.replace(/\s/g, '')), char => char.charCodeAt(0)));
      return { filename: file.name, content };
    }));
    return Response.json({ posts }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'GitHub posts could not be loaded.' }, { status: 502 }); }
};
