interface Env { GITHUB_TOKEN: string }
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!context.env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  const body = await context.request.json<{ filename?: string; content?: string }>();
  const filename = (body.filename || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!filename.endsWith('.md') || !body.content?.trim()) return Response.json({ error: 'A Markdown filename and content are required.' }, { status: 400 });
  const path = `decuba-tech-blog-astro/src/content/posts/${filename}`;
  const encoded = btoa(unescape(encodeURIComponent(body.content)));
  const response = await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${path}`, { method: 'PUT', headers: { Authorization: `Bearer ${context.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Publish ${filename}`, content: encoded, branch: 'main' }) });
  if (!response.ok) return Response.json({ error: 'GitHub could not save the post.' }, { status: response.status });
  return Response.json({ ok: true });
};
