'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, SearchIcon, X } from 'lucide-react';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { cn } from '@/lib/utils';
import SocialBadges from '@/lib/components/SocialBadges';
import { usePreview } from '@/app/providers/PreviewFlagProvider';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'use-intl';
import { LanguageSelector } from '@/lib/components/LanguageSelector';

const NAV_LINKS = (t: any) => [
  {
    href: '/about',
    name: t('navbar.about'),
    enabled: true,
  },
  {
    href: '/how-to',
    name: t('navbar.howTo'),
    enabled: true,
  },
  {
    href: '/help',
    name: t('navbar.help'),
    enabled: true,
  },
  {
    href: '/pro',
    name: t('navbar.pro'),
    enabled: process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE === 'true',
  },
  {
    href: '/terms-and-privacy',
    name: t('navbar.terms'),
    enabled: true,
  },
];

interface NavbarComponentProps {
  background: 'primary' | 'amber-200' | 'none';
  scrolled: boolean;
}

export function NavbarComponent({ background, scrolled }: NavbarComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { isPreview } = usePreview();
  const t = useTranslations();
  const locale = useLocale();

  const toggleMenu = () => setIsOpen(!isOpen);

  const filteredNavLinks = NAV_LINKS(t).filter((link) => link.enabled);

  if (isPreview) {
    return null;
  }

  return (
    <nav
      className={cn(
        `px-4 transition-colors duration-300`,
        scrolled ? 'bg-white' : `bg-${background}`,
      )}
      id="navbar"
    >
      <div className="flex justify-between h-16 mx-auto">
        <div className="flex-shrink-0 flex items-center">
          <Link
            href="/"
            className={cn(
              'text-lg font-bold flex gap-1 items-center',
              scrolled ? 'text-black' : background === 'primary' ? 'text-white' : 'text-black',
            )}
          >
            <PatternParadiseIcon
              className={cn(
                'w-8 h-8',
                scrolled ? 'fill-black' : background === 'primary' ? 'fill-white' : 'fill-black',
              )}
            />
            <span>Pattern Paradise</span>
          </Link>
        </div>
        <div className="hidden md:ml-6 md:flex md:items-center flex flex-row gap-4">
          <div className="flex space-x-4 items-center">
            {filteredNavLinks.map(({ href, name }) => (
              <NavLink key={name} href={href} scrolled={scrolled} background={background}>
                {name}
              </NavLink>
            ))}
            <Button size="sm" className="space-x-2" variant="ghost" asChild>
              <Link href="/browse">
                <SearchIcon />
                {t('navbar.browse')}
              </Link>
            </Button>
            <LanguageSelector currentLanguage={locale} />
          </div>
        </div>
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className={cn(
              `inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset`,
              scrolled
                ? 'text-black hover:text-black hover:bg-gray-200 focus:ring-black'
                : background === 'primary'
                  ? 'text-white hover:text-white hover:bg-white focus:ring-white'
                  : 'text-black hover:text-black hover:bg-gray-200 focus:ring-black',
            )}
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-2 space-y-1">
          <MobileNavLink
            href="/browse"
            scrolled={scrolled}
            onClick={() => toggleMenu()}
            background={background}
          >
            {t('navbar.browse')}
          </MobileNavLink>
          {filteredNavLinks.map(({ href, name }) => (
            <MobileNavLink
              key={name}
              href={href}
              scrolled={scrolled}
              onClick={() => toggleMenu()}
              background={background}
            >
              {name}
            </MobileNavLink>
          ))}
        </div>
        <SocialBadges />
        <div className="flex justify-end my-3">
          <LanguageSelector currentLanguage={locale} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  background,
  scrolled,
  children,
}: {
  href: string;
  background: string;
  scrolled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium',
        scrolled
          ? 'text-black hover:text-gray-900'
          : background === 'primary'
            ? 'text-white hover:text-white'
            : 'text-black hover:text-gray-900',
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  background,
  scrolled,
  onClick,
  children,
}: {
  background: string;
  scrolled: boolean;
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block py-2 rounded-md text-base font-medium',
        scrolled
          ? 'text-black hover:text-gray-900'
          : background === 'primary'
            ? 'text-white hover:text-gray-900'
            : 'text-gray-600 hover:text-gray-900',
      )}
    >
      {children}
    </Link>
  );
}
