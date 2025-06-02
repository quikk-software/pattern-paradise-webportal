import type { Page } from './routes.types';
import { BreadcrumbConfig } from './routes.types';
import errorPages from '@/lib/hooks/routes/errorPages';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const flattenPages = (pages: Page[]) => {
  const flattenedPages: Page[] = [];
  pages.forEach((p) => {
    flattenedPages.push(p);
    if (p.children) {
      flattenedPages.push(...flattenPages(p.children));
    }
  });
  return flattenedPages;
};

const createBreadcrumbConfig = (
  pages: Page[],
  parent: BreadcrumbConfig[] = [],
): BreadcrumbConfig[][] => {
  const bcConfig: BreadcrumbConfig[][] = [];
  flattenPages(pages).forEach((p) => {
    if (p.children) {
      bcConfig.push(
        ...createBreadcrumbConfig(p.children, [
          { pathname: p.pathname, title: p.title },
          ...parent,
        ]),
      );
    }
    bcConfig.push([{ pathname: p.pathname, title: p.title }, ...parent]);
  });
  return bcConfig;
};

const pages: Page[] = [
  {
    title: APP_NAME,
    pathname: '/en/',
    description: APP_DESCRIPTION,
  },
  {
    title: 'Pattern Paradise Pro | Pattern Paradise',
    pathname: '/en/pro',
    description:
      'Unlock powerful features with Pattern Paradise Pro and boost your creative business.',
  },
  {
    title: 'About Us | Pattern Paradise',
    pathname: '/en/about',
    description:
      'Learn about Pattern Paradise’s mission to empower creators with stunning patterns.',
  },
  {
    title: 'How To | Pattern Paradise',
    pathname: '/en/how-to',
    description:
      'Discover how to use Pattern Paradise with easy guides for uploading patterns, joining tester calls, and collaborating with the crafting community.',
  },
  {
    title: 'Imprint | Pattern Paradise',
    pathname: '/en/imprint',
    description: 'View official legal information and company details for Pattern Paradise.',
  },
  {
    title: 'Help Center | Pattern Paradise',
    pathname: '/en/help',
    description: 'Get help and find support resources for using Pattern Paradise effectively.',
  },
  {
    title: 'Privacy Policy & Terms | Pattern Paradise',
    pathname: '/en/terms-and-privacy',
    description: 'Review Pattern Paradise’s privacy policies and terms and conditions.',
  },
  {
    title: 'Login | Pattern Paradise',
    pathname: '/en/auth/login',
    description: 'Access your Pattern Paradise account to manage your profile, orders, and more.',
  },
  {
    title: 'Reset Password | Pattern Paradise',
    pathname: '/en/auth/reset-password',
    description: 'Reset your password securely for your Pattern Paradise account.',
  },
  {
    title: 'Tester Calls Hub | Pattern Paradise',
    pathname: '/en/app/tester-calls',
    description: 'Explore active tester calls and testing opportunities on Pattern Paradise.',
  },
  {
    title: 'Mystery Pattern | Pattern Paradise',
    pathname: '/en/app/products/mystery-patterns/crochet',
    description:
      'Shop exclusive mystery patterns and enjoy surprise designs from Pattern Paradise.',
  },
  {
    title: 'Swipe Patterns | Pattern Paradise',
    pathname: '/en/swipe',
    description:
      'Discover new patterns by swiping — a fun and unique browsing experience at Pattern Paradise.',
  },
  {
    title: 'Browse Patterns | Pattern Paradise',
    pathname: '/en/browse',
    description:
      'Use advanced filters to find and select the perfect patterns on Pattern Paradise.',
  },

  {
    title: APP_NAME,
    pathname: '/de/',
    description: APP_DESCRIPTION,
  },
  {
    title: 'Pattern Paradise Pro | Pattern Paradise',
    pathname: '/de/pro',
    description:
      'Schalte leistungsstarke Funktionen mit Pattern Paradise Pro frei und bringe dein kreatives Business voran.',
  },
  {
    title: 'Über uns | Pattern Paradise',
    pathname: '/de/about',
    description:
      'Erfahre mehr über die Mission von Pattern Paradise, Kreative mit atemberaubenden Mustern zu unterstützen.',
  },
  {
    title: 'Anleitung | Pattern Paradise',
    pathname: '/de/how-to',
    description:
      'Lerne, wie du Pattern Paradise nutzt – mit einfachen Anleitungen zum Hochladen von Mustern, zur Teilnahme an Testaufrufen und zur Zusammenarbeit in der Handarbeits-Community.',
  },
  {
    title: 'Impressum | Pattern Paradise',
    pathname: '/de/imprint',
    description: 'Offizielle rechtliche Informationen und Unternehmensdetails zu Pattern Paradise.',
  },
  {
    title: 'Hilfezentrum | Pattern Paradise',
    pathname: '/de/help',
    description:
      'Finde Hilfe und Support-Ressourcen für die effektive Nutzung von Pattern Paradise.',
  },
  {
    title: 'Datenschutz & AGB | Pattern Paradise',
    pathname: '/de/terms-and-privacy',
    description:
      'Lies die Datenschutzrichtlinien und Allgemeinen Geschäftsbedingungen von Pattern Paradise.',
  },
  {
    title: 'Login | Pattern Paradise',
    pathname: '/de/auth/login',
    description:
      'Melde dich bei deinem Pattern Paradise-Konto an, um dein Profil, deine Bestellungen und mehr zu verwalten.',
  },
  {
    title: 'Passwort zurücksetzen | Pattern Paradise',
    pathname: '/de/auth/reset-password',
    description: 'Setze dein Passwort für dein Pattern Paradise-Konto sicher zurück.',
  },
  {
    title: 'Tester-Calls-Zentrale | Pattern Paradise',
    pathname: '/de/app/tester-calls',
    description: 'Entdecke aktive Tester-Calls und Testmöglichkeiten auf Pattern Paradise.',
  },
  {
    title: 'Mystery-Muster | Pattern Paradise',
    pathname: '/de/app/products/mystery-patterns/crochet',
    description:
      'Kaufe exklusive Mystery-Muster und freue dich auf Überraschungsdesigns von Pattern Paradise.',
  },
  {
    title: 'Swipe-Muster | Pattern Paradise',
    pathname: '/de/swipe',
    description:
      'Entdecke neue Muster durch Swipen – ein unterhaltsames und einzigartiges Stöbererlebnis bei Pattern Paradise.',
  },
  {
    title: 'Muster durchsuchen | Pattern Paradise',
    pathname: '/de/browse',
    description:
      'Nutze erweiterte Filter, um die perfekten Muster auf Pattern Paradise zu finden und auszuwählen.',
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
