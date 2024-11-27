'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Volleyball, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  background: 'primary' | 'none';
}

export function NavbarComponent({ background }: NavbarComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNavLinks = NAV_LINKS.filter((link) => link.enabled);

  return (
    <nav ref={navRef} className={`bg-${background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className={`text-lg font-bold text-${
                background === 'primary' ? 'white' : 'black'
              } flex gap-2 items-center`}
            >
              <Volleyball />
              <span>Pattern Paradise</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center flex flex-row gap-4">
            <div className="flex space-x-4">
              {filteredNavLinks.map(({ href, name }) => (
                <NavLink key={name} href={href} background={background}>
                  {name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md text-${
                background === 'primary' ? 'white' : 'black'
              } hover:text-${background === 'primary' ? 'white' : 'black'} hover:bg-${
                background === 'primary' ? 'white' : 'black'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${
                background === 'primary' ? 'white' : 'black'
              }`}
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
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {filteredNavLinks.map(({ href, name }) => (
            <MobileNavLink background={background} key={name} href={href}>
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
  children,
}: {
  href: string;
  background: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-${background === 'primary' ? 'white' : 'black'} hover:text-${
        background === 'primary' ? 'white' : 'gray-900'
      } px-3 py-2 rounded-md text-sm font-medium`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  background,
  children,
}: {
  background: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-${
        background === 'primary' ? 'white' : 'gray-600'
      } hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium`}
    >
      {children}
    </Link>
  );
}
