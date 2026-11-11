interface Env { GITHUB_TOKEN: string }
const url = 'https://api.github.com/repos/ldecuba/decuba.tech/contents/decuba-tech-blog-astro/src/data/about.json';
const headersFor = (env: Env) => ({ Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin' });
const decode = (value: string) => new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, '')), char => char.charCodeAt(0)));
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  try {
    const response = await fetch(`${url}?ref=main`, { headers: headersFor(env) });
    if (!response.ok) return Response.json({ error: 'GitHub could not load the About page.' }, { status: response.status });
    const file = await response.json<{ content: string }>();
    return Response.json(JSON.parse(decode(file.content)), { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'About page could not be loaded.' }, { status: 502 }); }
};
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });
  let data;
  try { data = await request.json<{ title?: unknown; description?: unknown; body?: unknown }>(); }
  catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  if (['title', 'description', 'body'].some(key => typeof data[key] !== 'string' || !data[key].trim()) || data.title.length > 300 || data.description.length > 500 || data.body.length > 100000) return Response.json({ error: 'A heading, description and page text within the length limits are required.' }, { status: 400 });
  try {
    const headers = headersFor(env);
    const existing = await fetch(`${url}?ref=main`, { headers });
    if (!existing.ok) return Response.json({ error: 'GitHub could not load the current About page.' }, { status: existing.status });
    const { sha } = await existing.json<{ sha: string }>();
    const text = JSON.stringify({ title: data.title.trim(), description: data.description.trim(), body: data.body.trim() }, null, 2) + '\n';
    const content = btoa(Array.from(new TextEncoder().encode(text), byte => String.fromCharCode(byte)).join(''));
    const response = await fetch(url, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Update About page', content, sha, branch: 'main' }) });
    if (!response.ok) return Response.json({ error: 'GitHub could not save the About page. Reload and try again.' }, { status: response.status });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: 'About page could not be saved.' }, { status: 502 }); }
};
