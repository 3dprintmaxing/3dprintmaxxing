import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const LANGUAGES = new Set(['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh']);
const PAGE_NAMES = new Set(['index', 'thanks', 'privacy-policy', 'refund-policy', 'billing-policy', 'rate-limited']);

const LABELS = {
  en: { privacy: 'Privacy Policy', refund: 'Refund Policy', billing: 'Billing Policy', back: 'Back to the site', linktree: 'Linktree' },
  es: { privacy: 'Política de privacidad', refund: 'Política de reembolsos', billing: 'Política de facturación', back: 'Volver al sitio', linktree: 'Linktree' },
  'pt-br': { privacy: 'Política de privacidade', refund: 'Política de reembolso', billing: 'Política de cobrança', back: 'Voltar ao site', linktree: 'Linktree' },
  fr: { privacy: 'Politique de confidentialité', refund: 'Politique de remboursement', billing: 'Politique de facturation', back: 'Retour au site', linktree: 'Linktree' },
  de: { privacy: 'Datenschutzrichtlinie', refund: 'Rückerstattungsrichtlinie', billing: 'Abrechnungsrichtlinie', back: 'Zurück zur Website', linktree: 'Linktree' },
  it: { privacy: 'Informativa sulla privacy', refund: 'Politica sui rimborsi', billing: 'Politica di fatturazione', back: 'Torna al sito', linktree: 'Linktree' },
  ja: { privacy: 'プライバシーポリシー', refund: '返金ポリシー', billing: '請求ポリシー', back: 'サイトに戻る', linktree: 'Linktree' },
  ko: { privacy: '개인정보 처리방침', refund: '환불 정책', billing: '청구 정책', back: '사이트로 돌아가기', linktree: 'Linktree' },
  zh: { privacy: '隐私政策', refund: '退款政策', billing: '账单政策', back: '返回网站', linktree: 'Linktree' }
};

function normalizeLanguage(value) {
  const language = String(value || '').toLowerCase();
  return LANGUAGES.has(language) ? language : 'en';
}

function localizeLinks(html, language) {
  const prefix = `/${language}`;
  const labels = LABELS[language];
  let output = html
    .replace(/href="(?:\.\.\/)?(?:en|es|pt-br|fr|de|it|ja|ko|zh)\/(index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?"/g, (_, page) => `href="${prefix}/${page === 'index' ? '' : page}"`)
    .replace(/href="(?:\.\/)?(?:index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?"/g, (_, page) => `href="${prefix}/${page === 'index' ? '' : page}"`)
    .replace(/href="\.\.\/((?:privacy|refund|billing)-policy\.html)"/g, (_, file) => `href="${prefix}/${file.replace('.html', '')}"`)
    .replace(/data-thanks="(?:\.\.\/)?thanks\.html"/g, `data-thanks="${prefix}/thanks"`)
    .replace(/data-rate-limited="(?:\.\.\/)?rate-limited\.html"/g, `data-rate-limited="${prefix}/rate-limited"`);

  output = output
    .replace(/>Privacy Policy</g, `>${labels.privacy}<`)
    .replace(/>Refund Policy</g, `>${labels.refund}<`)
    .replace(/>Billing Policy</g, `>${labels.billing}<`)
    .replace(/>Back to the site</g, `>${labels.back}<`)
    .replace(/>Linktree</g, `>${labels.linktree}<`);
  return output;
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const language = normalizeLanguage(segments[0]);
  const rawPage = segments.length > 1 ? segments.slice(1).join('/') : 'index';
  const page = rawPage.replace(/\.html$/i, '');
  if (!PAGE_NAMES.has(page)) notFound();
  const file = path.join(process.cwd(), language, `${page}.html`);
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    notFound();
  }
  const content = localizeLinks(html, language)
    .replace(/^<!doctype html>/i, '')
    .replace(/<html[^>]*>|<\/html>|<head[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
