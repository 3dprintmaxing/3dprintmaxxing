import { notFound, redirect } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

function sanitizeHtml(html) {
  return html || '';
}

const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
const HTML_LANGUAGES = { en: 'en-US', es: 'es', 'pt-br': 'pt-BR', fr: 'fr', de: 'de', it: 'it', ja: 'ja', ko: 'ko', zh: 'zh-CN' };
const ROUTES = ['index', 'thanks', 'privacy-policy', 'refund-policy', 'billing-policy', 'rate-limited', 'blog', 'article-filament', 'article-reliable-pla', 'article-first-layer'];

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

function relatedMarkup(locale, route) {
  if (!route.startsWith('article-')) return '';
  const copy = RELATED_ARTICLES[locale] || RELATED_ARTICLES.en;
  const links = Object.keys(copy.titles).filter((name) => name !== route).map((name) => `<a class="related-card" href="/${locale}/${name}"><strong>${copy.titles[name]}</strong><span>${copy.read}</span></a>`).join('');
  return `<section class="related-articles" aria-labelledby="related-heading"><h2 id="related-heading">${copy.heading}</h2><div class="related-grid">${links}</div><p><a href="/${locale}/blog">${copy.browse}</a></p></section>`;
}

function localizeLinks(html, locale, route) {
  const labels = LINK_LABELS[locale] || LINK_LABELS.en;
  const pagePath = (name) => `/${locale}/${name}`;
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  let content = html.replace(/^<!doctype html>/i, '').replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');
  content = content
    .replace(/(data-thanks|data-rate-limited)="[^"]*"/g, (_, attribute) => `${attribute}="${pagePath(attribute === 'data-thanks' ? 'thanks' : 'rate-limited')}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?(blog|privacy-policy|refund-policy|billing-policy|thanks|rate-limited|article-filament|article-reliable-pla|article-first-layer)(?:\.html)?"/g, (_, name) => `href="${pagePath(name)}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?index\.html?"/g, `href="/${locale}/"`)
    .replace(/href="\.\/"/g, `href="/${locale}/"`)
    .replace(/href="\.\.\/(en|es|pt-br|fr|de|it|ja|ko|zh)\/"/g, 'href="/$1/"');
  for (const [from, to] of [['Blog', labels.blog], ['Privacy Policy', labels.privacy], ['Refund Policy', labels.refund], ['Billing Policy', labels.billing], ['← back to the site', `← ${labels.back}`], ['back to the site', labels.back]]) content = content.replaceAll(`>${from}<`, `>${to}<`);
  return { head, content: content.replace('</div></main>', `${relatedMarkup(locale, route)}</div></main>`) };
}

function ensureDocumentLanguage(content, locale) {
  const lang = HTML_LANGUAGES[locale] || locale;
  return content.replace(/<html([^>]*)>/i, (_, attributes) => `<html${attributes.replace(/\s+lang=("[^"]*"|'[^']*')/i, '')} lang="${lang}">`);
}

export async function generateStaticParams() {
  return [{ path: [] }, ...LANGUAGES.flatMap((lang) => ROUTES.map((route) => ({ path: [lang, ...(route === 'index' ? [] : [route])] })))];
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const requestedLocale = segments[0];
  if (!requestedLocale) redirect('/en');
  if (!LANGUAGES.includes(requestedLocale)) notFound();
  const route = segments.slice(1).join('/') || 'index';
  if (!ROUTES.includes(route)) notFound();
  let html;
  try { html = await readFile(path.join(process.cwd(), requestedLocale, `${route}.html`), 'utf8'); } catch { notFound(); }
  const localized = localizeLinks(html, requestedLocale, route);
  return <><head dangerouslySetInnerHTML={{ __html: sanitizeHtml(localized.head) }} /><div lang={HTML_LANGUAGES[requestedLocale] || requestedLocale} dangerouslySetInnerHTML={{ __html: sanitizeHtml(ensureDocumentLanguage(localized.content, requestedLocale)) }} /></>;
}
