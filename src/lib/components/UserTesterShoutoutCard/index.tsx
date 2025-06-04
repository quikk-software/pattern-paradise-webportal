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
import StarRating from '@/lib/components/StarRating';
import { Label } from '@/components/ui/label';

interface UserTesterShoutoutCardProps {
  tester: GetUserAccountResponse;
  productOwner: GetUserAccountResponse;
  starRating?: number;
  textRating?: string;
}

export default function UserTesterShoutoutCard({
  tester,
  productOwner,
  starRating,
  textRating,
}: UserTesterShoutoutCardProps) {
  const fullName = `${tester.firstName ?? ''} ${tester.lastName ?? ''}`.trim();

  return (
    <Card className="group relative overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
      <div className={`absolute inset-0 bg-gradient-to-br from-background to-background z-0`} />
      {tester.bannerImageUrl ? (
        <div className="relative h-16 w-full overflow-hidden">
          <Image
            src={tester.bannerImageUrl}
            alt="Profile banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0" />
        </div>
      ) : (
        <div
          className={`relative h-16 w-full bg-gradient-to-r opacity-30 ${THEME_FROM_BG_CLASSES[tester.theme]} ${THEME_VIA_BG_CLASSES[tester.theme]} ${THEME_TO_BG_CLASSES[tester.theme]}`}
        />
      )}

      <div className={cn('relative px-2 pb-4 pt-4')}>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full items-start justify-between">
            <Link href={`/users/${tester.id}`} className="group/link flex items-start space-x-4">
              <Avatar className="h-14 w-14 border-4 border-background shadow-lg transition-transform duration-300 group-hover/link:scale-105">
                <AvatarImage src={tester.imageUrl} alt={fullName || tester.username} />
                <AvatarFallback
                  className={`${THEME_BG_CLASSES[tester.theme]} bg-opacity-20 text-xl font-bold ${THEME_TEXT_CLASSES[tester.theme]}`}
                >
                  {tester.firstName?.[0]}
                  {tester.lastName?.[0]}
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
                  @{tester.username}
                </p>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {tester?.followers ?? 0}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tester?.followers === 1 ? 'Follower' : 'Followers'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
          {starRating ? (
            <div className="space-y-1 mt-1">
              <Label className="text-sm font-medium text-gray-700">
                Feedback from{' '}
                <Link
                  href={`/users/${productOwner.id}`}
                  rel="nofollow"
                  className="underline italic"
                >
                  @{productOwner.username}
                </Link>
                :
              </Label>
              <StarRating rating={starRating} showCount={false} />
              {textRating ? (
                <div className="text-sm text-gray-700 italic">&quot;{textRating}&quot;</div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
