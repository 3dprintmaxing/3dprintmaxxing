import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const route = segments.length ? segments.join('/') : 'index';
  const file = route.endsWith('.html') ? route : `${route}.html`;
  let html;
  try {
    html = await readFile(path.join(process.cwd(), file), 'utf8');
  } catch {
    notFound();
  }
  const content = html
    .replace(/^<!doctype html>/i, '')
    .replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
