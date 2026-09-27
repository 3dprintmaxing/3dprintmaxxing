import { generateRouteMetadata } from '../../../metadata';

export async function generateMetadata({ params }) {
  const { locale, slug = [] } = await params;
  return generateRouteMetadata({
    locale,
    page: slug.join('/') || 'index',
    segmentCount: slug.length,
  });
}

export default function RouteLayout({ children }) {
  return children;
}
