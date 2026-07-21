const base = 'https://3dprintmaxxing.vercel.app';
const languages = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const pages = ['', 'blog', 'article-filament', 'article-reliable-pla', 'article-first-layer', 'privacy-policy', 'refund-policy', 'billing-policy'];

export default function sitemap() {
  return [
    { url: `${base}/` },
    ...languages.flatMap((language) => pages.map((page) => ({
      url: `${base}/${language}/${page}`.replace(/\/$/, ''),
    }))),
  ];
}
