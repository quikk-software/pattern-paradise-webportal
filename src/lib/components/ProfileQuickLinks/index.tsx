'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  ShoppingBag,
  FileText,
  MessageCircle,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Bell,
  Heart,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import React from 'react';

interface QuickLinksProps {
  user: {
    id: string;
    openIncidentsCount: number;
  };
  handleLogout: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export default function ProfileQuickLinks({
  user,
  handleLogout,
  isLoading,
  isSuccess,
  isError,
}: QuickLinksProps) {
  const pathname = usePathname();
  const hasOpenIncidents = user.openIncidentsCount > 0;

  const links = [
    {
      title: 'My Profile',
      href: `/users/${user.id}`,
      icon: <User className="h-5 w-5" />,
      description: 'View your profile information',
    },
    {
      title: 'My Favorites',
      href: '/app/secure/auth/me/favorites',
      icon: <Heart className="h-5 w-5" />,
      description: 'See your favorited patterns',
    },
    {
      title: 'My Patterns',
      href: '/app/secure/auth/me/patterns',
      icon: <FileText className="h-5 w-5" />,
      description: 'Access your patterns',
    },
    {
      title: 'My Orders',
      href: '/app/secure/auth/me/orders',
      icon: <ShoppingBag className="h-5 w-5" />,
      description: 'Manage your orders',
    },
    {
      title: 'My Chats',
      href: '/app/secure/chats',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'View your conversations',
    },
    {
      title: 'Open Incidents',
      href: '/app/secure/auth/me/reports',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'View your incidents',
      highlight: hasOpenIncidents,
      count: user.openIncidentsCount,
    },
    {
      title: 'Notification Settings',
      href: '/app/secure/auth/me/notifications',
      icon: <Bell className="h-5 w-5" />,
      description: 'View your notification settings',
    },
  ];

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
                  ${link.highlight ? 'border border-red-500' : ''}
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
                <div className="flex items-center gap-2">
                  {link.count && link.highlight && (
                    <Badge variant="destructive">{link.count}</Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            disabled={isLoading}
            className="w-full"
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </span>
          </Button>

          {isError && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Failed to log out. Please consider reloading the page and try again.
            </p>
          )}

          {isSuccess && (
            <p className="text-sm text-green-500 mt-2 text-center">Successfully logged out!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
