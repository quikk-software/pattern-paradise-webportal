'use client';

import React, { useState, useEffect } from 'react';
import { BookHeart, Heart, PlusCircle, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';

interface WelcomeHeroProps {
  userName?: string;
  avatarUrl?: string;
  isSeller: boolean;
}

export default function WelcomeHero({ userName, avatarUrl = '', isSeller }: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {greeting}
              {userName ? `, ${userName}!` : '!'}
            </h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {isSeller ? (
            <Link href="/app/secure/sell/submit" className="z-10">
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Pattern
              </Button>
            </Link>
          ) : null}
          {isSeller ? (
            <Link href="/app/secure/sell/orders" className="z-10">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Show Orders
              </Button>
            </Link>
          ) : null}
          {isSeller ? (
            <Link href="/app/secure/sell/testings" className="z-10">
              <Button variant="outline" className="flex items-center gap-2">
                <PatternParadiseIcon className="h-4 w-4" />
                My Tester Calls
              </Button>
            </Link>
          ) : (
            <Link href="/app/secure/test" className="z-10">
              <Button variant="outline" className="flex items-center gap-2">
                <PatternParadiseIcon className="h-4 w-4" />
                Show Tester Calls
              </Button>
            </Link>
          )}
          <Link href="/app/secure/auth/me">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Go to Profile
            </Button>
          </Link>
          <Link href="/app/secure/auth/me/favorites">
            <Button variant="outline" className="flex items-center gap-2">
              <BookHeart className="h-4 w-4" />
              Show Favorite Patterns
            </Button>
          </Link>
          <Link href="/swipe">
            <Button variant="outline" className="flex items-center gap-2 bg-rose-700 text-white">
              <Heart className="h-4 w-4" />
              Swipe Patterns
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
