import Observability from '../../observability';
import { LANGUAGE_TAGS } from '../../site-config';

export default async function LocaleRootLayout({ children, params }) {
  const { locale } = await params;
  const language = LANGUAGE_TAGS[locale] || LANGUAGE_TAGS.en;

  return (
    <html lang={language}>
      <head>
        <meta name="google-site-verification" content="i9imBNMrFJkYGxXgMudHaRkt8fuPnBOAJjZMx9DhfLY" />
        <link rel="stylesheet" href="/styles.min.css" />
      </head>
      <body>
        {children}
        <Observability />
      </body>
    </html>
  );
}
