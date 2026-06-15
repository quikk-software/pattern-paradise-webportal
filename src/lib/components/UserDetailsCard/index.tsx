'use client';

import { ArrowDown, MessagesSquare, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import type { GetUserAccountResponse } from '@/@types/api-types';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import { Button } from '@/components/ui/button';
import { useCreateChat } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { Store } from '@/lib/redux/store';
import { useValidSession } from '@/hooks/useValidSession';
import Image from 'next/image';
import { TipButton } from '@/lib/components/TipButton';
import FollowUserButton from '@/lib/components/FollowUserButton';
import {
  THEME_BG_CLASSES,
  THEME_BORDER_CLASSES,
  THEME_FROM_BG_CLASSES,
  THEME_TEXT_CLASSES,
  THEME_TO_BG_CLASSES,
  THEME_VIA_BG_CLASSES,
} from '@/lib/constants';
import Description from '@/lib/components/Description';
import React from 'react';
import { ActionButtons } from '@/lib/components/UserActionButtons';
import StarRating from '@/lib/components/StarRating';

interface UserDetailsCardProps {
  user: GetUserAccountResponse;
  showFlag?: boolean;
  showRoles?: boolean;
  hasProducts?: boolean;
}

// Banners are stored at a fixed 4:1 ratio (enforced by the upload cropper). For
// any legacy banner we still fill the 4:1 box without distortion via Cloudinary.
const toBannerUrl = (url: string) =>
  url.includes('/upload/') ? url.replace('/upload/', '/upload/c_fill,ar_4:1,g_auto/') : url;

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
    <Card className="group relative overflow-hidden border-none shadow-card transition-all duration-300 hover:shadow-card-hover">
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${THEME_FROM_BG_CLASSES[user.theme]} bg-opacity-5 to-background`}
      />
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${THEME_BG_CLASSES[user.theme]} bg-opacity-10 blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full ${THEME_BG_CLASSES[user.theme]} bg-opacity-10 blur-3xl`}
      />

      {/* Banner, fixed 4:1 so it always renders cleanly regardless of the source image */}
      <div className="relative aspect-[4/1] w-full overflow-hidden">
        {user.bannerImageUrl ? (
          <Image
            src={toBannerUrl(user.bannerImageUrl)}
            alt="Profile banner"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-r ${THEME_FROM_BG_CLASSES[user.theme]} bg-opacity-20 ${THEME_VIA_BG_CLASSES[user.theme]} ${THEME_TO_BG_CLASSES[user.theme]}`}
          />
        )}
        <ActionButtons showFlag={showFlag} isMe={isMe} userId={user.id} />
      </div>

      {/* Identity block, avatar overlaps the banner bottom-left */}
      <div className="relative z-[1] px-4 pb-6 sm:px-6">
        <div className="flex items-end justify-between gap-3">
          <Link
            href={`/users/${user.id}`}
            aria-label={`${fullName || user.username} profile`}
            className="group/link -mt-10 inline-block rounded-full sm:-mt-12"
          >
            <Avatar className="h-20 w-20 border-4 border-card shadow-lg transition-transform duration-300 group-hover/link:scale-105 sm:h-24 sm:w-24">
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
          </Link>

          {showRoles && (
            <div className="flex flex-wrap items-center justify-end gap-2 pt-4">
              <FollowUserButton initialFollowing={!!user?.isFollowing} userId={user.id} />
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <Link href={`/users/${user.id}`} className="inline-block">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground break-words">
              {fullName || `@${user.username}`}
            </h2>
          </Link>
          {fullName && <p className="text-sm font-medium text-muted-foreground">@{user.username}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{user?.followers ?? 0}</span>{' '}
              {user?.followers === 1 ? 'Follower' : 'Followers'}
            </span>
            {user?.testerRating ? (
              <span className="inline-flex items-center gap-1">
                <StarRating
                  rating={user?.testerRating}
                  totalRatings={user?.testerRatingCount}
                  size="sm"
                />
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <Description description={user.description} theme={user.theme} />
        </div>

        {showRoles && (
          <div className="mt-4 space-y-3">
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
                    <Badge variant="outline" className="border-pink-200 bg-pink-50 text-pink-600">
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
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                      <TikTokIcon className="mr-1 h-4 w-4" />
                      <span>TikTok</span>
                      <ExternalLink className="ml-1 h-3 w-3 transition-opacity duration-200" />
                    </Badge>
                  </a>
                )}
              </div>
            )}

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
              <Link href="#shop" className="block w-full">
                <Button
                  variant="outline"
                  className={`group/shop relative w-full overflow-hidden border-dashed ${THEME_BORDER_CLASSES[user.theme]} bg-opacity-30 ${THEME_BG_CLASSES[user.theme]} transition-all duration-300`}
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
    </Card>
  );
}
