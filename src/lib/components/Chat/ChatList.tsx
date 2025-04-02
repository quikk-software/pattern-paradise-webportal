'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetChatResponse } from '@/@types/api-types';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import dayjs from '@/lib/core/dayjs';
import { PulsatingDot } from '@/lib/components/Chat/PulsatingDot';

interface ChatListProps {
  showChatList: boolean;
  fetchChatsIsLoading: boolean;
  chats: GetChatResponse[];
  bottomNavHeight: number;
  navbarHeight: number;
  handleChatSelect: (chat: GetChatResponse) => void;
}

export default function ChatList({
  showChatList,
  fetchChatsIsLoading,
  chats,
  bottomNavHeight,
  navbarHeight,
  handleChatSelect,
}: ChatListProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  return (
    <div
      className={cn('bg-white w-full md:w-1/3', {
        block: showChatList,
        'hidden md:block': !showChatList,
      })}
      style={{
        height: `calc(100svh - ${bottomNavHeight}px - ${navbarHeight})`,
      }}
    >
      <Card
        style={{
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chats</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {fetchChatsIsLoading ? <LoadingSpinnerComponent /> : null}
          {chats.length === 0 && !fetchChatsIsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Chats Yet</h3>
              <p className="text-text-primary mb-4">
                Start a Chat with a Seller by clicking on the Chat Icon in their Profile or{' '}
                <Link
                  rel={'nofollow'}
                  href="/app/secure/auth/me/orders"
                  className="text-blue-500 underline"
                >
                  through the Actions in your Orders
                </Link>
                .
              </p>
              <Link rel={'nofollow'} href="/">
                <Button>Find Patterns</Button>
              </Link>
            </div>
          ) : null}
          <div className="space-y-2">
            {chats.map((chat) => {
              const correspondence = chat.participants.find((p) => p.userId !== userId)?.user;
              const hasNewMessages =
                !chat?.latestChatMessage?.isRead && chat.latestChatMessage?.creatorId !== userId;
              return (
                <div
                  key={chat.id}
                  className="flex items-center gap-2 justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-lg mb-2"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center overflow-hidden">
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarImage src={correspondence?.imageUrl} />
                      <AvatarFallback>
                        {correspondence?.firstName?.at(0)}
                        {correspondence?.lastName?.at(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <h3 className="font-semibold truncate max-w-full sm:max-w-[12rem] md:max-w-[10rem] lg:max-w-[14rem]">
                        {correspondence?.username}
                      </h3>
                      <p
                        className={`text-sm ${hasNewMessages ? 'font-bold text-black' : 'font-medium text-gray-500'} truncate max-w-full sm:max-w-[12rem] md:max-w-[10rem] lg:max-w-[14rem]`}
                      >
                        {chat?.latestChatMessage?.message ?? ''}
                      </p>
                    </div>
                  </div>
                  {hasNewMessages ? (
                    <PulsatingDot size={'sm'} />
                  ) : chat?.latestChatMessage?.createdAt ? (
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {dayjs(chat?.latestChatMessage?.createdAt)?.fromNow()}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
