export const BASE_URL = 'https://3dprintmaxxing.vercel.app';

export const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];

export const LANGUAGE_TAGS = {
  en: 'en-US',
  es: 'es',
  'pt-br': 'pt-BR',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
};

export const ROUTES = [
  'index',
  'thanks',
  'privacy-policy',
  'refund-policy',
  'billing-policy',
  'rate-limited',
  'blog',
  'article-filament',
  'article-reliable-pla',
  'article-first-layer',
];

export const ENGLISH_ONLY_ROUTES = ['about', 'pricing', 'get-stl-printed', 'custom-3d-printing'];

export const INDEXABLE_ROUTES = [
  'index',
  'blog',
  'article-filament',
  'article-reliable-pla',
  'article-first-layer',
  'privacy-policy',
  'refund-policy',
  'billing-policy',
  'about',
  'pricing',
  'get-stl-printed',
  'custom-3d-printing',
];

export function isSupportedLocale(locale) {
  return LANGUAGES.includes(locale);
}

export function isSupportedRoute(route, locale) {
  return ROUTES.includes(route) || (locale === 'en' && ENGLISH_ONLY_ROUTES.includes(route));
}

export function routePath(locale, page = 'index') {
  return `/${locale}${page === 'index' ? '' : `/${page}`}`;
}

export function routeUrl(locale, page = 'index') {
  return `${BASE_URL}${routePath(locale, page)}`;
}
