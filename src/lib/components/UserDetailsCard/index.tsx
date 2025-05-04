'use client';

import { ArrowDown, MessagesSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  return (
    <Card key={user.id} className="relative transition-all overflow-hidden">
      {user.bannerImageUrl ? (
        <div className="relative w-full h-32">
          <Image
            src={user.bannerImageUrl}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <CardHeader className="space-y-2">
        <div className="flex flex-row justify-between items-start gap-2 pt-4">
          <Link href={`/users/${user.id}`}>
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                {user.firstName || user.lastName ? (
                  <h2 className="text-lg font-semibold underline text-blue-500 line-clamp-1">
                    {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
                  </h2>
                ) : null}
                <p
                  className={`${user.firstName && user.lastName ? 'text-sm' : 'text-lg'} text-muted-foreground line-clamp-1`}
                >
                  @{user.username}
                </p>
              </div>
            </div>
          </Link>
          {showFlag ? <ReportUser userId={user.id} /> : null}
        </div>
        <p className="text-sm text-secondary-foreground">{user?.followers ?? 0} Follower</p>
      </CardHeader>
      {showRoles ? (
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2 mb-2 items-center flex-wrap">
            <FollowUserButton initialFollowing={!!user?.isFollowing} userId={user.id} />
            {hasSocialLinks ? (
              <>
                {user.instagramRef ? (
                  <a
                    href={`https://instagram.com/${user.instagramRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="secondary">
                      <InstagramIcon className="w-4 h-4 mr-1" />
                      Instagram
                    </Badge>
                  </a>
                ) : null}
                {user.tiktokRef ? (
                  <a
                    href={`https://tiktok.com/@${user.tiktokRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="secondary">
                      <TikTokIcon className="w-4 h-4 mr-1" />
                      TikTok
                    </Badge>
                  </a>
                ) : null}
              </>
            ) : null}
          </div>
          {!isMe ? (
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-row gap-2">
                {isLoggedIn ? (
                  <Button
                    className="w-full"
                    variant={'outline'}
                    onClick={() => handleChatClick(userId, user.id)}
                  >
                    <MessagesSquare className="w-4 h-4" />
                    Start Chat
                  </Button>
                ) : null}
                {user.paypalEmail ? <TipButton paypalEmail={user.paypalEmail} /> : null}
              </div>
              {hasProducts ? (
                <Link href={'#shop'} className="w-full">
                  <Button variant={'outline'} className="w-full">
                    <ArrowDown className="w-4 h-4" />
                    Go to Shop
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
