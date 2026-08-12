import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Arial, sans-serif', padding: '24px 20px' }}>
      <header style={{ borderBottom: '1px solid #111', paddingBottom: '14px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link href="/en/" style={{ color: '#111', fontWeight: 700, letterSpacing: '-0.03em', textDecoration: 'none' }}>3dprint<span style={{ color: '#e33b25' }}>maxxing</span></Link>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em' }}>404</span>
        </div>
      </header>
      <section style={{ maxWidth: '980px', margin: '0 auto', padding: '96px 0 120px' }}>
        <p style={{ color: '#e33b25', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Page not found</p>
        <h1 style={{ maxWidth: '680px', margin: '18px 0 20px', fontSize: 'clamp(2.5rem, 7vw, 5.6rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>That page doesn&apos;t exist.</h1>
        <p style={{ maxWidth: '520px', margin: 0, color: '#555', fontSize: '1.05rem', lineHeight: 1.6 }}>The link may be out of date or the address may be wrong.</p>
        <p style={{ marginTop: '32px' }}><Link href="/en/" style={{ color: '#111', fontWeight: 700 }}>← back to the site</Link></p>
      </section>
      <footer style={{ maxWidth: '980px', margin: '0 auto', borderTop: '1px solid #111', paddingTop: '18px', color: '#555', fontSize: '0.85rem' }}>3dprintmaxxing</footer>
    </main>
  );
}
