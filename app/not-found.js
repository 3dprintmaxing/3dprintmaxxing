import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#f7f4ee', color: '#171717', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #d8d2c8', background: '#f7f4ee' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/en/" style={{ color: '#171717', textDecoration: 'none', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
            3dprint<span style={{ color: '#a34d22' }}>maxxing</span>
          </Link>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em' }}>404</span>
        </div>
      </header>
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(90px, 16vw, 180px) 24px 140px' }}>
        <p style={{ margin: '0 0 18px', color: '#a34d22', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Page not found</p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>That page doesn&apos;t exist.</h1>
        <p style={{ maxWidth: '560px', margin: '28px 0 34px', color: '#625d55', fontSize: '1.1rem', lineHeight: 1.7 }}>The link may be out of date or the address may be wrong.</p>
        <Link href="/en/" style={{ display: 'inline-block', background: '#171717', color: '#fff', padding: '13px 20px', textDecoration: 'none', fontWeight: 700 }}>← Back to 3D printing</Link>
      </section>
      <footer style={{ borderTop: '1px solid #d8d2c8', padding: '24px', textAlign: 'center', color: '#625d55', fontSize: '0.85rem' }}>3dprintmaxxing</footer>
    </main>
  );
}
