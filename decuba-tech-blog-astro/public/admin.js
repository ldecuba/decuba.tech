const CATEGORY_IMAGES = {
  'Microsoft 365 Copilot': '/images/categories/microsoft-365-copilot.png',
  'Copilot Studio': '/images/categories/copilot-studio.png',
  'Microsoft Foundry': '/images/categories/microsoft-foundry.png',
  'Power Platform': '/images/categories/power-platform.png',
  'Azure AI': '/images/categories/azure-ai.png',
  AI: '/images/categories/ai.png',
};

const DRAFT_KEY = 'decuba-post-draft-v2';
const ABOUT_KEY = 'decuba-about-draft';
const $ = (id) => document.getElementById(id);
const editor = $('post-content');
const picker = $('existing-post');
let posts = [];
let editingFilename = '';
let slugWasEdited = false;
let imageWasEdited = false;
let dirty = false;
let autosaveTimer;

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90);
const escapeHtml = (value = '') => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const dateToday = () => new Date().toISOString().slice(0, 10);
const setStatus = (message, type = '') => {
  $('post-status').textContent = message;
  $('post-status').dataset.type = type;
};
const setBusy = (busy) => {
  $('publish-post').disabled = busy;
  $('delete-post').disabled = busy || !editingFilename;
  $('refresh-posts').disabled = busy;
};
const setDirty = () => {
  dirty = true;
  $('save-indicator').textContent = 'Unsaved changes';
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => saveDraft(true), 800);
};

const normalizeEditorHtml = (html = '') => {
  const box = document.createElement('div');
  box.innerHTML = html;
  box.querySelectorAll('script,style,iframe,object,embed').forEach((node) => node.remove());
  box.querySelectorAll('*').forEach((node) => [...node.attributes].forEach((attribute) => {
    if (attribute.name.startsWith('on') || attribute.name === 'class' || attribute.name === 'id') node.removeAttribute(attribute.name);
  }));
  box.querySelectorAll('img').forEach((image) => {
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    if (!image.style.width) image.style.width = '100%';
    image.loading = 'lazy';
  });
  return box.innerHTML.trim();
};

const markdownToHtml = (value = '') => value.split(/\n\s*\n/).map((block) => {
  const text = block.trim();
  if (!text) return '';
  const image = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (image) return `<img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" style="width:100%" />`;
  if (text.startsWith('<img')) return text;
  if (text.startsWith('### ')) return `<h3>${escapeHtml(text.slice(4))}</h3>`;
  if (text.startsWith('## ')) return `<h2>${escapeHtml(text.slice(3))}</h2>`;
  if (text.split('\n').every((line) => /^[-*]\s+/.test(line))) return `<ul>${text.split('\n').map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
  return `<p>${escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')}</p>`;
}).join('');

const parseMarkdown = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { bodyHtml: markdownToHtml(content) };
  const data = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(':');
    if (separator < 0) return;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim().replace(/^"|"$/g, '');
    if (value === 'true' || value === 'false') value = value === 'true';
    data[key] = value;
  });
  return { ...data, bodyHtml: markdownToHtml(match[2].trim()) };
};

const parsePost = (post) => post.filename.endsWith('.json') ? JSON.parse(post.content) : parseMarkdown(post.content);
const selectedCategories = () => [...$('post-categories').selectedOptions].map((option) => option.value);
const collect = () => {
  const primaryCategory = $('post-category').value;
  return {
    title: $('post-title').value.trim(),
    slug: slugify($('post-slug').value || $('post-title').value),
    date: $('post-date').value || dateToday(),
    category: primaryCategory,
    primaryCategory,
    categories: [...new Set([primaryCategory, ...selectedCategories()])],
    level: $('post-level').value,
    description: $('post-description').value.trim(),
    featureImage: $('post-image').value.trim() || CATEGORY_IMAGES[primaryCategory],
    featureImageAlt: $('post-image-alt').value.trim(),
    published: $('post-status-field').value === 'published',
    series: $('post-series').value.trim() || undefined,
    tags: $('post-tags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    seoTitle: $('post-seo-title').value.trim() || undefined,
    seoDescription: $('post-seo-description').value.trim() || undefined,
    bodyHtml: normalizeEditorHtml(editor.innerHTML),
  };
};

const updatePreview = () => {
  const data = collect();
  const preview = $('live-preview');
  preview.querySelector('.preview-meta').textContent = `${data.primaryCategory} · ${data.date || 'Today'} · ${data.level}`;
  preview.querySelector('.preview-image').src = data.featureImage || CATEGORY_IMAGES.AI;
  preview.querySelector('.preview-image').alt = data.featureImageAlt || '';
  preview.querySelector('h3').textContent = data.title || 'Post title';
  preview.querySelector('.preview-description').textContent = data.description || 'Your excerpt will appear here.';
  preview.querySelector('.preview-body').innerHTML = data.bodyHtml;
  $('feature-image-preview').src = data.featureImage || CATEGORY_IMAGES.AI;
  $('excerpt-count').textContent = `${$('post-description').value.length} / 320`;
  const words = (editor.innerText.match(/\S+/g) || []).length;
  $('word-count').textContent = `${words} ${words === 1 ? 'word' : 'words'} · ${Math.max(1, Math.ceil(words / 220))} min read`;
};

const applyPost = (data, filename = '') => {
  $('post-title').value = data.title || '';
  $('post-slug').value = data.slug || filename.replace(/\.(json|md)$/i, '') || slugify(data.title || '');
  $('post-date').value = String(data.date || dateToday()).slice(0, 10);
  $('post-category').value = data.primaryCategory || data.category || 'AI';
  [...$('post-categories').options].forEach((option) => option.selected = (data.categories || []).includes(option.value) && option.value !== $('post-category').value);
  $('post-level').value = data.level || 'Intermediate';
  $('post-description').value = data.description || '';
  $('post-image').value = data.featureImage || CATEGORY_IMAGES[$('post-category').value];
  $('post-image-alt').value = data.featureImageAlt || '';
  $('post-status-field').value = data.published === false ? 'draft' : 'published';
  $('post-series').value = data.series || '';
  $('post-tags').value = (data.tags || []).join(', ');
  $('post-seo-title').value = data.seoTitle || '';
  $('post-seo-description').value = data.seoDescription || '';
  editor.innerHTML = normalizeEditorHtml(data.bodyHtml || '');
  editingFilename = filename;
  slugWasEdited = Boolean(filename || data.slug);
  imageWasEdited = Boolean(data.featureImage);
  $('delete-post').disabled = !filename;
  $('publish-post').textContent = filename ? 'Update' : 'Publish';
  $('post-title').style.height = 'auto';
  $('post-title').style.height = `${$('post-title').scrollHeight}px`;
  updatePreview();
  dirty = false;
  $('save-indicator').textContent = 'All changes saved locally';
};

const resetPost = () => {
  picker.value = '';
  applyPost({ date: dateToday(), category: 'AI', primaryCategory: 'AI', categories: ['AI'], level: 'Intermediate', published: true, featureImage: CATEGORY_IMAGES.AI });
  slugWasEdited = false;
  imageWasEdited = false;
  setStatus('Ready for a new post.');
  $('post-title').focus();
};

const saveDraft = (automatic = false) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ filename: editingFilename, savedAt: new Date().toISOString(), post: collect() }));
  dirty = false;
  $('save-indicator').textContent = automatic ? 'Autosaved locally' : 'Draft saved in this browser';
  if (!automatic) setStatus('Browser draft saved.');
};

const refreshPosts = async (selectFilename = '') => {
  $('refresh-posts').disabled = true;
  try {
    const response = await fetch('/api/posts');
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Posts could not be loaded.');
    posts = result.posts || [];
    picker.replaceChildren(new Option('Create a new post', ''));
    posts.map((post) => ({ ...post, data: parsePost(post) }))
      .sort((a, b) => String(b.data.date || '').localeCompare(String(a.data.date || '')))
      .forEach((post) => picker.add(new Option(`${post.data.published === false ? '[Draft] ' : ''}${post.data.title || post.filename}`, post.filename)));
    if (selectFilename && posts.some((post) => post.filename === selectFilename)) picker.value = selectFilename;
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    $('refresh-posts').disabled = false;
  }
};

const uploadImage = async (file) => {
  if (!file?.type.startsWith('image/')) throw new Error('Choose a valid image file.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Images must be smaller than 8 MB.');
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.readAsDataURL(file);
  });
  const response = await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, dataUrl }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Image upload failed.');
  return { path: result.path, preview: dataUrl };
};

const insertHtml = (html) => {
  editor.focus();
  document.execCommand('insertHTML', false, html);
  setDirty();
  updatePreview();
};

const publish = async () => {
  const data = collect();
  if (!data.title) return setStatus('Add a title before saving.', 'error');
  if (!data.slug) return setStatus('Add a valid slug before saving.', 'error');
  if (!data.description) return setStatus('Add a short description before saving.', 'error');
  if (!data.bodyHtml || !editor.innerText.trim()) return setStatus('Add article content before saving.', 'error');
  const filename = `${data.slug}.json`;
  setBusy(true);
  setStatus(data.published ? 'Publishing to GitHub…' : 'Saving draft to GitHub…');
  try {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, deleteFilename: editingFilename && editingFilename !== filename ? editingFilename : undefined, content: JSON.stringify(data, null, 2) }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Publishing failed (${response.status}).`);
    editingFilename = filename;
    localStorage.removeItem(DRAFT_KEY);
    dirty = false;
    $('save-indicator').textContent = 'Saved to GitHub';
    $('publish-post').textContent = 'Update';
    setStatus(data.published ? 'Published. Cloudflare will deploy the update shortly.' : 'Draft saved to GitHub. It is not visible publicly.', 'success');
    await refreshPosts(filename);
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    setBusy(false);
  }
};

Object.keys(CATEGORY_IMAGES).forEach((category) => {
  $('post-category').add(new Option(category, category));
  $('post-categories').add(new Option(category, category));
});

document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item === tab));
  document.querySelectorAll('[data-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.tab));
}));

document.querySelectorAll('[data-command]').forEach((button) => button.addEventListener('click', () => {
  editor.focus();
  document.execCommand(button.dataset.command, false);
  setDirty();
  updatePreview();
}));

$('block-format').addEventListener('change', (event) => {
  editor.focus();
  document.execCommand('formatBlock', false, event.target.value);
  event.target.value = 'p';
  setDirty();
  updatePreview();
});

$('insert-link').addEventListener('click', () => {
  const url = window.prompt('Link URL (https://…)');
  if (!url) return;
  editor.focus();
  document.execCommand('createLink', false, url);
  editor.querySelectorAll('a').forEach((link) => {
    if (link.href === url || link.getAttribute('href') === url) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  });
  setDirty();
  updatePreview();
});

$('insert-inline-image').addEventListener('click', () => $('inline-image-file').click());
$('inline-image-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setStatus('Uploading article image…');
  try {
    const image = await uploadImage(file);
    const alt = window.prompt('Image description (alt text)', file.name.replace(/\.[^.]+$/, '')) || '';
    insertHtml(`<figure><img src="${image.path}" alt="${escapeHtml(alt)}" style="width:100%;height:auto" /><figcaption>${escapeHtml(alt)}</figcaption></figure><p><br></p>`);
    setStatus('Image uploaded and inserted.');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    event.target.value = '';
  }
});

editor.addEventListener('paste', async (event) => {
  const imageItem = [...(event.clipboardData?.items || [])].find((item) => item.type.startsWith('image/'));
  if (!imageItem) return;
  event.preventDefault();
  setStatus('Uploading pasted image…');
  try {
    const file = imageItem.getAsFile();
    const image = await uploadImage(new File([file], `pasted-${Date.now()}.png`, { type: file.type }));
    insertHtml(`<img src="${image.path}" alt="Pasted screenshot" style="width:100%;height:auto" /><p><br></p>`);
    setStatus('Pasted image uploaded and inserted.');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

$('post-title').addEventListener('input', () => {
  $('post-title').style.height = 'auto';
  $('post-title').style.height = `${$('post-title').scrollHeight}px`;
  if (!slugWasEdited) $('post-slug').value = slugify($('post-title').value);
  setDirty();
  updatePreview();
});
$('post-slug').addEventListener('input', () => { slugWasEdited = true; $('post-slug').value = slugify($('post-slug').value); setDirty(); });
$('reset-slug').addEventListener('click', () => { slugWasEdited = false; $('post-slug').value = slugify($('post-title').value); setDirty(); });
$('post-category').addEventListener('change', () => {
  if (!imageWasEdited) $('post-image').value = CATEGORY_IMAGES[$('post-category').value];
  [...$('post-categories').options].forEach((option) => { if (option.value === $('post-category').value) option.selected = false; });
  setDirty();
  updatePreview();
});
$('use-category-image').addEventListener('click', () => { imageWasEdited = false; $('post-image').value = CATEGORY_IMAGES[$('post-category').value]; setDirty(); updatePreview(); });
$('post-image').addEventListener('input', () => { imageWasEdited = true; setDirty(); updatePreview(); });
$('post-image-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setStatus('Uploading featured image…');
  try {
    const image = await uploadImage(file);
    $('post-image').value = image.path;
    $('feature-image-preview').src = image.preview;
    imageWasEdited = true;
    setDirty();
    updatePreview();
    setStatus('Featured image uploaded.');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    event.target.value = '';
  }
});

['post-date', 'post-categories', 'post-level', 'post-description', 'post-image-alt', 'post-status-field', 'post-series', 'post-tags', 'post-seo-title', 'post-seo-description'].forEach((id) => {
  $(id).addEventListener('input', () => { setDirty(); updatePreview(); });
  $(id).addEventListener('change', () => { setDirty(); updatePreview(); });
});
editor.addEventListener('input', () => { setDirty(); updatePreview(); });

picker.addEventListener('change', () => {
  if (!picker.value) return resetPost();
  try {
    const post = posts.find((item) => item.filename === picker.value);
    if (!post) throw new Error('The selected post is unavailable.');
    applyPost(parsePost(post), post.filename);
    setStatus('Post loaded. Changes will update the existing post.');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

$('new-post').addEventListener('click', () => {
  if (!dirty || window.confirm('Discard the unsaved changes and start a new post?')) resetPost();
});
$('refresh-posts').addEventListener('click', () => refreshPosts(editingFilename));
$('save-post').addEventListener('click', () => saveDraft(false));
$('publish-post').addEventListener('click', publish);
$('preview-post').addEventListener('click', () => $('live-preview').scrollIntoView({ behavior: 'smooth', block: 'start' }));
$('toggle-preview-size').addEventListener('click', () => {
  const compact = $('live-preview').classList.toggle('mobile-preview');
  $('toggle-preview-size').textContent = compact ? 'Desktop' : 'Mobile';
});
$('delete-post').addEventListener('click', async () => {
  if (!editingFilename || !window.confirm('Permanently delete this post from GitHub?')) return;
  setBusy(true);
  setStatus('Deleting post…');
  try {
    const response = await fetch('/api/publish', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: editingFilename }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Delete failed.');
    await refreshPosts();
    resetPost();
    setStatus('Post deleted. Cloudflare will update the site shortly.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    setBusy(false);
  }
});

$('save-about').addEventListener('click', () => {
  localStorage.setItem(ABOUT_KEY, $('about-content').value);
  $('about-status').textContent = 'About page draft saved in this browser.';
});
$('download-about').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([$('about-content').value], { type: 'text/plain' }));
  link.download = 'about-copy.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});
window.addEventListener('beforeunload', (event) => { if (dirty) event.preventDefault(); });

const aboutDraft = localStorage.getItem(ABOUT_KEY);
if (aboutDraft) $('about-content').value = aboutDraft;
resetPost();
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft) {
  try {
    const draft = JSON.parse(savedDraft);
    if (window.confirm(`Restore the browser draft saved ${new Date(draft.savedAt).toLocaleString()}?`)) applyPost(draft.post, draft.filename || '');
  } catch {}
}
refreshPosts(editingFilename);
