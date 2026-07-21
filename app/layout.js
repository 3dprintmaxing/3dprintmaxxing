import path from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = process.cwd();
const BASE_URL = 'https://3dprintmaxxing.vercel.app';
const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const PAGES = ['index', 'blog', 'privacy-policy', 'refund-policy', 'billing-policy', 'thanks'];

export async function generateMetadata({ params }) {
  const { path: route = [] } = await params;
  const locale = route[0] || 'en';
  const page = route[1] || 'index';
  const file = path.join(ROOT, locale, `${page}.html`);
  try {
    const html = await readFile(file, 'utf8');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '3dprintmaxxing';
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
    const cleanPage = page === 'index' ? '' : `/${page}`;
    const canonical = `${BASE_URL}/${locale}${cleanPage}`;
    const languages = Object.fromEntries(LANGUAGES.map((language) => [language, `${BASE_URL}/${language}${cleanPage}`]));
    languages['x-default'] = `${BASE_URL}/en${cleanPage}`;
    return {
      title,
      description,
      alternates: { canonical, languages },
      openGraph: { type: 'website', url: canonical, title, description, siteName: '3dprintmaxxing' },
      twitter: { card: 'summary', title, description },
      robots: page === 'thanks' ? { index: false, follow: false } : { index: true, follow: true },
      icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' },
    };
  } catch {
    return { title: '3dprintmaxxing', robots: { index: false, follow: false }, icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  }
}

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
