'use client';

import React, { KeyboardEvent } from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, SearchIcon, X, ChevronDown, Search, Filter } from 'lucide-react';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { camelCase, cn, getPublicUrl } from '@/lib/utils';
import SocialBadges from '@/lib/components/SocialBadges';
import { usePreview } from '@/app/providers/PreviewFlagProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'use-intl';
import { LanguageSelector } from '@/lib/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORIES } from '@/lib/constants';
import { usePathname, useRouter } from 'next/navigation';

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
  const [searchVisible, setSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { isPreview } = usePreview();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const showSearch = !!getPublicUrl(pathname, ['/']);

  useEffect(() => {
    const scrollArea = document.getElementById('main-scroll-area');
    if (!scrollArea) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = scrollArea.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setSearchVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setSearchVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    scrollArea.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const filteredNavLinks = NAV_LINKS(t).filter((link) => link.enabled);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(`/browse?q=${searchQuery ?? ''}&craft=${selectedCategory}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  if (isPreview) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Main Navbar */}
      <nav
        className={cn(
          `px-4 transition-colors duration-300 relative z-10`,
          scrolled && (!showSearch || !searchVisible) ? 'bg-white shadow-md' : `bg-${background}`,
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

        {/* Mobile Menu */}
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

      <div
        className={cn(
          'bg-white transition-all duration-300 ease-in-out overflow-hidden border-b border-gray-100',
          searchVisible && showSearch ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-auto px-4 py-2">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-12 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg rounded-r-none border-r border-gray-200"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline text-sm font-medium">
                          {selectedCategory === 'All'
                            ? t('common.categories.all')
                            : t(`common.categories.${camelCase(selectedCategory)}`)}
                        </span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onClick={() => setSelectedCategory('All')}
                        className={cn(
                          'cursor-pointer flex justify-between',
                          selectedCategory === 'All' && 'bg-orange-50 text-orange-700',
                        )}
                      >
                        <span>{t('common.categories.all')}</span>
                      </DropdownMenuItem>
                      {CATEGORIES.map(({ name: category }) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            'cursor-pointer flex justify-between',
                            selectedCategory === category && 'bg-orange-50 text-orange-700',
                          )}
                        >
                          <span>
                            {category === 'All'
                              ? t('common.categories.all')
                              : t(`common.categories.${camelCase(category)}`)}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search for patterns, designs, or inspiration..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-0 text-ellipsis line-clamp-1 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-gray-700 placeholder:text-gray-500"
                  />

                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="h-12 px-4 hover:bg-orange-700 text-white rounded-r-lg rounded-l-none flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Search</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
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
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
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
        'block py-2 rounded-md text-base font-medium transition-colors',
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
