import path from 'node:path';
import { readFile } from 'node:fs/promises';
import {
  BASE_URL,
  INDEXABLE_ROUTES,
  LANGUAGES,
  LANGUAGE_TAGS,
  isSupportedLocale,
  isSupportedRoute,
  routeUrl,
} from './site-config';

const ROOT = process.cwd();
const SEO_METADATA_PATH = path.join(ROOT, 'content', 'seo-metadata.json');

const PAGE_KEYWORDS = {
  index: ['3D printing services', 'custom 3D printing', 'FDM 3D printing service', 'STL printing', '3D print quote', 'PLA 3D printing', 'prototype printing'],
  blog: ['3D printing tutorials', 'FDM printing guide', 'PLA troubleshooting', 'filament guide'],
  'article-filament': ['3D printing filament', 'PLA vs PETG', 'filament selection guide'],
  'article-reliable-pla': ['reliable PLA printing', 'PLA print settings', 'FDM print quality'],
  'article-first-layer': ['first layer problems', '3D print warping', 'bed adhesion troubleshooting'],
  'privacy-policy': ['3D printing privacy policy'],
  'refund-policy': ['3D printing refund policy'],
  'billing-policy': ['3D printing billing policy'],
  about: ['about 3dprintmaxxing', 'independent FDM 3D printing service', 'custom 3D printing business'],
};

const SHORT_TITLES = {
  en: { index: '3D Printing Services — 3dprintmaxxing', about: 'About 3dprintmaxxing | Independent FDM 3D Printing', blog: '3D Printing Tutorials — 3dprintmaxxing', 'article-filament': '3D Printing Filament Guide — 3dprintmaxxing', 'article-reliable-pla': 'Reliable PLA 3D Printing — 3dprintmaxxing', 'article-first-layer': 'First-Layer 3D Printing Fixes — 3dprintmaxxing' },
  es: { index: 'Impresión 3D personalizada — 3dprintmaxxing', blog: 'Tutoriales de impresión 3D — 3dprintmaxxing', 'article-filament': 'Guía de filamento 3D — 3dprintmaxxing', 'article-reliable-pla': 'Impresiones PLA fiables — 3dprintmaxxing', 'article-first-layer': 'Soluciones para la primera capa — 3dprintmaxxing' },
  'pt-br': { index: 'Impressão 3D personalizada — 3dprintmaxxing', blog: 'Tutoriais de impressão 3D — 3dprintmaxxing', 'article-filament': 'Guia de filamento 3D — 3dprintmaxxing', 'article-reliable-pla': 'Impressões PLA confiáveis — 3dprintmaxxing', 'article-first-layer': 'Soluções para a primeira camada — 3dprintmaxxing' },
  fr: { index: 'Impression 3D personnalisée — 3dprintmaxxing', blog: 'Tutoriels d’impression 3D — 3dprintmaxxing', 'article-filament': 'Guide du filament 3D — 3dprintmaxxing', 'article-reliable-pla': 'Impressions PLA fiables — 3dprintmaxxing', 'article-first-layer': 'Dépannage de la première couche — 3dprintmaxxing' },
  de: { index: 'Individueller 3D-Druck — 3dprintmaxxing', blog: '3D-Druck-Anleitungen — 3dprintmaxxing', 'article-filament': '3D-Druck-Filament wählen — 3dprintmaxxing', 'article-reliable-pla': 'Zuverlässiger PLA-Druck — 3dprintmaxxing', 'article-first-layer': 'Erste Schicht richtig drucken — 3dprintmaxxing' },
  it: { index: 'Stampa 3D personalizzata — 3dprintmaxxing', blog: 'Guide per la stampa 3D — 3dprintmaxxing', 'article-filament': 'Guida ai filamenti 3D — 3dprintmaxxing', 'article-reliable-pla': 'Stampe PLA affidabili — 3dprintmaxxing', 'article-first-layer': 'Problemi del primo layer — 3dprintmaxxing' },
  ja: { index: 'カスタム3Dプリント — 3dprintmaxxing', blog: '3Dプリントガイド — 3dprintmaxxing', 'article-filament': '3Dプリント用フィラメント — 3dprintmaxxing', 'article-reliable-pla': '安定したPLAプリント — 3dprintmaxxing', 'article-first-layer': '初層プリントの問題解決 — 3dprintmaxxing' },
  ko: { index: '맞춤형 3D 프린팅 — 3dprintmaxxing', blog: '3D 프린팅 가이드 — 3dprintmaxxing', 'article-filament': '3D 프린팅 필라멘트 가이드 — 3dprintmaxxing', 'article-reliable-pla': '안정적인 PLA 출력 — 3dprintmaxxing', 'article-first-layer': '첫 레이어 문제 해결 — 3dprintmaxxing' },
  zh: { index: '定制3D打印 — 3dprintmaxxing', blog: '3D打印指南 — 3dprintmaxxing', 'article-filament': '3D打印耗材指南 — 3dprintmaxxing', 'article-reliable-pla': '稳定PLA打印 — 3dprintmaxxing', 'article-first-layer': '首层打印问题解决 — 3dprintmaxxing' },
};

const SEARCH_INTENTS = {
  index: {
    en: {
      title: '3D Printing Services | Custom FDM Prints, Quotes & Prototypes',
      description: '3D printing services for custom parts, prototypes, and hobby projects. Send an STL or describe your idea to get a practical FDM print quote before production.',
    },
  },
  blog: {
    en: {
      title: '3D Printing Guides for Better FDM Results | 3dprintmaxxing',
      description: 'Learn how to choose filament, improve PLA reliability, and fix first-layer problems with practical FDM 3D printing tutorials for makers and small projects.',
    },
  },
};

let seoMetadataPromise;

function normalizeMetadata(record) {
  if (Array.isArray(record)) {
    return { title: record[0], description: record[1] };
  }
  if (record && typeof record === 'object') {
    return { title: record.title, description: record.description };
  }
  return {};
}

function sourceText(html, pattern, fallback) {
  return html.match(pattern)?.[1]?.trim()?.replace(/&amp;/g, '&') || fallback;
}

async function loadSeoMetadata() {
  seoMetadataPromise ||= readFile(SEO_METADATA_PATH, 'utf8').then(JSON.parse);
  return seoMetadataPromise;
}

export async function getPageMetadataRecord(locale, page) {
  if (!isSupportedLocale(locale) || !isSupportedRoute(page, locale)) return null;

  try {
    const [seoMetadata, html] = await Promise.all([
      loadSeoMetadata(),
      readFile(path.join(ROOT, locale, `${page}.html`), 'utf8'),
    ]);
    const sourceTitle = sourceText(html, /<title[^>]*>([\s\S]*?)<\/title>/i, '3dprintmaxxing');
    const sourceDescription = sourceText(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
      'Custom FDM 3D printing with clear, parameter-based quotes and practical printing guidance.',
    );
    const preferred = normalizeMetadata(SEARCH_INTENTS[page]?.[locale]);
    const localized = normalizeMetadata(seoMetadata[locale]?.[page]);
    const fallback = normalizeMetadata(seoMetadata.en?.[page]);

    return {
      title: preferred.title || localized.title || fallback.title || SHORT_TITLES[locale]?.[page] || sourceTitle,
      description: preferred.description || localized.description || fallback.description || sourceDescription,
    };
  } catch {
    return null;
  }
}

function noIndexMetadata() {
  return {
    title: 'Page not found — 3dprintmaxxing',
    robots: { index: false, follow: false },
  };
}

export async function generateRouteMetadata({ locale, page = 'index', segmentCount = 0 }) {
  if (segmentCount > 1 || !isSupportedLocale(locale) || !isSupportedRoute(page, locale)) {
    return noIndexMetadata();
  }

  const record = await getPageMetadataRecord(locale, page);
  if (!record) return noIndexMetadata();

  const isIndexable = INDEXABLE_ROUTES.includes(page);
  const canonical = routeUrl(locale, page);
  const hasLocalizedAlternates = isIndexable && page !== 'about';
  const alternates = hasLocalizedAlternates
    ? {
        canonical,
        languages: {
          ...Object.fromEntries(LANGUAGES.map((language) => [language, routeUrl(language, page)])),
          'x-default': routeUrl('en', page),
        },
      }
    : undefined;

  return {
    metadataBase: new URL(BASE_URL),
    title: record.title,
    description: record.description,
    keywords: PAGE_KEYWORDS[page] || PAGE_KEYWORDS.index,
    alternates,
    openGraph: isIndexable
      ? {
          type: page.startsWith('article-') ? 'article' : 'website',
          url: canonical,
          title: record.title,
          description: record.description,
          siteName: '3dprintmaxxing',
          locale: LANGUAGE_TAGS[locale],
        }
      : undefined,
    twitter: isIndexable ? { card: 'summary', title: record.title, description: record.description } : undefined,
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
    icons: {
      icon: [
        { url: '/assets/favicon.ico', type: 'image/x-icon' },
        { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/assets/apple-touch-icon.png',
    },
  };
}
