'use client';

import { ArrowDown, MessagesSquare, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import type { GetUserAccountResponse } from '@/@types/api-types';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import { ReportUser } from '@/lib/components/ReportUser';
import { Button } from '@/components/ui/button';
import { useCreateChat } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { Store } from '@/lib/redux/store';
import { useValidSession } from '@/hooks/useValidSession';
import Image from 'next/image';
import { TipButton } from '@/lib/components/TipButton';
import FollowUserButton from '@/lib/components/FollowUserButton';
import { cn } from '@/lib/utils';
import {
  THEME_BG_CLASSES,
  THEME_FROM_BG_CLASSES,
  THEME_TEXT_CLASSES,
  THEME_TO_BG_CLASSES,
  THEME_VIA_BG_CLASSES,
} from '@/lib/constants';
import Description from '@/lib/components/Description';
import { ActionButtons } from '@/lib/components/UserActionButtons';
import React from 'react';

interface UserDetailsCardLightProps {
  user: GetUserAccountResponse;
  showFlag?: boolean;
  showRoles?: boolean;
  hasProducts?: boolean;
}

export default function UserDetailsCardLight({
  user,
  showFlag = true,
  showRoles = false,
  hasProducts = false,
}: UserDetailsCardLightProps) {
  const { userId } = useSelector((store: Store) => store.auth);
  const { status } = useValidSession();
  const { mutate: createChat } = useCreateChat();
  const router = useRouter();

  const handleChatClick = (initiatorUserId: string, correspondenceUserId: string) => {
    createChat([correspondenceUserId, initiatorUserId]).then((chatId) => {
      router.push(`/app/secure/chats?chatId=${chatId}`);
    });
  };

  const hasSocialLinks = user.instagramRef || user.tiktokRef;
  const isMe = userId === user.id;
  const isLoggedIn = status === 'authenticated';
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  return (
    <Card className="group relative overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
      <div className={`absolute inset-0 bg-gradient-to-br from-background to-background z-0`} />
      {user.bannerImageUrl ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={user.bannerImageUrl || '/placeholder.svg'}
            alt="Profile banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0" />

          <ActionButtons showFlag={showFlag} isMe={isMe} userId={user.id} />
        </div>
      ) : (
        <div
          className={`relative h-24 w-full bg-gradient-to-r opacity-30 ${THEME_FROM_BG_CLASSES[user.theme]} ${THEME_VIA_BG_CLASSES[user.theme]} ${THEME_TO_BG_CLASSES[user.theme]}`}
        >
          <ActionButtons showFlag={showFlag} isMe={isMe} userId={user.id} />
        </div>
      )}

      <div className={cn('relative px-6 pb-6 pt-6')}>
        <div className="flex flex-col items-start space-y-4">
          <div className="flex w-full items-start justify-between">
            <Link href={`/users/${user.id}`} className="group/link flex items-start space-x-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg transition-transform duration-300 group-hover/link:scale-105">
                <AvatarImage
                  src={user.imageUrl || '/placeholder.svg'}
                  alt={fullName || user.username}
                />
                <AvatarFallback
                  className={`${THEME_BG_CLASSES[user.theme]} bg-opacity-20 text-xl font-bold ${THEME_TEXT_CLASSES[user.theme]}`}
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="mt-2">
                {fullName && (
                  <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200">
                    {fullName}
                  </h2>
                )}
                <p
                  className={`${fullName ? 'text-sm' : 'text-lg'} font-medium ${fullName ? 'text-muted-foreground' : 'text-foreground'}`}
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

          <Description description={user.description} theme={user.theme} />

          {showRoles && (
            <div className="w-full space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <FollowUserButton initialFollowing={!!user?.isFollowing} userId={user.id} />

                {hasSocialLinks && (
                  <div className="flex flex-wrap gap-2">
                    {user.instagramRef && (
                      <a
                        href={`https://instagram.com/${user.instagramRef}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social flex items-center transition-all duration-200 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge
                          variant="outline"
                          className="border-pink-100 bg-transparent text-foreground dark:border-pink-900/30 dark:bg-transparent"
                        >
                          <InstagramIcon className="mr-1 h-4 w-4" />
                          <span>Instagram</span>
                          <ExternalLink className="ml-1 h-3 w-3 transition-opacity duration-200" />
                        </Badge>
                      </a>
                    )}

                    {user.tiktokRef && (
                      <a
                        href={`https://tiktok.com/@${user.tiktokRef}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social flex items-center transition-all duration-200 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge
                          variant="outline"
                          className="border-slate-100 bg-transparent text-foreground dark:border-slate-800/30 dark:bg-transparent"
                        >
                          <TikTokIcon className="mr-1 h-4 w-4" />
                          <span>TikTok</span>
                          <ExternalLink className="ml-1 h-3 w-3 transition-opacity duration-200" />
                        </Badge>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {!isMe && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {isLoggedIn && (
                    <Button
                      className={`group/btn relative ${THEME_BG_CLASSES[user.theme]} hover:${THEME_BG_CLASSES[user.theme]} focus:${THEME_BG_CLASSES[user.theme]} overflow-hidden text-primary-foreground transition-all duration-300 hover:shadow-sm`}
                      onClick={() => handleChatClick(userId, user.id)}
                    >
                      <MessagesSquare className="mr-2 h-4 w-4" />
                      <span>Start Chat</span>
                    </Button>
                  )}

                  {user.paypalEmail && (
                    <div className="w-full">
                      <TipButton paypalEmail={user.paypalEmail} />
                    </div>
                  )}
                </div>
              )}

              {hasProducts && !isMe && (
                <Link href="#shop" className="mt-2 block w-full">
                  <Button
                    variant="outline"
                    className="group/shop relative w-full overflow-hidden border transition-all duration-300"
                  >
                    <div className="flex w-full items-center justify-center space-x-2">
                      <ArrowDown className="h-4 w-4 animate-bounce" />
                      <span className="font-medium">View Shop</span>
                      <ArrowDown className="h-4 w-4 animate-bounce" />
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
