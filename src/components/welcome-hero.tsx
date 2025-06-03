'use client';

import { useState, useEffect } from 'react';
import { BookHeart, Heart, PlusCircle, ShoppingBag, Star, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { theme } from '@/lib/constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import useLanguage from '@/i18n/useLanguage';

interface WelcomeHeroProps {
  userName?: string;
  avatarUrl?: string;
  themeColor?: string;
  isSeller: boolean;
}

export default function WelcomeHero({
  userName,
  avatarUrl = '',
  themeColor = 'amber',
  isSeller,
}: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState('');

  const { t } = useLanguage();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t('landing:hero.greeting.morning'));
    } else if (hour < 18) {
      setGreeting(t('landing:hero.greeting.afternoon'));
    } else {
      setGreeting(t('landing:hero.greeting.evening'));
    }
  }, []);

  const getThemeColor = (shade: number) => {
    return (theme.colors as any)[themeColor][shade];
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              className="h-16 w-16 border-2"
              style={{
                borderColor: getThemeColor(300),
                boxShadow: `0 0 0 4px ${getThemeColor(50)}`,
              }}
            >
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback
                className="text-xl font-bold"
                style={{
                  backgroundColor: getThemeColor(200),
                  color: getThemeColor(700),
                }}
              >
                {userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold">
                {greeting}
                {userName ? `, ${userName}!` : '!'}
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-3 mt-1"
            >
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {isSeller && (
                <div
                  className="px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: getThemeColor(100),
                    color: getThemeColor(700),
                  }}
                >
                  <Star className="h-3 w-3" />
                  {t('landing:hero.sellerBadge')}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-4 flex items-center">
          <div
            className="w-1 h-5 rounded-full mr-2"
            style={{ backgroundColor: getThemeColor(400) }}
          ></div>
          {t('landing:hero.quickActions')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Primary Action */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="col-span-2 sm:col-span-1"
          >
            {isSeller ? (
              <Link href="/%5Blang%5D/app/secure/sell/submit" className="block">
                <Button
                  className="w-full h-auto py-3 flex flex-col items-center justify-center gap-2"
                  style={{
                    backgroundColor: getThemeColor(600),
                    borderColor: getThemeColor(600),
                  }}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>{t('landing:hero.createPattern')}</span>
                </Button>
              </Link>
            ) : (
              <Link href="/swipe" className="block">
                <Button className="w-full h-auto py-3 flex flex-col items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 border-rose-600">
                  <Heart className="h-5 w-5" />
                  <span>{t('landing:hero.swipePatterns')}</span>
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Secondary Actions */}
          {[
            ...(isSeller
              ? [
                  {
                    href: '/swipe',
                    icon: Heart,
                    label: t('landing:hero.swipe'),
                    delay: 0.2,
                  },
                  {
                    href: '/app/secure/sell/orders',
                    icon: ShoppingBag,
                    label: t('landing:hero.orders'),
                    delay: 0.3,
                  },
                  {
                    href: '/app/secure/sell/testings',
                    icon: PatternParadiseIcon,
                    label: t('landing:hero.testerCalls'),
                    delay: 0.4,
                  },
                ]
              : [
                  {
                    href: 'browse',
                    icon: Search,
                    label: t('landing:hero.browsePatterns'),
                    delay: 0.2,
                  },
                  {
                    href: '/app/tester-calls',
                    icon: PatternParadiseIcon,
                    label: t('landing:hero.testerCalls'),
                    delay: 0.2,
                  },
                ]),
            {
              href: '/app/secure/auth/me',
              icon: Settings,
              label: t('landing:hero.settings'),
              delay: isSeller ? 0.4 : 0.3,
            },
            {
              href: '/app/secure/auth/me/favorites',
              icon: BookHeart,
              label: t('landing:hero.favorites'),
              delay: isSeller ? 0.5 : 0.4,
            },
          ].map((action) => (
            <motion.div
              key={action.href}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: action.delay }}
            >
              <Link href={action.href} className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                  style={{
                    borderColor: getThemeColor(200),
                  }}
                >
                  <action.icon
                    className={cn(
                      'h-5 w-5',
                      action.label === 'Swipe' ? 'text-rose-600 fill-rose-600' : undefined,
                    )}
                    style={{ color: getThemeColor(600) }}
                  />
                  <span>{action.label}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-6"
      >
        <div
          className="p-4 rounded-lg border text-sm"
          style={{
            borderColor: getThemeColor(200),
            backgroundColor: getThemeColor(50),
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <p className="font-medium" style={{ color: getThemeColor(700) }}>
                {t('landing:hero.greetingBox')}
              </p>
              <p className="mt-1 text-muted-foreground">
                {isSeller ? t('landing:hero.greetingSeller') : t('landing:hero.greetingBuyer')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
