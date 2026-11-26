const base = 'https://3dprintmaxxing.vercel.app';
const languages = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const pages = ['', 'blog', 'article-filament', 'article-reliable-pla', 'article-first-layer', 'privacy-policy', 'refund-policy', 'billing-policy'];
const updatedEnglishPages = new Set(['', 'article-filament', 'article-reliable-pla', 'article-first-layer', 'pricing', 'get-stl-printed', 'custom-3d-printing']);

export default function sitemap() {
  return languages.flatMap((language) => [...pages, ...(language === 'en' ? ['about', 'pricing', 'get-stl-printed', 'custom-3d-printing'] : [])].map((page) => ({
    url: `${base}/${language}${page ? `/${page}` : ''}`,
    ...(language === 'en' && updatedEnglishPages.has(page) ? { lastModified: new Date('2026-11-26') } : {}),
  })));
}
