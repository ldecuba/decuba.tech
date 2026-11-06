const inlineMarkdown = (value) => value.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');
const richText = (value) => { if (!value) return ''; const hasStructure=/<(h[1-6]|ul|ol|li|blockquote|img|hr|figure|pre|p|table|thead|tbody|tr|td|th)\b/i.test(value); if (/<[a-z][\s\S]*>/i.test(value) && hasStructure) return inlineMarkdown(value); const plain=value.replace(/<br\s*\/?>/gi,'\n').replace(/<\/div>\s*<div[^>]*>/gi,'\n\n').replace(/<\/?(?:div|p)[^>]*>/gi,''); return plain.split(/\n\s*\n/).map(block => { const lines=block.split('\n').map(line=>line.trim()).filter(Boolean); if(lines.every(line=>/^\s*[-*]\s+/.test(line))) return `<ul>${lines.map(line=>`<li>${line.replace(/^\s*[-*]\s+/,'')}</li>`).join('')}</ul>`; if(/^###\s+/.test(block)) return `<h3>${block.replace(/^###\s+/,'')}</h3>`; if(/^##\s+/.test(block)) return `<h2>${block.replace(/^##\s+/,'')}</h2>`; return `<p>${inlineMarkdown(block.replace(/\n/g,'<br />'))}</p>`; }).join(''); };
const repairListMarkup = (value) => value
  .replace(/<(ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi, (_, tag, attributes, inner) => {
    const closeTag = `<` + `/${tag}>`;
    if (/<li\b/i.test(inner)) {
      const listItems = inner.replace(/<li[^>]*>\s*(?:<br\s*\/?>|&nbsp;|\s)*<\/li>/gi, '');
      return listItems.trim() ? `<${tag}${attributes}>${listItems}${closeTag}` : '';
    }
    const listItems = inner.split(/\s+-\s+/).map((item) => item.trim()).filter(Boolean);
    return listItems.length ? `<${tag}${attributes}>${listItems.map((item) => `<li>${item}</li>`).join('')}${closeTag}` : '';
  })
  .replace(/<\/ul>\s*<ul[^>]*>/gi, '')
  .replace(/<\/ol>\s*<ol[^>]*>/gi, '');

export const renderArticleHtml = (value = "") => richText(repairListMarkup(value));
