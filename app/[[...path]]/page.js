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
const BLOG_SEO = {
  en: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Practical 3D printing help</h2><p>A successful custom 3D print starts before the printer heats up. These guides explain how to choose material, prepare a build surface, tune a first layer, and request a quote that reflects the work involved. The goal is a repeatable process for your printer, part, and intended use.</p><p>Start with the <a href="/en/article-filament">3D printing filament guide</a> when choosing between PLA, PETG, ABS, TPU, or another material. Compare strength, heat, flexibility, appearance, moisture, and post-processing instead of choosing by color alone. Continue with the <a href="/en/article-reliable-pla">reliable PLA printing guide</a> for bed preparation, dry filament, sensible temperatures, cooling, and supports.</p><p>If a print fails in the first few layers, use the <a href="/en/article-first-layer">first-layer troubleshooting guide</a> before changing every slicer setting at once. Adhesion, nozzle height, leveling, warping, elephant foot, and curling each point to different causes. For a custom print request, include the model, material preference, approximate size, and intended use so the quote can account for print time, material, and finishing.</p></section>',
  es: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Ayuda práctica para impresión 3D</h2><p>Una impresión 3D personalizada comienza antes de calentar la impresora. Estas guías explican cómo elegir material, preparar la superficie, ajustar la primera capa y solicitar un presupuesto que refleje el trabajo real.</p><p>Empieza con la <a href="/es/article-filament">guía de filamentos para impresión 3D</a> si dudas entre PLA, PETG, ABS o TPU. Después, consulta la <a href="/es/article-reliable-pla">guía para imprimir PLA de forma confiable</a> y la <a href="/es/article-first-layer">guía de problemas de primera capa</a> para diagnosticar adhesión, altura de boquilla, nivelación y warping.</p><p>Para pedir una impresión personalizada, incluye el modelo, material, tamaño aproximado y uso previsto para calcular tiempo, material y acabado.</p></section>',
  'pt-br': '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Ajuda prática para impressão 3D</h2><p>Uma impressão 3D personalizada começa antes de aquecer a impressora. Estes guias mostram como escolher material, preparar a superfície, ajustar a primeira camada e pedir um orçamento que represente o trabalho real.</p><p>Comece pelo <a href="/pt-br/article-filament">guia de filamentos para impressão 3D</a> ao escolher entre PLA, PETG, ABS ou TPU. Depois, use o <a href="/pt-br/article-reliable-pla">guia para impressão PLA confiável</a> e o <a href="/pt-br/article-first-layer">guia de problemas da primeira camada</a> para diagnosticar adesão, altura do bico, nivelamento e empenamento.</p><p>Ao solicitar uma impressão, informe o modelo, o material, o tamanho aproximado e o uso para calcular tempo, material e acabamento.</p></section>',
  fr: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Conseils pratiques pour l’impression 3D</h2><p>Une impression 3D personnalisée commence avant la chauffe de l’imprimante. Ces guides expliquent comment choisir un matériau, préparer la surface, régler la première couche et demander un devis réaliste.</p><p>Commencez par le <a href="/fr/article-filament">guide des filaments pour impression 3D</a>, puis consultez le <a href="/fr/article-reliable-pla">guide d’impression PLA fiable</a> et le <a href="/fr/article-first-layer">guide de dépannage de la première couche</a> pour traiter adhérence, buse, nivellement et warping.</p><p>Pour un devis, indiquez le modèle, le matériau, la taille approximative et l’usage afin d’estimer le temps, la matière et la finition.</p></section>',
  de: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Praktische Hilfe für den 3D-Druck</h2><p>Ein individueller 3D-Druck beginnt, bevor der Drucker aufgeheizt wird. Diese Anleitungen zeigen, wie du Material auswählst, die Druckfläche vorbereitest, die erste Schicht einstellst und ein realistisches Angebot anfragst.</p><p>Beginne mit dem <a href="/de/article-filament">Filament-Ratgeber für 3D-Druck</a>, danach helfen der <a href="/de/article-reliable-pla">Ratgeber für zuverlässige PLA-Drucke</a> und die <a href="/de/article-first-layer">Anleitung zu Problemen der ersten Schicht</a> bei Haftung, Düsenhöhe, Nivellierung und Warping.</p><p>Für ein Angebot helfen Modell, Material, ungefähre Größe und Einsatzzweck, damit Druckzeit, Filament und Nacharbeit eingeplant werden können.</p></section>',
  it: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">Aiuto pratico per la stampa 3D</h2><p>Una stampa 3D personalizzata inizia prima che la stampante raggiunga la temperatura. Queste guide spiegano come scegliere il materiale, preparare la superficie, regolare il primo layer e chiedere un preventivo realistico.</p><p>Inizia dalla <a href="/it/article-filament">guida ai filamenti per la stampa 3D</a>, poi consulta la <a href="/it/article-reliable-pla">guida per stampe PLA affidabili</a> e la <a href="/it/article-first-layer">guida ai problemi del primo layer</a> per adesione, ugello, livellamento e warping.</p><p>Per un preventivo indica modello, materiale, dimensioni approssimative e utilizzo, così tempo, filamento e finitura possono essere valutati correttamente.</p></section>',
  ja: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">実用的な3Dプリントガイド</h2><p>カスタム3Dプリントは、プリンターを加熱する前から始まります。このブログでは、材料の選び方、造形面の準備、初層の調整、見積もりに必要な情報を説明します。</p><p><a href="/ja/article-filament">3Dプリント用フィラメントガイド</a>で材料を比較し、<a href="/ja/article-reliable-pla">安定したPLA印刷ガイド</a>と<a href="/ja/article-first-layer">初層トラブル解決ガイド</a>で接着、ノズル高さ、レベリング、反りを確認してください。</p><p>印刷を依頼するときは、モデル、材料、サイズ、用途を伝えると、印刷時間、フィラメント量、仕上げを含めた明確な見積もりにつながります。</p></section>',
  ko: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">실용적인 3D 프린팅 도움말</h2><p>맞춤형 3D 프린트는 프린터를 가열하기 전부터 시작됩니다. 이 가이드는 재료 선택, 출력면 준비, 첫 레이어 조정과 정확한 견적에 필요한 정보를 설명합니다.</p><p><a href="/ko/article-filament">3D 프린팅 필라멘트 가이드</a>에서 재료를 비교하고, <a href="/ko/article-reliable-pla">안정적인 PLA 출력 가이드</a>와 <a href="/ko/article-first-layer">첫 레이어 문제 해결 가이드</a>에서 접착, 노즐 높이, 레벨링과 뒤틀림을 확인하세요.</p><p>출력 의뢰 시 모델, 재료, 대략적인 크기와 용도를 알려주면 출력 시간, 재료량과 후처리를 반영한 견적을 만들 수 있습니다.</p></section>',
  zh: '<section class="seo-content" aria-labelledby="blog-topics"><h2 id="blog-topics">实用的3D打印指南</h2><p>定制3D打印在打印机加热之前就已经开始。本博客介绍如何选择材料、准备打印平台、调整首层，以及申请准确报价时应该提供哪些信息。</p><p>先阅读<a href="/zh/article-filament">3D打印耗材选择指南</a>，再查看<a href="/zh/article-reliable-pla">可靠PLA打印指南</a>和<a href="/zh/article-first-layer">首层问题排查指南</a>，依次检查粘附、喷嘴高度、调平和翘曲。</p><p>申请定制打印时，提供模型文件、材料偏好、预计尺寸和使用场景，就能更准确地考虑打印时间、耗材用量和后处理。</p></section>',
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
  const injected = route === 'blog' ? BLOG_SEO[locale] || BLOG_SEO.en : relatedMarkup(locale, route);
  return { head, content: injected ? content.replace('<footer', `${injected}<footer`) : content };
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
  if (!requestedLocale) redirect('/en/');
  if (!LANGUAGES.includes(requestedLocale)) notFound();
  const route = segments.slice(1).join('/') || 'index';
  if (!ROUTES.includes(route)) notFound();
  let html;
  try { html = await readFile(path.join(process.cwd(), requestedLocale, `${route}.html`), 'utf8'); } catch { notFound(); }
  const localized = localizeLinks(html, requestedLocale, route);
  return <><head dangerouslySetInnerHTML={{ __html: sanitizeHtml(localized.head) }} /><div lang={HTML_LANGUAGES[requestedLocale] || requestedLocale} dangerouslySetInnerHTML={{ __html: sanitizeHtml(ensureDocumentLanguage(localized.content, requestedLocale)) }} /></>;
}
