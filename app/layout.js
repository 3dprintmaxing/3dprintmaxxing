import Observability from './observability';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JT6T953WEC"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JT6T953WEC');
        ` }} />
        <link rel="stylesheet" href="/styles.min.css" />
      </head>
      <body>
        {children}
        <Observability />
      </body>
    </html>
  );
}
