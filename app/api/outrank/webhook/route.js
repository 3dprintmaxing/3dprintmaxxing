import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

function slug(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function markdownToHtml(markdown) {
  return String(markdown || '').split(/\n\s*\n/).map((block) => {
    const text = escapeHtml(block.trim()).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    if (!text) return '';
    if (text.startsWith('### ')) return `<h3>${text.slice(4)}</h3>`;
    if (text.startsWith('## ')) return `<h2>${text.slice(3)}</h2>`;
    if (text.startsWith('# ')) return `<h1>${text.slice(2)}</h1>`;
    return `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function articlePage(article) {
  const title = escapeHtml(article.title || '3D Printing Article');
  const description = escapeHtml(article.meta_description || '3D printing notes, projects, and practical tips from 3dprintmaxxing.');
  const body = article.content_html ? String(article.content_html) : markdownToHtml(article.content_markdown);
  const canonical = `https://3dprintmaxxing.vercel.app/en/blog/${slug(article.slug || article.title)}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — 3dprintmaxxing</title><meta name="description" content="${description}"><link rel="stylesheet" href="/styles.css"><link rel="icon" href="/assets/favicon.ico"><link rel="canonical" href="${canonical}"></head><body><main class="wrap article"><p><a href="/en/blog">← Back to the blog</a></p><article><h1>${title}</h1>${body}</article><p><a href="/en/blog">Back to the blog</a></p></main><script src="/script.js" defer></script></body></html>`;
}

export async function POST(request) {
  const expected = process.env.OUTRANK_WEBHOOK_TOKEN;
  const authorization = request.headers.get('authorization') || '';
  if (!expected || authorization !== `Bearer ${expected}`) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let payload;
  try { payload = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const article = payload.data?.article || payload.article || payload.data;
  if (!article || payload.event_type === 'delete_article') return Response.json({ received: true, processed: 0 });
  const articleSlug = slug(article.slug || article.title);
  if (!articleSlug) return Response.json({ error: 'Missing article slug or title' }, { status: 400 });
  await mkdir(path.join(ROOT, 'en', 'blog'), { recursive: true });
  await writeFile(path.join(ROOT, 'en', 'blog', `${articleSlug}.html`), articlePage(article), 'utf8');
  return Response.json({ received: true, processed: 1, slug: articleSlug });
}

export function GET() { return Response.json({ ok: true, service: 'outrank-webhook' }); }
