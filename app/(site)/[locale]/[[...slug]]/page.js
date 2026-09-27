import { notFound } from 'next/navigation';
import { readFile, readFile as readTextFile } from 'node:fs/promises';
import path from 'node:path';
import { getPageMetadataRecord } from '../../../metadata';
import {
  BASE_URL as SITE_URL,
  LANGUAGES,
  LANGUAGE_TAGS as HTML_LANGUAGES,
  ROUTES,
  isSupportedLocale,
  isSupportedRoute,
  routePath,
  routeUrl,
} from '../../../site-config';

export const dynamic = 'force-static';
export const dynamicParams = false;

const BLOG_SEO_PATH = path.join(process.cwd(), 'content', 'blog-seo.json');
const SUPPORTING_COPY_PATH = path.join(process.cwd(), 'content', 'seo-supporting-copy.json');
const ARTICLE_ROUTES = ['article-filament', 'article-reliable-pla', 'article-first-layer'];
const ARTICLE_TOPICS = {
  'article-filament': 'FDM 3D printing filament selection',
  'article-reliable-pla': 'reliable PLA 3D printing',
  'article-first-layer': '3D printing first-layer troubleshooting',
};

const DUPLICATE_IMAGE_SOURCES = {
  '/article-images/red-yellow-print-new.jpg': '/article-images/first-layer-print.jpg',
  '/article-images/workshop-tools-new.jpg': '/article-images/filament-workshop.jpg',
  '/article-images/pla-living-room.jpg': '/article-images/filament-living-room-new.jpg',
  '/article-images/pla-printed-objects.jpg': '/article-images/filament-printer-new.jpg',
  '/article-images/printed-objects-new.jpg': '/article-images/filament-printer-new.jpg',
  '/article-images/filament-green.jpg': '/article-images/filament-green-new.jpg',
  '/article-images/star-test-print-new.jpg': '/article-images/pla-star-print.jpg',
};

const LINK_LABELS = {
  en: { blog: 'Blog', privacy: 'Privacy Policy', refund: 'Refund Policy', billing: 'Billing Policy', back: 'back to the site' },
  es: { blog: 'Blog', privacy: 'Política de privacidad', refund: 'Política de reembolsos', billing: 'Política de facturación', back: 'volver al sitio' },
  'pt-br': { blog: 'Blog', privacy: 'Política de privacidade', refund: 'Política de reembolso', billing: 'Política de cobrança', back: 'voltar ao site' },
  fr: { blog: 'Blog', privacy: 'Politique de confidentialité', refund: 'Politique de remboursement', billing: 'Politique de facturation', back: 'retour au site' },
  de: { blog: 'Blog', privacy: 'Datenschutzerklärung', refund: 'Rückerstattungsrichtlinie', billing: 'Abrechnungsrichtlinie', back: 'zurück zur Website' },
  it: { blog: 'Blog', privacy: 'Informativa sulla privacy', refund: 'Politica sui rimborsi', billing: 'Politica di fatturazione', back: 'torna al sito' },
  ja: { blog: 'ブログ', privacy: 'プライバシーポリシー', refund: '返金ポリシー', billing: '請求ポリシー', back: 'サイトに戻る' },
  ko: { blog: '블로그', privacy: '개인정보처리방침', refund: '환불 정책', billing: '청구 정책', back: '사이트로 돌아가기' },
  zh: { blog: '博客', privacy: '隐私政策', refund: '退款政策', billing: '账单政策', back: '返回网站' },
};

const RELATED_ARTICLES = {
  en: { heading: 'Keep reading', browse: 'Browse all tutorials →', read: 'Read the guide →', titles: { 'article-filament': 'How to Choose Filament for a Custom 3D Print', 'article-reliable-pla': 'How to Get More Reliable PLA 3D Prints', 'article-first-layer': 'First-Layer Problems, Warping, and Failed PLA Prints' } },
  es: { heading: 'Sigue leyendo', browse: 'Ver todos los tutoriales →', read: 'Leer la guía →', titles: { 'article-filament': 'Cómo elegir filamento para una impresión 3D personalizada', 'article-reliable-pla': 'Cómo obtener impresiones 3D de PLA más confiables', 'article-first-layer': 'Problemas de primera capa, deformación y fallos de PLA' } },
  'pt-br': { heading: 'Continue lendo', browse: 'Ver todos os tutoriais →', read: 'Ler o guia →', titles: { 'article-filament': 'Como escolher filamento para uma impressão 3D personalizada', 'article-reliable-pla': 'Como obter impressões 3D de PLA mais confiáveis', 'article-first-layer': 'Problemas da primeira camada, empenamento e falhas de PLA' } },
  fr: { heading: 'Poursuivre la lecture', browse: 'Voir tous les tutoriels →', read: 'Lire le guide →', titles: { 'article-filament': 'Comment choisir le filament pour une impression 3D personnalisée', 'article-reliable-pla': 'Comment obtenir des impressions 3D en PLA plus fiables', 'article-first-layer': 'Première couche, déformation et échecs d’impression PLA' } },
  de: { heading: 'Weiterlesen', browse: 'Alle Anleitungen ansehen →', read: 'Anleitung lesen →', titles: { 'article-filament': 'Filament für einen individuellen 3D-Druck auswählen', 'article-reliable-pla': 'Zuverlässigere PLA-3D-Drucke erstellen', 'article-first-layer': 'Probleme mit der ersten Schicht, Warping und PLA-Fehler' } },
  it: { heading: 'Continua a leggere', browse: 'Vedi tutte le guide →', read: 'Leggi la guida →', titles: { 'article-filament': 'Come scegliere il filamento per una stampa 3D personalizzata', 'article-reliable-pla': 'Come ottenere stampe 3D in PLA più affidabili', 'article-first-layer': 'Problemi del primo layer, deformazioni e stampe PLA fallite' } },
  ja: { heading: '続きを読む', browse: 'すべてのチュートリアルを見る →', read: 'ガイドを読む →', titles: { 'article-filament': 'カスタム3Dプリント用フィラメントの選び方', 'article-reliable-pla': 'より安定したPLA 3Dプリントの作り方', 'article-first-layer': '初層の問題、反り、PLAプリントの失敗' } },
  ko: { heading: '계속 읽기', browse: '모든 튜토리얼 보기 →', read: '가이드 읽기 →', titles: { 'article-filament': '맞춤형 3D 프린트용 필라멘트 선택 방법', 'article-reliable-pla': '더 안정적인 PLA 3D 프린트를 만드는 방법', 'article-first-layer': '첫 레이어 문제, 뒤틀림 및 PLA 출력 실패' } },
  zh: { heading: '继续阅读', browse: '浏览所有教程 →', read: '阅读指南 →', titles: { 'article-filament': '如何为定制 3D 打印选择耗材', 'article-reliable-pla': '如何获得更可靠的 PLA 3D 打印', 'article-first-layer': '首层问题、翘曲与 PLA 打印失败' } },
};

const FORM_COPY = {
  en: { cta: 'Request a print', sending: 'Sending…', error: 'Something went wrong. Please try again.', privacy: 'See the', privacyLink: 'Privacy Policy', file: 'Your file' },
  es: { cta: 'Solicitar una impresión', sending: 'Enviando…', error: 'Algo salió mal. Inténtalo de nuevo.', privacy: 'Consulta la', privacyLink: 'Política de privacidad', file: 'Tu archivo' },
  'pt-br': { cta: 'Solicitar uma impressão', sending: 'Enviando…', error: 'Algo deu errado. Tente novamente.', privacy: 'Consulte a', privacyLink: 'Política de privacidade', file: 'Seu arquivo' },
  fr: { cta: 'Demander une impression', sending: 'Envoi…', error: 'Une erreur s’est produite. Réessayez.', privacy: 'Consultez la', privacyLink: 'Politique de confidentialité', file: 'Votre fichier' },
  de: { cta: 'Druck anfragen', sending: 'Wird gesendet…', error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.', privacy: 'Lesen Sie die', privacyLink: 'Datenschutzerklärung', file: 'Ihre Datei' },
  it: { cta: 'Richiedi una stampa', sending: 'Invio in corso…', error: 'Si è verificato un errore. Riprova.', privacy: 'Consulta la', privacyLink: 'Informativa sulla privacy', file: 'Il tuo file' },
  ja: { cta: 'プリントを依頼する', sending: '送信中…', error: '問題が発生しました。もう一度お試しください。', privacy: '', privacyLink: 'プライバシーポリシー', file: 'ファイル' },
  ko: { cta: '출력 요청하기', sending: '전송 중…', error: '문제가 발생했습니다. 다시 시도해 주세요.', privacy: '', privacyLink: '개인정보처리방침', file: '파일' },
  zh: { cta: '请求打印', sending: '正在发送…', error: '出现问题，请重试。', privacy: '请查看', privacyLink: '隐私政策', file: '你的文件' },
};

function relatedMarkup(locale, route) {
  if (!route.startsWith('article-')) return '';
  const copy = RELATED_ARTICLES[locale] || RELATED_ARTICLES.en;
  const links = Object.keys(copy.titles).filter((name) => name !== route).map((name) => `<a class="related-card" href="/${locale}/${name}"><strong>${copy.titles[name]}</strong><span>${copy.read}</span></a>`).join('');
  return `<section class="related-articles" aria-labelledby="related-heading"><h2 id="related-heading">${copy.heading}</h2><div class="related-grid">${links}</div><p><a href="/${locale}/blog">${copy.browse}</a></p></section>`;
}

async function readJson(pathname) {
  try {
    return JSON.parse(await readTextFile(pathname, 'utf8'));
  } catch {
    return {};
  }
}

async function blogSeoMarkup(locale) {
  const seo = await readJson(BLOG_SEO_PATH);
  return seo.blog?.[locale] || '';
}

async function supportingCopyMarkup(locale, route) {
  const copy = await readJson(SUPPORTING_COPY_PATH);
  return copy[locale]?.[route] || '';
}

function absoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).toString();
}

function plainText(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function structuredDataMarkup(locale, route, html) {
  const canonical = routeUrl(locale, route);
  const metadata = await getPageMetadataRecord(locale, route);
  const title = metadata?.title || plainText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '3dprintmaxxing');
  const description = metadata?.description || plainText(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || 'Practical FDM 3D printing guidance and custom print requests from 3dprintmaxxing.');
  const breadcrumbNames = [{ name: 'Home', item: absoluteUrl(`/${locale}`) }];
  if (route !== 'index') breadcrumbNames.push({ name: title.replace(/\s*[—|].*$/, ''), item: canonical });
  const graph = [{
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbNames.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.item })),
  }];

  if (route === 'index') {
    graph.push(
      { '@type': 'WebSite', name: '3dprintmaxxing', url: absoluteUrl(`/${locale}`), inLanguage: HTML_LANGUAGES[locale] || locale },
      { '@type': 'Organization', name: '3dprintmaxxing', url: SITE_URL, logo: absoluteUrl('/assets/apple-touch-icon.png') },
      { '@type': 'Service', name: title, serviceType: 'Custom FDM 3D printing', provider: { '@type': 'Organization', name: '3dprintmaxxing', url: SITE_URL }, description, url: canonical },
    );
  } else if (route === 'blog') {
    const articleTitles = RELATED_ARTICLES[locale]?.titles || RELATED_ARTICLES.en.titles;
    graph.push({
      '@type': 'CollectionPage', name: title, description, url: canonical, inLanguage: HTML_LANGUAGES[locale] || locale,
      mainEntity: { '@type': 'ItemList', itemListElement: Object.keys(articleTitles).map((articleRoute, index) => ({ '@type': 'ListItem', position: index + 1, name: articleTitles[articleRoute], url: absoluteUrl(`/${locale}/${articleRoute}`) })) },
    });
  } else if (ARTICLE_ROUTES.includes(route)) {
    const imagePath = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    graph.push({
      '@type': 'Article', headline: title, description, url: canonical, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      inLanguage: HTML_LANGUAGES[locale] || locale, articleSection: '3D printing', about: { '@type': 'Thing', name: ARTICLE_TOPICS[route] },
      author: { '@type': 'Organization', name: '3dprintmaxxing', url: SITE_URL },
      publisher: { '@type': 'Organization', name: '3dprintmaxxing', url: SITE_URL, logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/apple-touch-icon.png') } },
      ...(imagePath ? { image: absoluteUrl(imagePath) } : {}),
    });
  } else {
    graph.push({ '@type': 'WebPage', name: title, description, url: canonical, inLanguage: HTML_LANGUAGES[locale] || locale });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

async function pageInjectedMarkup(locale, route) {
  const blocks = [];
  if (route === 'blog') blocks.push(await blogSeoMarkup(locale));
  const supporting = await supportingCopyMarkup(locale, route);
  if (supporting) blocks.push(supporting);
  if (route.startsWith('article-')) blocks.push(relatedMarkup(locale, route));
  return blocks.join('');
}

function canonicalizeImageSource(source) {
  const cleanSource = source.split('?')[0];
  return DUPLICATE_IMAGE_SOURCES[cleanSource] || cleanSource;
}

function deduplicateArticleImages(content) {
  const seen = new Set();
  return content.replace(/<img\b[^>]*>/gi, (tag) => {
    const match = tag.match(/\bsrc=["']([^"']+)["']/i);
    if (!match) return tag;
    const canonicalSource = canonicalizeImageSource(match[1]);
    if (seen.has(canonicalSource)) return '';
    seen.add(canonicalSource);
    return tag.replace(match[1], canonicalSource);
  });
}

function localizeLinks(html, locale, route, injected = '') {
  const labels = LINK_LABELS[locale] || LINK_LABELS.en;
  const pagePath = (name) => `/${locale}/${name}`;
  let content = html
    .replace(/^<!doctype html>/i, '')
    .replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');

  content = content
    .replace(/(data-thanks|data-rate-limited)="[^"]*"/g, (_, attribute) => `${attribute}="${pagePath(attribute === 'data-thanks' ? 'thanks' : 'rate-limited')}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?(blog|privacy-policy|refund-policy|billing-policy|thanks|rate-limited|article-filament|article-reliable-pla|article-first-layer)(?:\.html)?"/g, (_, name) => `href="${pagePath(name)}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?index\.html?"/g, `href="/${locale}"`)
    .replace(/href="\.\/"/g, `href="/${locale}"`)
    .replace(/href="thanks\.html"/g, `href="/${locale}/thanks"`)
    .replace(/href="rate-limited\.html"/g, `href="/${locale}/rate-limited"`)
    .replace(/href="\.\.\/(en|es|pt-br|fr|de|it|ja|ko|zh)\/"/g, 'href="/$1"');

  for (const [from, to] of [['Blog', labels.blog], ['Privacy Policy', labels.privacy], ['Refund Policy', labels.refund], ['Billing Policy', labels.billing], ['← back to the site', `← ${labels.back}`], ['back to the site', labels.back]]) content = content.replaceAll(`>${from}<`, `>${to}<`);
  content = deduplicateArticleImages(content);
  return injected ? content.replace('<footer', `${injected}<footer`) : content;
}

function addAttribute(tag, attribute, value) {
  if (new RegExp(`\\s${attribute}=`, 'i').test(tag)) return tag;
  return tag.replace(/>$/, ` ${attribute}="${value}">`);
}

function enhanceRequestFormMarkup(content, locale, route) {
  if (route !== 'index' || !content.includes('data-print-form')) return content;

  const copy = FORM_COPY[locale] || FORM_COPY.en;
  const formIdPrefix = `print-${locale}`;
  let enhanced = content.replace(/<form\b([^>]*\bdata-print-form\b[^>]*)>/i, (tag) => {
    let next = addAttribute(tag, 'data-status-sending', copy.sending);
    next = addAttribute(next, 'data-status-error', copy.error);
    return next;
  });

  enhanced = enhanced.replace(/(<label)([^>]*)(>[\s\S]*?<\/label>\s*)(<(?:input|textarea)\b[^>]*\bname="([^"]+)"[^>]*>)/gi, (match, start, labelAttributes, labelEnd, control, name) => {
    if (name.startsWith('_') || /\sfor=/i.test(labelAttributes)) return match;
    return `${start}${labelAttributes} for="${formIdPrefix}-${name}"${labelEnd}${control}`;
  });

  enhanced = enhanced.replace(/<(input|textarea)\b([^>]*\bname="([^"]+)"[^>]*)>/gi, (tag, element, attributes, name) => {
    if (name.startsWith('_')) return tag;
    let next = `<${element}${attributes}>`;
    next = addAttribute(next, 'id', `${formIdPrefix}-${name}`);

    if (name === 'name') next = addAttribute(next, 'autocomplete', 'name');
    if (name === 'email') next = addAttribute(next, 'autocomplete', 'email');
    if (name === 'phone') next = addAttribute(next, 'autocomplete', 'tel');
    if (name === 'address') next = addAttribute(next, 'autocomplete', 'street-address');
    if (name === 'description') next = addAttribute(next, 'autocomplete', 'off');
    if (name === 'color') next = addAttribute(next, 'autocomplete', 'off');
    if (name === 'budget') next = addAttribute(next, 'inputmode', 'decimal');
    if (name === 'quantity') {
      next = next.replace(/\stype=("[^"]*"|'[^']*')/i, '');
      next = addAttribute(next, 'type', 'number');
      next = addAttribute(next, 'min', '1');
      next = addAttribute(next, 'step', '1');
      next = addAttribute(next, 'inputmode', 'numeric');
    }
    if (name === 'attachments') next = addAttribute(next, 'aria-label', copy.file);
    return next;
  });

  enhanced = enhanced.replace(/<div class="field"><span class="label">([^<]+)<\/span><div class="radio">([\s\S]*?)<\/div><\/div>/i, '<fieldset class="field material-field"><legend class="label">$1</legend><div class="radio">$2</div></fieldset>');
  enhanced = enhanced.replace(/<span class="label">([^<]+)<\/span><div class="drop">([\s\S]*?<input\b[^>]*\bname="attachments"[^>]*>)/i, `<label class="label" for="${formIdPrefix}-attachments">$1</label><div class="drop">$2`);
  enhanced = enhanced.replace(/<span data-status class="hint"><\/span>/i, '<span data-status class="hint form-status" role="status" aria-live="polite" aria-atomic="true"></span>');

  const privacyPrefix = copy.privacy ? `${copy.privacy} ` : '';
  const privacy = `<p class="form-privacy hint">${privacyPrefix}<a href="${routePath(locale, 'privacy-policy')}">${copy.privacyLink}</a>.</p>`;
  return enhanced.replace(/(<button class="submit" type="submit">)/i, `${privacy}$1`);
}

function addHomeCta(content, locale, route) {
  if (route !== 'index') return content;
  const copy = FORM_COPY[locale] || FORM_COPY.en;
  return content.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1<p class="hero-request"><a class="hero-request-link" href="#request">${copy.cta}</a></p>`);
}

export async function generateStaticParams() {
  return LANGUAGES.flatMap((locale) => ROUTES.map((route) => ({
    locale,
    slug: route === 'index' ? [] : [route],
  })));
}

export default async function StaticPage({ params }) {
  const { locale: requestedLocale, slug = [] } = await params;
  if (!isSupportedLocale(requestedLocale)) notFound();
  const route = slug.join('/') || 'index';
  if (slug.length > 1 || !isSupportedRoute(route)) notFound();
  let html;
  try { html = await readFile(path.join(process.cwd(), requestedLocale, `${route}.html`), 'utf8'); } catch { notFound(); }
  const injected = await pageInjectedMarkup(requestedLocale, route);
  const structuredData = await structuredDataMarkup(requestedLocale, route, html);
  const localized = localizeLinks(html, requestedLocale, route, injected);
  const enhanced = addHomeCta(enhanceRequestFormMarkup(localized, requestedLocale, route), requestedLocale, route);
  return <>
    <div lang={HTML_LANGUAGES[requestedLocale] || requestedLocale} dangerouslySetInnerHTML={{ __html: enhanced }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
  </>;
}
