const BASE_URL = 'https://3dprintmaxxing.vercel.app';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: '3dprintmaxxing',
  description: 'Custom FDM 3D printing with clear, parameter-based quotes and practical printing guidance.',
  icons: { icon: '/assets/favicon.ico', apple: '/assets/apple-touch-icon.png' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
