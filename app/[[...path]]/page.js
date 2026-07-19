import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const LANGUAGES = new Set(['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh']);
const PAGE_NAMES = new Set(['index', 'thanks', 'privacy-policy', 'refund-policy', 'billing-policy', 'rate-limited']);

function normalizeLanguage(value) {
  const language = String(value || '').toLowerCase();
  return LANGUAGES.has(language) ? language : 'en';
}

function localizeLinks(html, language) {
  const prefix = `/${language}`;
  return html
    .replace(/href="(?:\.\.\/)?(?:en|es|pt-br|fr|de|it|ja|ko|zh)\/(index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?"/g, (_, page) => `href="${prefix}/${page === 'index' ? '' : page}"`)
    .replace(/href="(?:\.\/)?(?:index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?"/g, (_, page) => `href="${prefix}/${page === 'index' ? '' : page}"`)
    .replace(/href="\.\.\/((?:privacy|refund|billing)-policy\.html)"/g, (_, file) => `href="${prefix}/${file.replace('.html', '')}"`)
    .replace(/data-thanks="(?:\.\.\/)?thanks\.html"/g, `data-thanks="${prefix}/thanks"`)
    .replace(/data-rate-limited="(?:\.\.\/)?rate-limited\.html"/g, `data-rate-limited="${prefix}/rate-limited"`);
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const language = normalizeLanguage(segments[0]);
  const page = segments.length > 1 ? segments.slice(1).join('/') : 'index';
  if (!PAGE_NAMES.has(page)) notFound();
  const file = path.join(process.cwd(), language, `${page}.html`);
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    notFound();
  }
  const content = localizeLinks(html, language)
    .replace(/^<!doctype html>/i, '')
    .replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
