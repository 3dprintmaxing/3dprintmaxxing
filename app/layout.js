import path from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = process.cwd();
const BASE_URL = 'https://3dprintmaxxing.vercel.app';
const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const PAGES = ['index', 'blog', 'privacy-policy', 'refund-policy', 'billing-policy', 'thanks'];
const LANGUAGE_NAMES = { en: 'en-US', es: 'es', 'pt-br': 'pt-BR', fr: 'fr', de: 'de', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh-CN' };
const PAGE_KEYWORDS = {
  index: ['custom 3D printing', 'FDM 3D printing service', 'STL printing', '3D print quote', 'PLA 3D printing', 'prototype printing'],
  blog: ['3D printing tutorials', 'FDM printing guide', 'PLA troubleshooting', 'filament guide'],
  'article-filament': ['3D printing filament', 'PLA vs PETG', 'filament selection guide'],
  'article-reliable-pla': ['reliable PLA printing', 'PLA print settings', 'FDM print quality'],
  'article-first-layer': ['first layer problems', '3D print warping', 'bed adhesion troubleshooting'],
  'privacy-policy': ['3D printing privacy policy'],
  'refund-policy': ['3D printing refund policy'],
  'billing-policy': ['3D printing billing policy'],
};

export async function generateMetadata({ params }) {
  const { path: route = [] } = await params;
  const locale = route[0] || 'en';
  const page = route[1] || 'index';
  const base = path.resolve(ROOT);
  const target = path.resolve(base, locale, `${page}.html`);
  const relative = path.relative(base, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return { title: '3dprintmaxxing', robots: { index: false, follow: false }, icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  }
  try {
    const html = await readFile(target, 'utf8');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '3dprintmaxxing';
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
    const cleanPage = page === 'index' ? '' : `/${page}`;
    const canonical = `${BASE_URL}/${locale}${cleanPage}`;
    const languages = Object.fromEntries(LANGUAGES.map((language) => [language, `${BASE_URL}/${language}${cleanPage}`]));
    languages['x-default'] = `${BASE_URL}/en${cleanPage}`;
    return {
      metadataBase: new URL(BASE_URL),
      title,
      description,
      keywords: PAGE_KEYWORDS[page] || PAGE_KEYWORDS.index,
      authors: [{ name: '3dprintmaxxing' }],
      creator: '3dprintmaxxing',
      publisher: '3dprintmaxxing',
      alternates: { canonical, languages },
      openGraph: { type: page.startsWith('article-') ? 'article' : 'website', url: canonical, title, description, siteName: '3dprintmaxxing', locale: LANGUAGE_NAMES[locale] || locale },
      twitter: { card: 'summary_large_image', title, description },
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
