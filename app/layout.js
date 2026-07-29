import Observability from './observability';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles.min.css" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JT6T953WEC"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JT6T953WEC');
        ` }} />
      </head>
      <body>
        {children}
        <Observability />
      </body>
    </html>
  );
}
