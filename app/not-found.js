import Link from 'next/link';

export default function NotFound() {
  const page = {
    minHeight: '100vh',
    background: '#f6f3ee',
    color: '#171513',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '0 24px',
  };
  const shell = {
    width: '100%',
    maxWidth: '1120px',
    margin: '0 auto',
  };
  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
    padding: '0 22px',
    borderRadius: '999px',
    background: '#171513',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 700,
  };

  return (
    <main style={page}>
      <header style={{ ...shell, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '1px solid #d8d1c7' }}>
        <Link href="/en/" style={{ color: '#171513', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
          3dprint<span style={{ color: '#d85b36' }}>maxxing</span>
        </Link>
        <span style={{ color: '#625d55', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>404</span>
      </header>
      <section style={{ ...shell, display: 'flex', minHeight: 'calc(100vh - 110px)', alignItems: 'center', justifyContent: 'center', padding: '72px 0' }}>
        <div style={{ width: '100%', maxWidth: '680px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 20px', color: '#d85b36', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Page not found</p>
          <h1 style={{ margin: '0', fontSize: 'clamp(2.6rem, 8vw, 5.8rem)', lineHeight: 0.98, letterSpacing: '-0.065em' }}>That print path does not exist.</h1>
          <p style={{ maxWidth: '520px', margin: '28px auto 34px', color: '#625d55', fontSize: '1.08rem', lineHeight: 1.65 }}>The page may have moved, or the address may be mistyped. Head back to the homepage or browse the latest 3D printing articles.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <Link href="/en/" style={linkStyle}>Back to homepage</Link>
            <Link href="/en/blog" style={{ ...linkStyle, background: 'transparent', color: '#171513', border: '1px solid #bdb4a8' }}>Browse the blog</Link>
          </div>
        </div>
      </section>
      <footer style={{ ...shell, padding: '22px 0', borderTop: '1px solid #d8d1c7', color: '#625d55', textAlign: 'center', fontSize: '0.85rem' }}>3dprintmaxxing</footer>
    </main>
  );
}
