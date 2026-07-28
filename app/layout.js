import Observability from './observability';

export default function RootLayout({ children }) {
  return <html lang="en"><head><link rel="stylesheet" href="/styles.min.css" /></head><body>{children}<Observability /></body></html>;
}
