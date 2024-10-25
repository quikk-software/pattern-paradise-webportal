'use client';

import { useEffect, useState } from 'react';
import { Store, Tag, TestTube2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { id: 'shop', label: 'Shop', icon: Store, href: '/' },
  { id: 'sell', label: 'Sell', icon: Tag, href: '/sell' },
  { id: 'test', label: 'Test', icon: TestTube2, href: '/test' },
  { id: 'me', label: 'Me', icon: Settings2, href: '/auth/me' },
];

export function BottomNavigation() {
  const [activeItem, setActiveItem] = useState('shop');

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setActiveItem('shop');
      return;
    }
    const element = menuItems
      .filter((menuItem) => menuItem.id !== 'shop')
      .find((menuItem) => menuItem.href.startsWith(pathname) || pathname.startsWith(menuItem.href));
    setActiveItem(element?.id ?? 'shop');
  }, [pathname]);

  const { push } = useRouter();

  return (
    <div
      className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border"
      id="bottom-nav"
    >
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              'px-5 hover:bg-muted/50 group transition-colors inline-flex flex-col items-center justify-center',
              activeItem === item.id && 'text-primary',
            )}
            onClick={() => {
              setActiveItem(item.id);
              push(item.href);
            }}
          >
            <item.icon
              className={cn(
                'w-6 h-6 mb-1 transition-transform group-hover:scale-110',
                activeItem === item.id && 'animate-bounce',
              )}
            />
            <span className="text-xs leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
