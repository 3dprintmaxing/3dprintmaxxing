import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const LANGUAGES = ['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];

const LINK_LABELS = {
  en: { privacy: 'Privacy Policy', refund: 'Refund Policy', billing: 'Billing Policy', back: 'back to the site' },
  es: { privacy: 'Política de privacidad', refund: 'Política de reembolsos', billing: 'Política de facturación', back: 'volver al sitio' },
  'pt-br': { privacy: 'Política de privacidade', refund: 'Política de reembolso', billing: 'Política de cobrança', back: 'voltar ao site' },
  fr: { privacy: 'Politique de confidentialité', refund: 'Politique de remboursement', billing: 'Politique de facturation', back: 'retour au site' },
  de: { privacy: 'Datenschutzerklärung', refund: 'Rückerstattungsrichtlinie', billing: 'Abrechnungsrichtlinie', back: 'zurück zur Website' },
  it: { privacy: 'Informativa sulla privacy', refund: 'Politica sui rimborsi', billing: 'Politica di fatturazione', back: 'torna al sito' },
  ja: { privacy: 'プライバシーポリシー', refund: '返金ポリシー', billing: '請求ポリシー', back: 'サイトに戻る' },
  ko: { privacy: '개인정보처리방침', refund: '환불 정책', billing: '청구 정책', back: '사이트로 돌아가기' },
  zh: { privacy: '隐私政策', refund: '退款政策', billing: '账单政策', back: '返回网站' },
};

function localizeLinks(html, locale) {
  const labels = LINK_LABELS[locale] || LINK_LABELS.en;
  const pagePath = (name) => `/${locale}/${name}`;
  let content = html
    .replace(/^<!doctype html>/i, '')
    .replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');

  content = content
    .replace(/(data-thanks|data-rate-limited)="[^"]*"/g, (match, attribute) => `${attribute}="${pagePath(attribute === 'data-thanks' ? 'thanks' : 'rate-limited')}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?(privacy-policy|refund-policy|billing-policy|thanks|rate-limited)(?:\.html)?"/g, (_, name) => `href="${pagePath(name)}"`)
    .replace(/href="(?:\.\/|\.\.\/[^"/]+\/)?index\.html?"/g, `href="/${locale}/"`)
    .replace(/href="\.\/"/g, `href="/${locale}/"`)
    .replace(/href="\.\.\/(en|es|pt-br|fr|de|it|ja|ko|zh)\/"/g, 'href="/$1/"');

  const replacements = [
    ['Privacy Policy', labels.privacy],
    ['Refund Policy', labels.refund],
    ['Billing Policy', labels.billing],
    ['← back to the site', `← ${labels.back}`],
    ['back to the site', labels.back],
  ];
  for (const [from, to] of replacements) content = content.replaceAll(`>${from}<`, `>${to}<`);
  return content;
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const locale = LANGUAGES.includes(segments[0]) ? segments[0] : 'en';
  const routeSegments = LANGUAGES.includes(segments[0]) ? segments.slice(1) : segments;
  const route = routeSegments.length ? routeSegments.join('/') : 'index';
  const file = route.endsWith('.html') ? route : `${route}.html`;
  const filePath = LANGUAGES.includes(segments[0])
    ? path.join(process.cwd(), locale, file)
    : path.join(process.cwd(), file);
  let html;
  try {
    html = await readFile(filePath, 'utf8');
  } catch {
    notFound();
  }
  return <div lang={locale} dangerouslySetInnerHTML={{ __html: localizeLinks(html, locale) }} />;
}
