const base = 'https://3dprintmaxxing.vercel.app';

const content = `# 3dprintmaxxing

> Custom FDM 3D printing with clear, parameter-based pricing and practical guidance for reliable prints.

## Website

- [Home](${base}/en/): Request a custom print quote using the model, filament, weight, and print-time details.
- [Blog](${base}/en/blog/): Tutorials and explainers for choosing filament, improving PLA reliability, and troubleshooting first-layer problems.
- [Privacy policy](${base}/en/privacy-policy/)
- [Refund policy](${base}/en/refund-policy/)
- [Billing policy](${base}/en/billing-policy/)

## Articles

- [How to Choose Filament for a Custom 3D Print](${base}/en/article-filament/): Compare PLA, PETG, ABS, ASA, TPU, strength, heat resistance, surface finish, and use-case requirements.
- [How to Get More Reliable PLA 3D Prints](${base}/en/article-reliable-pla/): A repeatable workflow covering build-surface preparation, first-layer calibration, nozzle temperature, cooling, drying, and print quality.
- [First-Layer Problems, Warping, and Failed PLA Prints](${base}/en/article-first-layer/): Diagnose adhesion, leveling, nozzle height, warping, curling, elephant's foot, and early print failures.

## Languages

Localized pages are available in English, Spanish, Brazilian Portuguese, French, German, Italian, Japanese, Korean, and Chinese under their language paths: /en/, /es/, /pt-br/, /fr/, /de/, /it/, /ja/, /ko/, and /zh/.

## Contact and quoting

The site provides a custom-print request form. Pricing is based on the parameters shown to the customer rather than undisclosed fees. Human review may be needed before a final quote or production decision.

## Machine-readable resources

- [Sitemap](${base}/sitemap.xml)
- [Robots.txt](${base}/robots.txt)
`;

export function GET() {
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
