'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    href: '/about',
    name: 'About',
    enabled: true,
  },
  {
    href: '/faq',
    name: 'FAQ',
    enabled: true,
  },
  {
    href: '/help',
    name: 'Help',
    enabled: true,
  },
  {
    href: '/pro',
    name: 'Pro',
    enabled: process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE === 'true',
  },
  {
    href: '/terms-and-privacy',
    name: 'Terms and Privacy',
    enabled: true,
  },
];

interface NavbarComponentProps {
  background: 'primary' | 'amber-200' | 'none';
  scrolled: boolean;
}

export function NavbarComponent({ background, scrolled }: NavbarComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const filteredNavLinks = NAV_LINKS.filter((link) => link.enabled);

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
        <div className="hidden sm:ml-6 sm:flex sm:items-center flex flex-row gap-4">
          <div className="flex space-x-4">
            {filteredNavLinks.map(({ href, name }) => (
              <NavLink key={name} href={href} scrolled={scrolled} background={background}>
                {name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center sm:hidden">
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

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
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
        'block px-3 py-2 rounded-md text-base font-medium',
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
