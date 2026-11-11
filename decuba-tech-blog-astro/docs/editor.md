# Article editor

The admin uses the self-hosted Jodit 4.19.9 editor, bundled by Astro only on `/admin`. Its MIT notice is at `/licenses/jodit.txt`. No API key, remote editor CDN or new CMS is used.

## Formatting

The toolbar offers fonts and sizes, headings, bold/italic/underline/strikethrough, subscript/superscript, text and background colours, format copying, alignment, line spacing, numbered and bullet lists, links, images, dividers, special characters, and find/replace. On smaller screens, open the three-dot menu for additional controls.

- Insert a table with the grid button. Click a cell to open its menu for row/column insertion and removal, headers, cell backgrounds, splitting and merging. Select adjacent cells to merge.
- In lists, use Tab and Shift+Tab to change nesting. Alt+Up/Down moves the current item or paragraph. Enter twice leaves a list; Exit block or Ctrl+Enter continues after the whole list or table.
- Upload images through Image or paste a screenshot. These use the existing `/api/media` endpoint. Double-click an image to edit its description and dimensions.
- Preview opens the full shared article layout, including current unsaved content. Table wrappers scroll on small screens.

This is a web article editor. Word page layout, tracked changes, collaborative editing, and DOCX import/export are not included. Pasted Word-style HTML is cleaned and remains editable; exact Word document layout is not preserved.

## Storage and maintenance

Articles still use JSON `bodyHtml`, existing GitHub API routes, and browser draft key `decuba-post-draft-v2`. There is no bulk content migration. Existing content passes through normalization only on load/save. Editing-only attributes and locked contenteditable attributes are removed from saved HTML. Table wrappers retain the `data-table-scroll` attribute.

Admin entry point: `src/scripts/admin.js`, imported from `src/pages/admin.astro`. The former `public/admin.js` is replaced by a versioned Astro bundle. Publication and preview share `Article.astro` and `article-html.js`.

Run `npm run build` and `git diff --check`. Before changing the editor, check existing article text/images/links through load/save, mouse and keyboard editing inside formatted/nested lists, table cell navigation/merge/rows/columns, image uploads, draft restore, preview and a mocked publish payload. Never publish or delete real articles for a test.

## Drafts and About

Save draft saves an unfinished article to GitHub with published=false. Only a title and slug are required. Drafts are excluded from public article routes, listings and counts. The status badge says Draft, Published or Scheduled; the article picker marks drafts with [Draft]. Publish requires the description and article content, sets published=true and uses the publish date. Saving an existing published article as a draft asks for confirmation because it removes that article from the public site after deployment. Browser autosave remains a local recovery copy.

The About tab loads the latest content through /api/about. Edit the heading, meta description and plain text paragraphs, then use Publish About page. GitHub stores src/data/about.json; Cloudflare deploys the updated public page. The existing GITHUB_TOKEN and admin/API access protection are required. Failed saves retain the browser backup. No new credentials or database are required.
