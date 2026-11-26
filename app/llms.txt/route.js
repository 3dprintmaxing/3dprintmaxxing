const base = 'https://3dprintmaxxing.vercel.app';

const languages = [
  ['en', 'English'],
  ['es', 'Español'],
  ['pt-br', 'Português (Brasil)'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['zh', '中文'],
];

const pages = [
  ['', 'Home'],
  ['/blog', 'Blog'],
  ['/article-filament', 'Filament guide'],
  ['/article-reliable-pla', 'Reliable PLA guide'],
  ['/article-first-layer', 'First-layer troubleshooting'],
  ['/privacy-policy', 'Privacy policy'],
  ['/refund-policy', 'Refund policy'],
  ['/billing-policy', 'Billing policy'],
];

const localizedPages = languages.map(([locale, language]) => {
  const localePages = locale === 'en' ? [...pages, ['/about', 'About 3dprintmaxxing']] : pages;
  const links = localePages.map(([path, label]) => `- [${label}](${base}/${locale}${path})`).join('\n');
  return `### ${language} (/${locale}/)\n\n${links}`;
}).join('\n\n');

const content = `# 3dprintmaxxing

> Independent custom FDM 3D printing for one-off parts, prototypes, and hobby projects. Customers can submit a model file or describe an idea, receive an individual quote by email, and approve it before printing or payment.

## Pricing and service

Each print is quoted individually. Quotes account for filament use, printer time, quantity, and shipping. The itemized price and estimated timeline are sent by email before production or payment. There are no fixed catalog prices. Orders are mailed; shipping is available anywhere.

## Printer and accepted files

- Build volume: 220 × 220 × 220 mm
- Layer resolution: 0.1–0.4 mm
- Accepted file formats: STL, OBJ, 3MF, and STEP
- Custom design can be discussed from a written description when the customer does not have a model file.

## Localized pages

The website is available in English, Spanish, Brazilian Portuguese, French, German, Italian, Japanese, Korean, and Chinese. Each language has its own homepage, blog, articles, and policy pages.

${localizedPages}

## Articles

- Filament selection covers PLA, PETG, ABS, ASA, TPU, strength, heat resistance, surface finish, and use-case requirements.
- Reliable PLA printing covers build-surface preparation, first-layer calibration, nozzle temperature, cooling, drying, and print quality.
- First-layer troubleshooting covers adhesion, leveling, nozzle height, warping, curling, elephant's foot, and early print failures.

## Contact and quoting

Use the custom-print request form on any localized homepage. A human reviews the request and sends an individual quote before production.

## Machine-readable resources

- [Sitemap](${base}/sitemap.xml)
- [Robots.txt](${base}/robots.txt)
`;

export function GET() {
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}