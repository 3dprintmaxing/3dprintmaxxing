import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#f6f5f0', color: '#1a1a1a', fontFamily: 'Verdana, Geneva, sans-serif', padding: '18px' }}>
      <header style={{ maxWidth: '720px', margin: '0 auto', borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '0 18px' }}>
          <Link href="/en/" style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.3rem', textDecoration: 'none', color: '#1a1a1a' }}>3dprint<span style={{ color: '#c1440e' }}>maxxing</span></Link>
          <span style={{ color: '#625d55', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>404</span>
        </div>
      </header>
      <section style={{ maxWidth: '720px', margin: '28px auto 0', padding: '0 18px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', lineHeight: 1.25, margin: '0 0 10px' }}>That page doesn&apos;t exist.</h1>
        <div style={{ background: '#fff', border: '1px solid #ccc8ba', padding: '16px 18px', margin: '18px 0 30px' }}>
          <p style={{ margin: '0 0 10px' }}>The link may be out of date or the address may be wrong.</p>
          <p style={{ margin: 0 }}><Link href="/en/" style={{ color: '#0645ad' }}>← back to the site</Link></p>
        </div>
      </section>
      <footer style={{ maxWidth: '720px', margin: '40px auto 0', borderTop: '2px solid #1a1a1a', padding: '16px 18px 30px', color: '#555', textAlign: 'center', fontSize: '0.8rem' }}>3dprintmaxxing</footer>
    </main>
  );
}
