import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

const SUPEREO = "https://supereo.app/api/reads/capture/466b3047-7d97-40f8-9a96-d461c633ad96"
const AI_AGENTS = /ChatGPT-User|OAI-SearchBot|OAI-AdsBot|GPTBot|Claude-Agent\/|^\s*Claude-User(?:\/[\w.+-]*)?\s*$|Claude-User|Claude-SearchBot|ClaudeBot|Perplexity-User|PerplexityBot|Google-Agent|Google-(GeminiNotebook|NotebookLM)|Google-CloudVertexBot|Google-Read-Aloud|Google-Pinpoint|FeedFetcher-Google|Google-Site-Verification|Google-InspectionTool|Googlebot|bingbot|Applebot|Amazonbot|Amzn-SearchBot|Amzn-User|DuckAssistBot|MistralAI-User|MistralAI-Index|CCBot|meta-webindexer|meta-externalfetcher|meta-externalagent|meta-externalads|Bytespider|Claude\/\d/i
const AI_REFERRERS = /^(?:https?:\/\/(?:[a-z0-9-]+\.)*(?:chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.com|copilot\.microsoft\.com|edgeservices\.bing\.com|m365\.cloud\.microsoft|copilot\.cloud\.microsoft|chat\.mistral\.ai|grok\.com|chat\.deepseek\.com|you\.com|duck\.ai|meta\.ai|notebook\.google\.com|notebooklm\.google\.com|poe\.com|phind\.com|chat\.qwen\.ai|kimi\.com|kimi\.moonshot\.cn|doubao\.com|genspark\.ai|manus\.im|felo\.ai|pi\.ai)(?::\d+)?|android-app:\/\/(?:com\.openai\.chatgpt|ai\.perplexity\.app\.android|com\.anthropic\.claude|com\.google\.android\.apps\.bard|com\.microsoft\.office\.officehubrow|com\.microsoft\.copilot|com\.deepseek\.chat|ai\.x\.grok|ai\.mistral\.chat|com\.facebook\.stella))(?:\/|$)/i
const AI_TAGS = /^(?:https?:\/\/)?(?:www\.)?(?:chatgpt(\.com)?|chat\.openai\.com|openai|perplexity(\.ai)?|claude(\.ai)?|anthropic|gemini(\.google\.com)?|copilot(\.com|\.microsoft\.com|\.cloud\.microsoft)?|m365\.cloud\.microsoft|edgeservices\.bing\.com|(chat\.)?mistral(\.ai)?|grok(\.com)?|(chat\.)?deepseek(\.com)?|meta\.ai|notebooklm(\.google\.com)?|notebook\.google\.com|poe\.com|phind(\.com)?|(chat\.)?qwen(\.ai)?|kimi(\.com|\.moonshot\.cn)?|doubao(\.com)?|genspark(\.ai)?|manus\.im|felo(\.ai)?|pi\.ai)\b/i
const SIGNATURE_MAX = 4096

function signedHeader(request: Request, name: string): string | null {
  return request.headers.get(name)?.slice(0, SIGNATURE_MAX) ?? null
}

/** Sends qualifying AI-agent/app visit metadata to Supereo after the response. */
export function captureAiTraffic(request: Request, waitUntil: (promise: Promise<unknown>) => void): void {
  try {
    const key = process.env.SUPEREO_CAPTURE_KEY
    if (!key) return
    const url = new URL(request.url)
    const ua = request.headers.get('user-agent') ?? ''
    const referer = request.headers.get('referer') ?? ''
    const tag = url.searchParams.get('utm_source') ?? ''
    const signed = request.headers.has('signature-agent')
    if (!signed && !AI_AGENTS.test(ua) && !AI_REFERRERS.test(referer) && !AI_TAGS.test(tag)) return
    const utm: Record<string, string> = {}
    url.searchParams.forEach((value, name) => {
      if (/^utm_/i.test(name)) utm[name.toLowerCase()] = value.slice(0, 200)
    })
    let refererOrigin: string | null = null
    try {
      const from = referer ? new URL(referer) : null
      refererOrigin = from ? (from.protocol === 'android-app:' ? 'android-app://' + from.host : from.origin) : null
    } catch {}
    const event = {
      id: crypto.randomUUID(),
      at: Date.now(),
      host: url.host,
      path: url.pathname,
      utm,
      method: request.method,
      ua: ua.slice(0, 512),
      ip: request.headers.get('x-real-ip'),
      referer: refererOrigin,
      country: request.headers.get('x-vercel-ip-country'),
      signed: signed ? {
        agent: signedHeader(request, 'signature-agent'),
        input: signedHeader(request, 'signature-input'),
        signature: signedHeader(request, 'signature'),
      } : null,
    }
    waitUntil(
      fetch(SUPEREO, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({ events: [event] }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => undefined),
    )
  } catch {}
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  captureAiTraffic(request, (promise) => event.waitUntil(promise))

  // Preserve the existing root redirect to /en.
  if (request.nextUrl.pathname === '/') {
    const destination = request.nextUrl.clone()
    destination.pathname = '/en'
    return NextResponse.redirect(destination, 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|css|js|map|woff2?|ttf)$).*)'],
}
