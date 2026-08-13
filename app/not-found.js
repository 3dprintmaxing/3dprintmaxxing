import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#f6f5f0', color: '#1a1a1a', fontFamily: 'Verdana, Geneva, sans-serif', padding: '0 18px' }}>
      <header style={{ borderBottom: '2px solid #1a1a1a', background: '#fff', margin: '0 -18px', padding: '16px 18px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link href="/en/" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, textDecoration: 'none' }}>3dprint<span style={{ color: '#c1440e' }}>maxxing</span></Link>
          <span style={{ color: '#625d55', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>404</span>
        </div>
      </header>
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 0 72px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.15, margin: '0 0 16px' }}>Page not found</h1>
        <p style={{ maxWidth: '560px', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 28px' }}>That print path does not exist. The page may have moved, or the address may be mistyped.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/en/" style={{ display: 'inline-block', background: '#c1440e', color: '#fff', padding: '11px 18px', fontWeight: 700, textDecoration: 'none' }}>Back to homepage</Link>
          <Link href="/en/blog" style={{ display: 'inline-block', border: '1px solid #1a1a1a', color: '#1a1a1a', padding: '10px 18px', fontWeight: 700, textDecoration: 'none' }}>Browse the blog</Link>
        </div>
      </section>
      <footer style={{ maxWidth: '720px', margin: '0 auto', borderTop: '2px solid #1a1a1a', padding: '16px 0 30px', color: '#555', fontSize: '0.8rem', textAlign: 'center' }}>3dprintmaxxing</footer>
    </main>
  );
}
