import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', boxSizing: 'border-box', padding: '18px', background: '#f6f5f0', color: '#1a1a1a', fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '15px', lineHeight: 1.55 }}>
      <header style={{ margin: '-18px -18px 0', padding: '16px 0', background: '#fff', borderBottom: '2px solid #1a1a1a' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <Link href="/en/" style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none' }}>3dprint<span style={{ color: '#c1440e' }}>maxxing</span></Link>
          <span>404</span>
        </div>
      </header>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 18px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', lineHeight: 1.25, margin: '26px 0 10px' }}>That page doesn&apos;t exist.</h1>
        <div style={{ background: '#fff', border: '1px solid #ccc8ba', padding: '16px 18px', margin: '18px 0 30px' }}>
          <p style={{ margin: '0 0 10px' }}>The link may be out of date or the address may be wrong.</p>
          <p style={{ margin: 0 }}><Link href="/en/" style={{ color: '#0645ad' }}>← back to the site</Link></p>
        </div>
      </div>
    </main>
  );
}
