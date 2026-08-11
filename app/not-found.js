import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="site">
      <header className="header">
        <div className="top">
          <Link className="logo" href="/en/">3dprint<span>maxxing</span></Link>
          <span>404</span>
        </div>
      </header>
      <div className="wrap">
        <h1>That page doesn&apos;t exist.</h1>
        <div className="intro">
          <p>The link may be out of date or the address may be wrong.</p>
          <p><Link href="/en/">← back to the site</Link></p>
        </div>
      </div>
      <footer className="wrap footer"><p>3dprintmaxxing</p></footer>
    </main>
  );
}
