import { generatePageMetadata } from './metadata';

export async function generateMetadata({ params }) {
  return generatePageMetadata({ params });
}

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
