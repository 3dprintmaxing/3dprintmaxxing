import { generatePageMetadata } from '../metadata';
export async function generateMetadata({ params }) {
  return generatePageMetadata({ params });
}

export default function LocaleLayout({ children }) {
  return children;
}
