import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="site" style={{ minHeight: '100vh', padding: '18px', fontFamily: 'Verdana, Geneva, sans-serif', background: '#f6f5f0', color: '#1a1a1a' }}>
      <header className="header" style={{ margin: '-18px -18px 0' }}>
        <div className="top"><Link className="logo" href="/en/">3dprint<span>maxxing</span></Link><span>404</span></div>
      </header>
      <div className="wrap"><h1>That page doesn't exist.</h1><div className="intro"><p>The link may be out of date or the address may be wrong.</p><p><Link href="/en/">← back to the site</Link></p></div></div>
    </main>
  );
}
