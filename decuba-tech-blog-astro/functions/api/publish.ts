interface Env { GITHUB_TOKEN: string }
export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!context.env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  const body = await context.request.json<{ filename?: string; content?: string; deleteFilename?: string }>();
  const filename = (body.filename || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if ((!filename.endsWith('.md') && !filename.endsWith('.json')) || !body.content?.trim()) return Response.json({ error: 'A Markdown or JSON filename and content are required.' }, { status: 400 });
  const path = `decuba-tech-blog-astro/src/content/posts/${filename}`;
  const encoded = btoa(unescape(encodeURIComponent(body.content)));
  const headers = { Authorization: `Bearer ${context.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin' };
  const existing = await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${path}?ref=main`, { headers });
  const sha = existing.ok ? (await existing.json<{ sha: string }>()).sha : undefined;
  const response = await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${path}`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `${sha ? 'Update' : 'Publish'} ${filename}`, content: encoded, branch: 'main', ...(sha ? { sha } : {}) }) });
  if (!response.ok) return Response.json({ error: 'GitHub could not save the post.' }, { status: response.status });
  if (body.deleteFilename && body.deleteFilename !== filename) {
    const oldPath = `decuba-tech-blog-astro/src/content/posts/${body.deleteFilename.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const oldFile = await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${oldPath}?ref=main`, { headers });
    if (oldFile.ok) {
      const oldSha = (await oldFile.json<{ sha: string }>()).sha;
      await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${oldPath}`, { method: 'DELETE', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Migrate ${body.deleteFilename} to ${filename}`, sha: oldSha, branch: 'main' }) });
    }
  }
  return Response.json({ ok: true });
};
