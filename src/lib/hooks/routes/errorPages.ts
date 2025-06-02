import type { Page } from './routes.types';

const errorPages: Page[] = [
  {
    title: 'Error',
    pathname: '/en/not-found',
    description: 'Die aufgerufene Seite ist nicht erreichbar.',
  },
  {
    title: 'Error',
    pathname: '/en/error',
    description: 'Es ist ein Fehler aufgetreten.',
  },
  {
    title: 'Error',
    pathname: '/en/_error',
    description: 'Es ist ein Fehler aufgetreten.',
  },
];

export default errorPages;
