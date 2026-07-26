import path from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = process.cwd();
const BASE_URL = 'https://3dprintmaxxing.vercel.app';
const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const LANGUAGE_NAMES = { en: 'en-US', es: 'es', 'pt-BR': 'pt-BR', fr: 'fr', de: 'de', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh-CN' };

function routeUrl(locale, page) {
  return `${BASE_URL}/${locale}${page === 'index' ? '' : `/${page}`}`;
}

export async function generateMetadata({ params }) {
  const { path: route = [] } = await params;
  const locale = LANGUAGES.includes(route[0]) ? route[0] : 'en';
  const page = route[1] || 'index';
  const target = path.resolve(ROOT, locale, `${page}.html`);
  const relative = path.relative(ROOT, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return { title: '3dprintmaxxing', robots: { index: false, follow: false }, icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  try {
    const html = await readFile(target, 'utf8');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '3dprintmaxxing';
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() || 'Custom FDM 3D printing with clear, parameter-based quotes and practical printing guidance.';
    const canonical = routeUrl(locale, page);
    const languages = Object.fromEntries(LANGUAGES.map((language) => [language, routeUrl(language, page)]));
    languages['x-default'] = routeUrl('en', page);
    return {
      metadataBase: new URL(BASE_URL),
      title,
      description,
      authors: [{ name: '3dprintmaxxing' }],
      creator: '3dprintmaxxing',
      publisher: '3dprintmaxxing',
      alternates: { canonical, languages },
      openGraph: { type: page.startsWith('article-') ? 'article' : 'website', url: canonical, title, description, siteName: '3dprintmaxxing', locale: LANGUAGE_NAMES[locale] || locale },
      twitter: { card: 'summary_large_image', title, description },
      robots: page === 'thanks' || page === 'rate-limited' ? { index: false, follow: false } : { index: true, follow: true },
      icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' },
    };
  } catch {
    return { title: '3dprintmaxxing', robots: { index: false, follow: false }, icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' } };
  }
}

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
