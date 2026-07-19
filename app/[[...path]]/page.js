import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

const LANGUAGES = new Set(['en', 'es', 'pt-br', 'fr', 'de', 'it', 'ja', 'ko', 'zh']);
const PAGE_NAMES = new Set(['index', 'thanks', 'privacy-policy', 'refund-policy', 'billing-policy', 'rate-limited']);

const LABELS = {
  en: { privacy: 'Privacy Policy', refund: 'Refund Policy', billing: 'Billing Policy', back: 'Back to the site', home: '3dprintmaxxing', linktree: 'Linktree' },
  es: { privacy: 'Política de privacidad', refund: 'Política de reembolsos', billing: 'Política de facturación', back: 'Volver al sitio', home: '3dprintmaxxing', linktree: 'Linktree' },
  'pt-br': { privacy: 'Política de privacidade', refund: 'Política de reembolso', billing: 'Política de cobrança', back: 'Voltar ao site', home: '3dprintmaxxing', linktree: 'Linktree' },
  fr: { privacy: 'Politique de confidentialité', refund: 'Politique de remboursement', billing: 'Politique de facturation', back: 'Retour au site', home: '3dprintmaxxing', linktree: 'Linktree' },
  de: { privacy: 'Datenschutzrichtlinie', refund: 'Rückerstattungsrichtlinie', billing: 'Abrechnungsrichtlinie', back: 'Zurück zur Website', home: '3dprintmaxxing', linktree: 'Linktree' },
  it: { privacy: 'Informativa sulla privacy', refund: 'Politica sui rimborsi', billing: 'Politica di fatturazione', back: 'Torna al sito', home: '3dprintmaxxing', linktree: 'Linktree' },
  ja: { privacy: 'プライバシーポリシー', refund: '返金ポリシー', billing: '請求ポリシー', back: 'サイトに戻る', home: '3dprintmaxxing', linktree: 'Linktree' },
  ko: { privacy: '개인정보 처리방침', refund: '환불 정책', billing: '청구 정책', back: '사이트로 돌아가기', home: '3dprintmaxxing', linktree: 'Linktree' },
  zh: { privacy: '隐私政策', refund: '退款政策', billing: '账单政策', back: '返回网站', home: '3dprintmaxxing', linktree: 'Linktree' }
};

function normalizeLanguage(value) {
  const language = String(value || '').toLowerCase();
  return LANGUAGES.has(language) ? language : 'en';
}

function localizedPath(language, page) {
  return `/${language}/${page === 'index' ? '' : page}`;
}

function localizeLinks(html, language) {
  const labels = LABELS[language];
  let output = html;

  output = output.replace(/href="(?:https:\/\/3dprintmaxxing\.vercel\.app\/)?(?:\.\.\/|\.\/)?(?:(?:en|es|pt-br|fr|de|it|ja|ko|zh)\/)?(index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?\/?"/gi, (_, page) => `href="${localizedPath(language, page.toLowerCase())}"`);
  output = output.replace(/href="(?:\.\.\/|\.\/)?(index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?\/?"/gi, (_, page) => `href="${localizedPath(language, page.toLowerCase())}"`);
  output = output.replace(/data-thanks="[^"]*"/gi, `data-thanks="${localizedPath(language, 'thanks')}"`);
  output = output.replace(/data-rate-limited="[^"]*"/gi, `data-rate-limited="${localizedPath(language, 'rate-limited')}"`);

  output = output.replace(/>\s*Privacy Policy\s*</gi, `>${labels.privacy}<`);
  output = output.replace(/>\s*Refund Policy\s*</gi, `>${labels.refund}<`);
  output = output.replace(/>\s*Billing Policy\s*</gi, `>${labels.billing}<`);
  output = output.replace(/>\s*(?:←\s*)?(?:back to the site|return to site)\s*</gi, `>← ${labels.back}<`);
  output = output.replace(/>\s*Linktree\s*</gi, `>${labels.linktree}<`);
  return output;
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const language = normalizeLanguage(segments[0]);
  const rawPage = segments.length > 1 ? segments.slice(1).join('/') : 'index';
  const page = rawPage.replace(/\.html$/i, '').toLowerCase();
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
