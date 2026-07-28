import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<SpeedInsights /></body></html>;
import Observability from './observability';
export default function RootLayout({ children }) {
  return <html lang="en"><head><link rel="stylesheet" href="/styles.min.css" /></head><body>{children}<Observability /></body></html>;
}
