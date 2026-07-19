import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";
export const dynamicParams = false;

const LANGUAGES = ["en", "es", "pt-br", "fr", "de", "it", "ja", "ko", "zh"];
const PAGES = ["index", "thanks", "privacy-policy", "refund-policy", "billing-policy", "rate-limited"];
const PAGE_SET = new Set(PAGES);
const LANGUAGE_SET = new Set(LANGUAGES);

const LABELS = {
  en: { privacy: "Privacy Policy", refund: "Refund Policy", billing: "Billing Policy", thanks: "Request received", rateLimited: "Please slow down", back: "Back to the site", linktree: "Linktree" },
  es: { privacy: "Política de privacidad", refund: "Política de reembolsos", billing: "Política de facturación", thanks: "Solicitud recibida", rateLimited: "Por favor, espera", back: "Volver al sitio", linktree: "Linktree" },
  "pt-br": { privacy: "Política de privacidade", refund: "Política de reembolso", billing: "Política de cobrança", thanks: "Solicitação recebida", rateLimited: "Aguarde um momento", back: "Voltar ao site", linktree: "Linktree" },
  fr: { privacy: "Politique de confidentialité", refund: "Politique de remboursement", billing: "Politique de facturation", thanks: "Demande reçue", rateLimited: "Veuillez patienter", back: "Retour au site", linktree: "Linktree" },
  de: { privacy: "Datenschutzerklärung", refund: "Erstattungsrichtlinie", billing: "Abrechnungsrichtlinie", thanks: "Anfrage erhalten", rateLimited: "Bitte warten", back: "Zurück zur Website", linktree: "Linktree" },
  it: { privacy: "Informativa sulla privacy", refund: "Politica sui rimborsi", billing: "Politica di fatturazione", thanks: "Richiesta ricevuta", rateLimited: "Attendi un momento", back: "Torna al sito", linktree: "Linktree" },
  ja: { privacy: "プライバシーポリシー", refund: "返金ポリシー", billing: "請求ポリシー", thanks: "リクエストを受け付けました", rateLimited: "少しお待ちください", back: "サイトに戻る", linktree: "Linktree" },
  ko: { privacy: "개인정보 처리방침", refund: "환불 정책", billing: "청구 정책", thanks: "요청이 접수되었습니다", rateLimited: "잠시 기다려 주세요", back: "사이트로 돌아가기", linktree: "Linktree" },
  zh: { privacy: "隐私政策", refund: "退款政策", billing: "账单政策", thanks: "已收到请求", rateLimited: "请稍候", back: "返回网站", linktree: "Linktree" }
};

export function generateStaticParams() {
  return [
    { path: [] },
    ...LANGUAGES.flatMap((language) => PAGES.map((page) => ({ path: page === "index" ? [language] : [language, page] })))
  ];
}

function normalizeLanguage(value) {
  const language = String(value || "").toLowerCase();
  return LANGUAGE_SET.has(language) ? language : "en";
}

function pagePath(language, page) {
  return page === "index" ? `/${language}` : `/${language}/${page}`;
}

function pageFromHref(href) {
  const value = href.split(/[?#]/)[0].replace(/\/$/, "");
  if (!value || value === ".." || value === "." || value === "index.html") return "index";
  const match = value.match(/(?:^|\/)(index|thanks|privacy-policy|refund-policy|billing-policy|rate-limited)(?:\.html)?$/i);
  return match ? match[1].toLowerCase() : null;
}

function localizeHref(href, language) {
  const page = pageFromHref(href);
  return page && PAGE_SET.has(page) ? pagePath(language, page) : href;
}

function localizeMarkup(html, language) {
  const labels = LABELS[language];
  let output = html;
  output = output.replace(/(<a\b[^>]*\bhref=")([^"]+)("[^>]*>)([\s\S]*?)(<\/a>)/gi, (_, start, href, middle, text, end) => {
    const page = pageFromHref(href);
    const nextHref = localizeHref(href, language);
    let nextText = text;
    if (page === "privacy-policy") nextText = labels.privacy;
    if (page === "refund-policy") nextText = labels.refund;
    if (page === "billing-policy") nextText = labels.billing;
    if (page === "thanks") nextText = labels.thanks;
    if (page === "rate-limited") nextText = labels.rateLimited;
    if (page === "index" && /back|return|volver|voltar|retour|zurück|torna|戻|돌아|返回|←/i.test(text)) nextText = `← ${labels.back}`;
    if (/linktr\.ee\/3dprintmaxxing/i.test(href)) nextText = labels.linktree;
    return `${start}${nextHref}${middle}${nextText}${end}`;
  });
  output = output.replace(/\bdata-thanks="[^"]*"/gi, `data-thanks="${pagePath(language, "thanks")}"`);
  output = output.replace(/\bdata-rate-limited="[^"]*"/gi, `data-rate-limited="${pagePath(language, "rate-limited")}"`);
  return output.replace(/<head>[\s\S]*?<\/head>/i, "").replace(/<\/?(?:html|body)[^>]*>/gi, "");
}

function fallbackRateLimitedPage(language) {
  const labels = LABELS[language];
  const copy = {
    en: "Too many requests arrived in a short time. Please wait a moment and try again.",
    es: "Llegaron demasiadas solicitudes en poco tiempo. Espera un momento e inténtalo de nuevo.",
    "pt-br": "Muitas solicitações chegaram em pouco tempo. Aguarde um momento e tente novamente.",
    fr: "Trop de demandes sont arrivées en peu de temps. Attendez un instant, puis réessayez.",
    de: "In kurzer Zeit sind zu viele Anfragen eingegangen. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
    it: "Sono arrivate troppe richieste in poco tempo. Attendi un momento e riprova.",
    ja: "短時間に多くのリクエストが届きました。少し待ってからもう一度お試しください。",
    ko: "짧은 시간에 요청이 너무 많이 들어왔습니다. 잠시 기다린 후 다시 시도해 주세요.",
    zh: "短时间内收到的请求过多。请稍等片刻后重试。"
  }[language];
  return `<main class="site"><header class="header wrap"><a href="${pagePath(language, "index")}">3dprintmaxxing</a></header><section class="wrap page"><p class="eyebrow">429</p><h1>${labels.rateLimited}</h1><p>${copy}</p><p><a href="${pagePath(language, "index")}">← ${labels.back}</a></p></section></main>`;
}

export default async function StaticPage({ params }) {
  const { path: segments = [] } = await params;
  const language = normalizeLanguage(segments[0]);
  const rawPage = segments.length > 1 ? segments.slice(1).join("/") : "index";
  const page = rawPage.replace(/\.html$/i, "").toLowerCase();
  if (!PAGE_SET.has(page)) notFound();

  let html;
  try {
    html = await readFile(path.join(process.cwd(), language, `${page}.html`), "utf8");
  } catch {
    if (page !== "rate-limited") notFound();
    html = fallbackRateLimitedPage(language);
  }

  return <main dangerouslySetInnerHTML={{ __html: localizeMarkup(html, language) }} />;
}
