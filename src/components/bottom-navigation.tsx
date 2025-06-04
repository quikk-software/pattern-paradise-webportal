'use client';

import React, { useEffect, useState } from 'react';
import { Heart, House, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { isInStandaloneMode } from '@/lib/core/utils';
import { usePreview } from '@/app/providers/PreviewFlagProvider';
import { useValidSession } from '@/hooks/useValidSession';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { id: 'shop', label: 'Shop', icon: House, href: '/' },
  { id: 'sell', label: 'Sell', icon: DollarSign, href: '/app/secure/sell' },
  { id: 'swipe', label: 'Swipe', icon: Heart, href: '/app/swipe', featured: true },
  { id: 'test', label: 'Test', icon: PatternParadiseIcon, href: '/app/tester-calls' },
  { id: 'me', label: 'Me', icon: User, href: '/app/secure/auth/me' },
];

export function BottomNavigation() {
  const [isStandalone, setIsStandalone] = useState(false);

  const { isPreview } = usePreview();
  const { data: session } = useValidSession();

  useEffect(() => {
    setIsStandalone(isInStandaloneMode());
  }, []);

  const { push } = useRouter();

  if (isPreview) {
    return null;
  }

  return (
    <div className={`bg-white ${isStandalone ? 'pb-4' : 'pb-0'}`} id="bottom-navigation">
      <style jsx global>{`
        @keyframes slow-pulse {
          0%,
          100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.4;
          }
        }
        .slow-pulse {
          animation: slow-pulse 3s ease-in-out infinite;
        }

        @keyframes slow-ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .slow-ping {
          animation: slow-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
      <div className="z-50 w-full h-16 bg-background border-t border-border">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                'px-3 hover:bg-muted/50 group transition-all duration-300 inline-flex flex-col items-center justify-center relative',
                item.featured && 'transform hover:scale-105',
              )}
              onClick={() => {
                push(item.href);
              }}
            >
              {item.featured ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full blur-sm opacity-75 slow-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 rounded-full slow-ping opacity-20" />

                  <div className="relative bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full p-3 shadow-lg transform hover:scale-110 transition-all duration-300">
                    <item.icon
                      className={cn(
                        'w-6 h-6 text-white transition-all duration-200 group-hover:rotate-12',
                      )}
                    />
                  </div>
                </div>
              ) : session?.user.image && item.id === 'me' ? (
                <Avatar className="w-8 h-8 transition-all duration-200 group-hover:scale-110">
                  <AvatarImage src={session.user.image} alt="Profile" />
                </Avatar>
              ) : (
                <item.icon
                  className={cn('w-8 h-8 transition-all duration-200 group-hover:scale-110')}
                  strokeWidth={item.id === 'test' ? '16' : undefined}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
