'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import React from 'react';
import { useValidSession } from '@/hooks/useValidSession';

export default function TestingQuickLinks() {
  const { status } = useValidSession();

  const pathname = usePathname();

  const links = [
    {
      title: 'My Tester Chats',
      href: '/app/secure/test/chats',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'View your chats with testers',
    },
    {
      title: 'My Testings',
      href: '/app/secure/test/testings',
      icon: <PatternParadiseIcon className="h-5 w-5" />,
      description: 'Show testings in which you take part',
    },
  ];

  const isLoggedIn = status === 'authenticated';

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="grid gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-colors
                  ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`
                    p-2 rounded-full 
                    ${isActive ? 'bg-primary/20' : 'bg-muted'}
                  `}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <div className="font-medium">{link.title}</div>
                    <div className="text-sm text-muted-foreground">{link.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
