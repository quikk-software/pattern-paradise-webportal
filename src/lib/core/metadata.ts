import { Metadata } from 'next';
import pages from '@/lib/hooks/routes';

const APP_NAME = 'My Awesome App';
const APP_DESCRIPTION = 'Default description for My Awesome App';
const APP_DOMAIN = 'https://myawesomeapp.com';

export function generatePageMetadata(pathname: string): Metadata {
  const page = pages.find((page) => page.pathname === pathname);

  const title = page?.title ?? APP_NAME;
  const description = page?.description ?? APP_DESCRIPTION;
  const url = APP_DOMAIN + pathname;

  return {
    title,
    description,
    appleWebApp: {
      title,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: title,
    },
  };
}
