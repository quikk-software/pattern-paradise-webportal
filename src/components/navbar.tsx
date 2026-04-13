'use client';

import React, { KeyboardEvent, useRef } from 'react';

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

  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

    searchInputRef.current?.blur();

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
      {/* Main Navbar - Pill-shaped floating bar */}
      <nav
        className={cn(
          `mx-4 mt-2 px-4 transition-all duration-500 relative z-10 rounded-full`,
          scrolled && (!showSearch || !searchVisible) 
            ? 'bg-card/70 backdrop-blur-xl shadow-clay-card' 
            : background === 'primary' 
              ? 'bg-primary/90 backdrop-blur-md' 
              : background === 'amber-200' 
                ? 'bg-tertiary/30 backdrop-blur-md' 
                : 'bg-transparent',
        )}
        id="navbar"
      >
        <div className="flex justify-between h-16 mx-auto">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className={cn(
                'text-lg font-display font-bold flex gap-2 items-center transition-colors duration-300',
                scrolled 
                  ? 'text-foreground' 
                  : background === 'primary' 
                    ? 'text-primary-foreground' 
                    : 'text-foreground',
              )}
            >
              <PatternParadiseIcon
                className={cn(
                  'w-8 h-8 transition-colors duration-300',
                  scrolled 
                    ? 'fill-foreground' 
                    : background === 'primary' 
                      ? 'fill-primary-foreground' 
                      : 'fill-foreground',
                )}
              />
              <span>
                Pattern <span className={cn(
                  'italic transition-colors duration-300',
                  scrolled || background !== 'primary' ? 'text-primary' : 'text-primary-foreground'
                )}>Paradise</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center flex flex-row gap-4">
            <div className="flex space-x-2 items-center">
              {filteredNavLinks.map(({ href, name }) => (
                <NavLink key={name} href={href} scrolled={scrolled} background={background}>
                  {name}
                </NavLink>
              ))}
              <Button size="sm" className="space-x-2" variant="ghost" asChild>
                <Link href="/browse">
                  <SearchIcon className="h-4 w-4" />
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
                `inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30`,
                scrolled
                  ? 'text-foreground hover:bg-muted'
                  : background === 'primary'
                    ? 'text-primary-foreground hover:bg-primary-foreground/10'
                    : 'text-foreground hover:bg-muted',
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

        {/* Mobile Menu - Full screen overlay */}
        <div className={cn(
          `md:hidden fixed inset-0 top-16 z-50 transition-all duration-500`,
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}>
          <div className="bg-background/95 backdrop-blur-xl min-h-screen p-6 space-y-4">
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
            <div className="pt-4">
              <SocialBadges />
            </div>
            <div className="flex justify-start pt-4">
              <LanguageSelector currentLanguage={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="relative">
        <div
          className={cn(
            'bg-card/70 backdrop-blur-xl transition-all duration-500 ease-out overflow-hidden border-b border-border/50 absolute top-0 left-0 right-0 mx-4 rounded-b-3xl shadow-clay-card',
            searchVisible && showSearch ? 'max-h-[80px] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <div className="flex items-center bg-muted rounded-full shadow-clay-pressed hover:shadow-clay-card transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/25 focus-within:shadow-clay-card">
                  <div className="flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-12 px-4 text-muted-foreground hover:text-foreground rounded-l-full rounded-r-none border-r border-border/50"
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
                      <DropdownMenuContent align="start" className="w-56 rounded-2xl shadow-clay-card bg-card/95 backdrop-blur-md border-border/50">
                        <DropdownMenuItem
                          onClick={() => setSelectedCategory('All')}
                          className={cn(
                            'cursor-pointer flex justify-between rounded-xl transition-colors duration-300',
                            selectedCategory === 'All' && 'bg-primary-soft/30 text-primary',
                          )}
                        >
                          <span>{t('common.categories.all')}</span>
                        </DropdownMenuItem>
                        {CATEGORIES.map(({ name: category }) => (
                          <DropdownMenuItem
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              'cursor-pointer flex justify-between rounded-xl transition-colors duration-300',
                              selectedCategory === category && 'bg-primary-soft/30 text-primary',
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
                    <input
                      type="text"
                      ref={searchInputRef}
                      placeholder={t('browse.filter.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full border-0 bg-transparent text-ellipsis line-clamp-1 focus:outline-none h-12 text-foreground placeholder:text-muted-foreground px-4"
                    />

                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    className="h-12 px-6 rounded-r-full rounded-l-none flex-shrink-0"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">{t('browse.filter.searchButton')}</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
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
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-muted/50',
        scrolled
          ? 'text-foreground hover:text-primary'
          : background === 'primary'
            ? 'text-primary-foreground hover:bg-primary-foreground/10'
            : 'text-foreground hover:text-primary',
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
      className="block py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-300 text-foreground hover:bg-muted hover:text-primary"
    >
      {children}
    </Link>
  );
}
