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
  THEME_BORDER_CLASSES,
  THEME_FROM_BG_CLASSES,
  THEME_TEXT_CLASSES,
  THEME_TO_BG_CLASSES,
  THEME_VIA_BG_CLASSES,
} from '@/lib/constants';

interface UserDetailsCardProps {
  user: GetUserAccountResponse;
  showFlag?: boolean;
  showRoles?: boolean;
  hasProducts?: boolean;
}

export default function UserDetailsCard({
  user,
  showFlag = true,
  showRoles = false,
  hasProducts = false,
}: UserDetailsCardProps) {
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
    <Card className="group relative overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${THEME_FROM_BG_CLASSES[user.theme]} bg-opacity-5 to-background z-0`}
      />
      <div
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${THEME_BG_CLASSES[user.theme]} bg-opacity-10 blur-3xl`}
      />
      <div
        className={`absolute -left-16 -bottom-16 h-40 w-40 rounded-full ${THEME_BG_CLASSES[user.theme]} bg-opacity-10 blur-3xl`}
      />

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

          {showFlag && (
            <div className="absolute right-4 top-4 z-10">
              <ReportUser userId={user.id} />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative h-24 w-full bg-gradient-to-r ${THEME_FROM_BG_CLASSES[user.theme]} bg-opacity-20 ${THEME_VIA_BG_CLASSES[user.theme]} ${THEME_TO_BG_CLASSES[user.theme]}`}
        >
          {showFlag && (
            <div className="absolute right-4 top-4 z-10">
              <ReportUser userId={user.id} />
            </div>
          )}
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
                  <h2
                    className={`text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/link:${THEME_TEXT_CLASSES[user.theme]}`}
                  >
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
                          className="border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-900 dark:bg-pink-950/30 dark:text-pink-400"
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
                          className="border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400"
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
                      className={`group/btn relative overflow-hidden bg-gradient-to-r ${THEME_FROM_BG_CLASSES[user.theme]} ${THEME_TO_BG_CLASSES[user.theme]} text-primary-foreground transition-all duration-300 hover:shadow-md`}
                      onClick={() => handleChatClick(userId, user.id)}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
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
                    className={`group/shop relative w-full overflow-hidden border-dashed ${THEME_BORDER_CLASSES[user.theme]} bg-opacity-30 ${THEME_BG_CLASSES[user.theme]} transition-all duration-300 hover:${THEME_BORDER_CLASSES[user.theme]}/50 hover:${THEME_BG_CLASSES[user.theme]} hover:bg-opacity-10`}
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
