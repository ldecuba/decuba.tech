import { Jodit } from 'jodit';
import 'jodit/es2021/jodit.min.css';
import 'jodit/esm/plugins/add-new-line/add-new-line.js';
import 'jodit/esm/plugins/clean-html/clean-html.js';
import 'jodit/esm/plugins/clipboard/clipboard.js';
import 'jodit/esm/plugins/copy-format/copy-format.js';
import 'jodit/esm/plugins/focus/focus.js';
import 'jodit/esm/plugins/hr/hr.js';
import 'jodit/esm/plugins/image-properties/image-properties.js';
import 'jodit/esm/plugins/image-caption/image-caption.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/justify/justify.js';
import 'jodit/esm/plugins/key-arrow-outside/key-arrow-outside.js';
import 'jodit/esm/plugins/line-height/line-height.js';
import 'jodit/esm/plugins/mobile/mobile.js';
import 'jodit/esm/plugins/paste/paste.js';
import 'jodit/esm/plugins/paste-from-word/paste-from-word.js';
import 'jodit/esm/plugins/resize-cells/resize-cells.js';
import 'jodit/esm/plugins/resize-handler/resize-handler.js';
import 'jodit/esm/plugins/resizer/resizer.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/select-cells/select-cells.js';
import 'jodit/esm/plugins/spellcheck/spellcheck.js';
import 'jodit/esm/plugins/symbols/symbols.js';
import 'jodit/esm/plugins/tab/tab.js';
import 'jodit/esm/plugins/table-keyboard-navigation/table-keyboard-navigation.js';

const CATEGORY_IMAGES = {
  AI: '/images/categories/ai.png',
  'Microsoft Copilot': '/images/categories/microsoft-365-copilot.png',
  'Copilot Studio': '/images/categories/copilot-studio.png',
  'Microsoft Foundry': '/images/categories/microsoft-foundry.png',
  'Azure AI': '/images/categories/azure-ai.png',
  'Azure OpenAI': '/images/categories/azure-ai.png',
  'AI Builder': '/images/categories/power-platform.png',
  'GitHub Copilot': '/images/categories/microsoft-365-copilot.png',
  'Power Platform': '/images/categories/power-platform.png',
  'Power Apps': '/images/categories/power-platform.png',
  'Power Automate': '/images/categories/power-platform.png',
  'Power BI': '/images/categories/power-platform.png',
  'Power Pages': '/images/categories/power-platform.png',
  Dataverse: '/images/categories/power-platform.png',
  'Power Fx': '/images/categories/power-platform.png',
  'Microsoft 365': '/images/categories/microsoft-365-copilot.png',
  Teams: '/images/categories/microsoft-365-copilot.png',
  SharePoint: '/images/categories/microsoft-365-copilot.png',
  OneDrive: '/images/categories/microsoft-365-copilot.png',
  Outlook: '/images/categories/microsoft-365-copilot.png',
  Exchange: '/images/categories/microsoft-365-copilot.png',
  Excel: '/images/categories/microsoft-365-copilot.png',
  Word: '/images/categories/microsoft-365-copilot.png',
  PowerPoint: '/images/categories/microsoft-365-copilot.png',
  Loop: '/images/categories/microsoft-365-copilot.png',
  Planner: '/images/categories/microsoft-365-copilot.png',
  Lists: '/images/categories/microsoft-365-copilot.png',
  Forms: '/images/categories/microsoft-365-copilot.png',
  Viva: '/images/categories/microsoft-365-copilot.png',
  Intune: '/images/categories/microsoft-365-copilot.png',
  Azure: '/images/categories/azure-ai.png',
  'Microsoft Fabric': '/images/categories/azure-ai.png',
  'Azure DevOps': '/images/categories/azure-ai.png',
  GitHub: '/images/categories/azure-ai.png',
  'Microsoft Graph': '/images/categories/azure-ai.png',
  'Microsoft Entra': '/images/categories/azure-ai.png',
  'Microsoft Security': '/images/categories/azure-ai.png',
  Windows: '/images/categories/microsoft-365-copilot.png',
};

const CATEGORY_GROUPS = {
  'AI and Copilot': ['AI', 'Microsoft Copilot', 'Copilot Studio', 'Microsoft Foundry', 'Azure AI', 'Azure OpenAI', 'AI Builder', 'GitHub Copilot'],
  'Power Platform': ['Power Platform', 'Power Apps', 'Power Automate', 'Power BI', 'Power Pages', 'Dataverse', 'Power Fx'],
  'Microsoft 365': ['Microsoft 365', 'Teams', 'SharePoint', 'OneDrive', 'Outlook', 'Exchange', 'Excel', 'Word', 'PowerPoint', 'Loop', 'Planner', 'Lists', 'Forms', 'Viva', 'Intune'],
  'Azure and developer tools': ['Azure', 'Microsoft Fabric', 'Azure DevOps', 'GitHub', 'Microsoft Graph', 'Microsoft Entra', 'Microsoft Security', 'Windows'],
};

const DRAFT_KEY = 'decuba-post-draft-v2';
const ABOUT_KEY = 'decuba-about-draft';
const $ = (id) => document.getElementById(id);
const rich = Jodit.make('#post-content', {
  language: 'en',
  toolbar: '#article-toolbar',
  toolbarSticky: false,
  toolbarAdaptive: true,
  height: 'auto', minHeight: 560,
  statusbar: false,
  spellcheck: true,
  enter: 'p',
  cleanHTML: { denyTags: 'script,style,iframe,object,embed' },
  defaultFontSizePoints: 'px',
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_as_html',
  processPasteFromWord: true,
  imageDefaultWidth: '100%',
  image: { openOnDblClick: true, editSrc: false, editClass: false, editId: false, useImageEditor: false },
  buttons: [
    'undo', 'redo', '|', 'paragraph', 'font', 'fontsize', '|',
    'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', '|',
    'brush', 'copyformat', 'eraser', '|', 'ul', 'ol', 'outdent', 'indent', '|',
    'align', 'lineHeight', '|', 'table', 'link', 'uploadArticleImage', 'hr', 'symbols', '|',
    'moveBlockUp', 'moveBlockDown', 'paragraphAfter', 'find'
  ],
  buttonsMD: ['undo', 'redo', '|', 'paragraph', 'font', 'fontsize', '|', 'bold', 'italic', 'underline', 'brush', '|', 'ul', 'ol', 'outdent', 'indent', 'table', 'link', 'uploadArticleImage', '|', 'moveBlockUp', 'moveBlockDown', 'paragraphAfter', 'dots'],
  buttonsSM: ['undo', 'redo', '|', 'bold', 'italic', 'ul', 'ol', 'table', 'paragraphAfter', 'dots'],
  buttonsXS: ['undo', 'bold', 'ul', 'table', 'paragraphAfter', 'dots'],
  controls: {
    uploadArticleImage: { text: 'Image', tooltip: 'Upload article image', exec: j => { j.s.save(); $('inline-image-file').click(); } },
    moveBlockUp: { text: 'Move up', tooltip: 'Move paragraph or list item up (Alt+Up)', exec: j => moveBlock(j, -1) },
    moveBlockDown: { text: 'Move down', tooltip: 'Move paragraph or list item down (Alt+Down)', exec: j => moveBlock(j, 1) },
    paragraphAfter: { text: 'Exit block', tooltip: 'Continue after list or table (Ctrl+Enter)', exec: j => paragraphAfter(j) },
    paragraph: { list: { p: 'Paragraph', h2: 'Heading 2', h3: 'Heading 3', h4: 'Heading 4', blockquote: 'Quote', pre: 'Code block' } }
  }
});
const editor = rich.editor;
editor.id = 'article-body-editor';
editor.classList.add('rich-editor');
editor.setAttribute('aria-label', 'Article content');
// Move controls use the actual caret, including inside a nested list or table.
function currentBlock(j) {
  const node = j.s.current();
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  if (!element || !j.editor.contains(element)) return null;
  const item = element.closest('li');
  if (item) return item;
  let block = element;
  while (block.parentElement && block.parentElement !== j.editor) block = block.parentElement;
  return block === j.editor ? null : block;
}
function moveBlock(j, direction) {
  const block = currentBlock(j);
  const sibling = direction < 0 ? block?.previousElementSibling : block?.nextElementSibling;
  if (!block || !sibling) return;
  j.s.save();
  if (direction < 0) sibling.before(block); else sibling.after(block);
  j.s.restore();
  j.synchronizeValues();
}
function paragraphAfter(j) {
  let block = currentBlock(j);
  if (!block) return;
  while (block.parentElement && block.parentElement !== j.editor) block = block.parentElement;
  const paragraph = document.createElement('p');
  paragraph.append(document.createElement('br'));
  block.after(paragraph);
  j.s.setCursorIn(paragraph);
  j.synchronizeValues();
}
const picker = $('existing-post');
let posts = [];
let editingFilename = '';
let slugWasEdited = false;
let imageWasEdited = false;
let featurePreviewUrl = '';
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
  $('save-post').disabled = busy;
  picker.disabled = busy;
  $('new-post').disabled = busy;
  $('delete-post').disabled = busy || !editingFilename;
  $('refresh-posts').disabled = busy;
};
const setDirty = () => {
  dirty = true;
  $('save-indicator').textContent = 'Unsaved changes';
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => saveDraft(true), 800);
};

const normalizeEditorHtml = (html = '', usePublishedPaths = true) => {
  const box = document.createElement('div');
  box.innerHTML = html;
  box.querySelectorAll('script,style,iframe,object,embed').forEach((node) => node.remove());
  const textWalker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  const markdownNodes = [];
  while (textWalker.nextNode()) {
    if (!textWalker.currentNode.parentElement?.closest('pre, code') && /\*\*[^*]+\*\*|\*[^*\n]+\*/.test(textWalker.currentNode.nodeValue || '')) markdownNodes.push(textWalker.currentNode);
  }
  markdownNodes.forEach((node) => {
    const holder = document.createElement('span');
    holder.innerHTML = escapeHtml(node.nodeValue || '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    node.replaceWith(...holder.childNodes);
  });
  box.querySelectorAll('*').forEach((node) => [...node.attributes].forEach((attribute) => {
    if (attribute.name.startsWith('on') || attribute.name.startsWith('data-jodit') || ['class', 'id', 'contenteditable', 'draggable'].includes(attribute.name)) node.removeAttribute(attribute.name);
  }));
  box.querySelectorAll('[style]').forEach(node => {
    for (const property of ['user-select', '-webkit-user-select', 'pointer-events', '-webkit-user-modify']) node.style.removeProperty(property);
  });
  box.querySelectorAll('img').forEach((image) => {
    if (usePublishedPaths && image.dataset.publishedSrc) {
      image.src = image.dataset.publishedSrc;
      image.removeAttribute('data-published-src');
    }
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    if (!image.style.width) image.style.width = '100%';
    image.loading = 'lazy';
  });
  box.querySelectorAll('table').forEach(table => {
    if (!table.parentElement?.hasAttribute('data-table-scroll')) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-table-scroll', '');
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable table');
      wrapper.tabIndex = 0;
      table.replaceWith(wrapper);
      wrapper.append(table);
    }
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
    bodyHtml: normalizeEditorHtml(rich.value),
  };
};

const updatePreview = () => {
  const data = collect();
  $('feature-image-preview').src = featurePreviewUrl || data.featureImage || CATEGORY_IMAGES.AI;
  $('excerpt-count').textContent = `${$('post-description').value.length} / 320`;
  const words = (editor.innerText.match(/\S+/g) || []).length;
  $('word-count').textContent = `${words} ${words === 1 ? 'word' : 'words'} Â· ${Math.max(1, Math.ceil(words / 220))} min read`;
};

const syncPublicationState = (data) => {
  const state = !data.published ? 'draft' : String(data.date).slice(0, 10) > dateToday() ? 'scheduled' : 'published';
  $('post-publication-state').dataset.state = state;
  $('post-publication-state').textContent = { draft: 'Draft · not public', scheduled: 'Scheduled · not public yet', published: 'Published' }[state];
  $('post-status-field').value = data.published ? 'published' : 'draft';
  $('publish-post').textContent = state === 'published' ? 'Update published post' : 'Publish';
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
  rich.value = normalizeEditorHtml(data.bodyHtml || '');
  rich.history.clear();
  featurePreviewUrl = '';
  editingFilename = filename;
  slugWasEdited = Boolean(filename || data.slug);
  imageWasEdited = Boolean(data.featureImage);
  $('delete-post').disabled = !filename;
  syncPublicationState(data);
  $('post-title').style.height = 'auto';
  $('post-title').style.height = `${$('post-title').scrollHeight}px`;
  updatePreview();
  dirty = false;
  $('save-indicator').textContent = 'All changes saved locally';
};

const resetPost = () => {
  picker.value = '';
  applyPost({ date: dateToday(), category: 'AI', primaryCategory: 'AI', categories: ['AI'], level: 'Intermediate', published: false, featureImage: CATEGORY_IMAGES.AI });
  slugWasEdited = false;
  imageWasEdited = false;
  featurePreviewUrl = '';
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

// Measure wrapped action rows rather than assuming one fixed toolbar offset.
const actions = document.querySelector('.sticky-actions');
const toolbar = $('article-toolbar');
const measureToolbar = () => {
  const top = 46 + actions.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--editor-toolbar-top', `${top}px`);
  document.documentElement.style.setProperty('--editor-scroll-top', `${top + toolbar.getBoundingClientRect().height + 16}px`);
};
const toolbarObserver = new ResizeObserver(measureToolbar);
toolbarObserver.observe(actions);
toolbarObserver.observe(toolbar);
measureToolbar();

const insertHtml = (html) => {
  rich.s.restore();
  rich.s.insertHTML(html);
  rich.synchronizeValues();
};

const publish = async (asDraft = false) => {
  const data = collect();
  data.published = !asDraft;
  if (asDraft) {
    const existing = posts.find(post => post.filename === editingFilename);
    if (existing && parsePost(existing).published !== false && !window.confirm('Saving as a draft will remove this published article from the public site after deployment. Continue?')) return;
    data.published = false;
  }
  if (!data.title) return setStatus('Add a title before saving.', 'error');
  if (!data.slug) return setStatus('Add a valid slug before saving.', 'error');
  if (data.published && !data.description) return setStatus('Add a short description before saving.', 'error');
  if (data.published && (!data.bodyHtml || !editor.innerText.trim())) return setStatus('Add article content before saving.', 'error');
  const filename = `${data.slug}.json`;
  setBusy(true);
  setStatus(data.published ? 'Publishing to GitHubâ€¦' : 'Saving draft to GitHubâ€¦');
  try {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, deleteFilename: editingFilename && editingFilename !== filename ? editingFilename : undefined, content: JSON.stringify(data, null, 2) }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Publishing failed (${response.status}).`);
    editingFilename = filename;
    clearTimeout(autosaveTimer);
    syncPublicationState(data);
    localStorage.removeItem(DRAFT_KEY);
    dirty = false;
    $('save-indicator').textContent = 'Saved to GitHub';
    setStatus(data.published ? 'Published. Cloudflare will deploy the update shortly.' : 'Draft saved to GitHub. It is not visible publicly.', 'success');
    await refreshPosts(filename);
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    setBusy(false);
  }
};

const addCategoryOptions = (select) => {
  Object.entries(CATEGORY_GROUPS).forEach(([label, categories]) => {
    const group = document.createElement('optgroup');
    group.label = label;
    categories.forEach((category) => group.append(new Option(category, category)));
    select.append(group);
  });
};

addCategoryOptions($('post-category'));
addCategoryOptions($('post-categories'));

document.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach((item) => {
    item.classList.toggle('active', item === tab);
    if (item === tab) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  const isPost = tab.dataset.tab === 'post';
  $('workspace-section').textContent = isPost ? 'Posts' : 'About page';
  $('workspace-title').textContent = isPost ? 'Post editor' : 'About page';
  $('workspace-description').textContent = isPost ? 'Write, review and publish your next article.' : 'Edit your introduction and publish it to your website.';
  $('new-post').hidden = !isPost;
  $('save-indicator').hidden = !isPost;
  document.querySelectorAll('[data-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.tab));
}));

$('inline-image-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setStatus('Uploading article imageâ€¦');
  try {
    const image = await uploadImage(file);
    const alt = window.prompt('Image description (alt text)', file.name.replace(/\.[^.]+$/, '')) || '';
    insertHtml(`<figure><img src="${image.preview}" data-published-src="${image.path}" alt="${escapeHtml(alt)}" style="width:100%;height:auto" /><figcaption>${escapeHtml(alt)}</figcaption></figure><p><br></p>`);
    setStatus('Image uploaded and inserted.');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    event.target.value = '';
  }
});

// Pasted fragments must not bring locked editing regions into the editor.
rich.e.on('beforePasteInsert', html => typeof html === 'string' ? normalizeEditorHtml(html, false) : html);
rich.e.on('paste', (event) => {
  const imageItem = [...(event.clipboardData?.items || [])].find(item => item.type.startsWith('image/'));
  if (!imageItem) return;
  event.preventDefault();
  rich.s.save();
  uploadPastedImage(imageItem.getAsFile());
  return false;
});
async function uploadPastedImage(file) {
  setStatus('Uploading pasted imageâ€¦');
  try {
    const image = await uploadImage(new File([file], `pasted-${Date.now()}.png`, { type: file.type }));
    insertHtml(`<img src="${image.preview}" data-published-src="${image.path}" alt="Pasted screenshot" style="width:100%;height:auto" /><p><br></p>`);
    setStatus('Pasted image uploaded and inserted.');
  } catch (error) { setStatus(error.message, 'error'); }
}

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
  featurePreviewUrl = '';
  [...$('post-categories').options].forEach((option) => { if (option.value === $('post-category').value) option.selected = false; });
  setDirty();
  updatePreview();
});
$('use-category-image').addEventListener('click', () => { imageWasEdited = false; featurePreviewUrl = ''; $('post-image').value = CATEGORY_IMAGES[$('post-category').value]; setDirty(); updatePreview(); });
$('post-image').addEventListener('input', () => { imageWasEdited = true; featurePreviewUrl = ''; setDirty(); updatePreview(); });
$('post-image-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setStatus('Uploading featured imageâ€¦');
  try {
    const image = await uploadImage(file);
    $('post-image').value = image.path;
    featurePreviewUrl = image.preview;
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
rich.e.on('keydown', (event) => {
  if (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault(); moveBlock(rich, event.key === 'ArrowUp' ? -1 : 1); return false;
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault(); paragraphAfter(rich); return false;
  }
});

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
$('save-post').addEventListener('click', () => publish(true));
$('publish-post').addEventListener('click', () => publish());
const previewDialog = $('page-preview');
const previewFrame = $('preview-frame');
const sendPagePreview = () => {
  if (!previewDialog.open) return;
  previewFrame.contentWindow.postMessage({ type: 'decuba-preview', post: { ...collect(), bodyHtml: normalizeEditorHtml(rich.value, false) } }, location.origin);
};
window.addEventListener('message', (event) => {
  if (event.origin === location.origin && event.source === previewFrame.contentWindow && event.data?.type === 'decuba-preview-ready') sendPagePreview();
});
$('preview-post').addEventListener('click', () => {
  previewDialog.showModal();
  previewFrame.src = '/admin-preview/';
});
$('close-preview').addEventListener('click', () => previewDialog.close());
previewDialog.addEventListener('close', () => $('preview-post').focus({ preventScroll: true }));
$('toggle-preview-size').addEventListener('click', () => {
  const compact = previewDialog.classList.toggle('mobile-preview');
  $('toggle-preview-size').textContent = compact ? 'Desktop' : 'Mobile';
});
$('delete-post').addEventListener('click', async () => {
  if (!editingFilename || !window.confirm('Permanently delete this post from GitHub?')) return;
  setBusy(true);
  setStatus('Deleting postâ€¦');
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

let aboutDirty = false;
let aboutLoaded = false;
const collectAbout = () => ({ title: $('about-title').value.trim(), description: $('about-description').value.trim(), body: $('about-content').value.trim() });
for (const id of ['about-title', 'about-description', 'about-content']) $(id).addEventListener('input', () => {
  aboutDirty = true;
  localStorage.setItem(ABOUT_KEY, JSON.stringify(collectAbout()));
  $('about-status').textContent = 'Unsaved changes. Browser backup saved.';
});
const loadAbout = async () => {
  try {
    const response = await fetch('/api/about');
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'About page could not be loaded.');
    if (!aboutDirty && !localStorage.getItem(ABOUT_KEY)) {
      $('about-title').value = result.title;
      $('about-description').value = result.description;
      $('about-content').value = result.body;
    }
    aboutLoaded = true;
  } catch (error) { $('about-status').textContent = error.message; }
};
$('save-about').addEventListener('click', async () => {
  const data = collectAbout();
  if (!aboutLoaded) { $('about-status').textContent = 'Load the current About page before publishing. Reload the editor to retry.'; return; }
  if (!data.title || !data.description || !data.body) { $('about-status').textContent = 'Add a heading, description and page text.'; return; }
  $('save-about').disabled = true;
  $('about-status').textContent = 'Saving About page to GitHub.';
  const snapshot = JSON.stringify(data);
  try {
    const response = await fetch('/api/about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: snapshot });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'About page could not be saved.');
    if (JSON.stringify(collectAbout()) === snapshot) {
      aboutDirty = false;
      localStorage.removeItem(ABOUT_KEY);
    }
    $('about-status').textContent = aboutDirty ? 'Saved to GitHub. Newer edits are still unsaved.' : 'About page saved to GitHub. Cloudflare will deploy the update shortly.';
  } catch (error) { $('about-status').textContent = error.message; }
  finally { $('save-about').disabled = false; }
});
$('download-about').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([$('about-content').value], { type: 'text/plain' }));
  link.download = 'about-copy.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});
window.addEventListener('beforeunload', (event) => { if (dirty || aboutDirty) event.preventDefault(); });

const aboutDraft = localStorage.getItem(ABOUT_KEY);
if (aboutDraft) {
  try {
    const data = JSON.parse(aboutDraft);
    $('about-title').value = data.title;
    $('about-description').value = data.description;
    $('about-content').value = data.body;
  } catch { $('about-content').value = aboutDraft; }
  aboutDirty = true;
}
loadAbout();
resetPost();
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft) {
  try {
    const draft = JSON.parse(savedDraft);
    if (window.confirm(`Restore the browser draft saved ${new Date(draft.savedAt).toLocaleString()}?`)) applyPost(draft.post, draft.filename || '');
  } catch {}
}
refreshPosts(editingFilename);

// The styled upload label also supports keyboard activation.
document.querySelectorAll('.file-button[role="button"]').forEach((label) => label.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); label.querySelector('input[type="file"]').click(); }
}));

rich.e.on('change', () => { setDirty(); updatePreview(); });
