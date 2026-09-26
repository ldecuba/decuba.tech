interface Env { GITHUB_TOKEN: string }

const MIME_EXTENSIONS: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!context.env.GITHUB_TOKEN) return Response.json({ error: 'Publishing is not configured yet.' }, { status: 503 });

  const body = await context.request.json<{ filename?: string; dataUrl?: string }>();
  const match = body.dataUrl?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)$/);
  if (!match || !MIME_EXTENSIONS[match[1]]) return Response.json({ error: 'A supported image is required.' }, { status: 400 });

  const approximateBytes = Math.floor(match[2].length * 0.75);
  if (approximateBytes > 8 * 1024 * 1024) return Response.json({ error: 'Images must be smaller than 8 MB.' }, { status: 413 });

  const originalName = (body.filename || 'image').replace(/\.[^.]+$/, '');
  const safeName = originalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'image';
  const filename = `${Date.now()}-${safeName}.${MIME_EXTENSIONS[match[1]]}`;
  const repositoryPath = `decuba-tech-blog-astro/public/images/uploads/${filename}`;
  const headers = { Authorization: `Bearer ${context.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'decuba-tech-admin' };
  const response = await fetch(`https://api.github.com/repos/ldecuba/decuba.tech/contents/${repositoryPath}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Upload ${filename}`, content: match[2], branch: 'main' }),
  });

  if (!response.ok) return Response.json({ error: 'GitHub could not upload the image.' }, { status: response.status });
  return Response.json({ ok: true, path: `/images/uploads/${filename}` });
};
