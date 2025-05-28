'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { GetUserAccountResponse } from '@/@types/api-types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  THEME_BG_CLASSES,
  THEME_FROM_BG_CLASSES,
  THEME_TEXT_CLASSES,
  THEME_TO_BG_CLASSES,
  THEME_VIA_BG_CLASSES,
} from '@/lib/constants';
import React from 'react';

interface UserTesterShoutoutCardProps {
  user: GetUserAccountResponse;
}

export default function UserTesterShoutoutCard({ user }: UserTesterShoutoutCardProps) {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  return (
    <Card className="group relative overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
      <div className={`absolute inset-0 bg-gradient-to-br from-background to-background z-0`} />
      {user.bannerImageUrl ? (
        <div className="relative h-16 w-full overflow-hidden">
          <Image
            src={user.bannerImageUrl}
            alt="Profile banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0" />
        </div>
      ) : (
        <div
          className={`relative h-16 w-full bg-gradient-to-r opacity-30 ${THEME_FROM_BG_CLASSES[user.theme]} ${THEME_VIA_BG_CLASSES[user.theme]} ${THEME_TO_BG_CLASSES[user.theme]}`}
        />
      )}

      <div className={cn('relative px-2 pb-4 pt-4')}>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full items-start justify-between">
            <Link href={`/users/${user.id}`} className="group/link flex items-start space-x-4">
              <Avatar className="h-14 w-14 border-4 border-background shadow-lg transition-transform duration-300 group-hover/link:scale-105">
                <AvatarImage src={user.imageUrl} alt={fullName || user.username} />
                <AvatarFallback
                  className={`${THEME_BG_CLASSES[user.theme]} bg-opacity-20 text-xl font-bold ${THEME_TEXT_CLASSES[user.theme]}`}
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="mt-1">
                {fullName && (
                  <h2 className="text-md font-bold tracking-tight text-foreground transition-colors duration-200">
                    {fullName}
                  </h2>
                )}
                <p
                  className={`${fullName ? 'text-xs' : 'text-md'} font-medium ${fullName ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  @{user.username}
                </p>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {user?.followers ?? 0}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user?.followers === 1 ? 'Follower' : 'Followers'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
