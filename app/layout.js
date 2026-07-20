import path from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = process.cwd();

export async function generateMetadata({ params }) {
  const { path: route = [] } = await params;
  const locale = route[0] || 'en';
  const page = route[1] || 'index';
  const file = path.join(ROOT, locale, `${page}.html`);
  try {
    const html = await readFile(file, 'utf8');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '3dprintmaxxing';
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
    return { title, description, icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  } catch {
    return { title: '3dprintmaxxing', icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  }
}

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
