import path from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = process.cwd();
const BASE_URL = 'https://3dprintmaxxing.vercel.app';
const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const LANGUAGE_NAMES = { en: 'en-US', es: 'es', 'pt-br: 'pt-BR', fr: 'fr', de: 'de', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh-CN' };
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
const TITLE_OVERRIDES = {
  de: { 'article-filament': 'Filament für individuellen 3D-Druck auswählen', 'article-first-layer': 'Erste Schicht, Warping und PLA-Fehler' },
  es: { 'article-filament': 'Elegir filamento para impresión 3D personalizada', 'article-first-layer': 'Primera capa, deformación y fallos de PLA' },
  fr: { 'article-filament': 'Choisir un filament pour impression 3D personnalisée', 'article-first-layer': 'Première couche, déformation et échecs PLA' },
  it: { 'article-filament': 'Scegliere il filamento per stampa 3D personalizzata', 'article-first-layer': 'Primo strato, deformazioni e stampe PLA fallite' },
  'pt-br': { 'article-filament': 'Escolher filamento para impressão 3D personalizada', 'article-first-layer': 'Primeira camada, empenamento e falhas de PLA' },
};

function routeUrl(locale, page) {
  return `${BASE_URL}/${locale}${page === 'index' ? '' : `/${page}`}`;
}

export async function generatePageMetadata({ params }) {
  const { path: route = [] } = await params;
  const locale = LANGUAGES.includes(route[0]) ? route[0] : 'en';
  const page = route[1] || 'index';
  const target = path.resolve(ROOT, locale, `${page}.html`);
  const relative = path.relative(ROOT, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return { title: '3dprintmaxxing', robots: { index: false, follow: false } };
  try {
    const html = await readFile(target, 'utf8');
    const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '3dprintmaxxing';
    const title = TITLE_OVERRIDES[locale]?.[page] || rawTitle.replace(/&amp;/g, '&');
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() || 'Custom FDM 3D printing with clear, parameter-based quotes and practical printing guidance.';
    const canonical = routeUrl(locale, page);
    const languages = Object.fromEntries(LANGUAGES.map((language) => [language, routeUrl(language, page)]));
    languages['x-default'] = routeUrl('en', page);
    return {
      metadataBase: new URL(BASE_URL), title, description, keywords: PAGE_KEYWORDS[page] || PAGE_KEYWORDS.index,
      authors: [{ name: '3dprintmaxxing' }], creator: '3dprintmaxxing', publisher: '3dprintmaxxing',
      alternates: { canonical, languages },
      openGraph: { type: page.startsWith('article-') ? 'article' : 'website', url: canonical, title, description, siteName: '3dprintmaxxing', locale: LANGUAGE_NAMES[locale] || locale },
      twitter: { card: 'summary_large_image', title, description }, robots: page === 'thanks' ? { index: false, follow: false } : { index: true, follow: true },
      icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' },
    };
  } catch {
    return { title: '3dprintmaxxing', robots: { index: false, follow: false } };
  }
}
