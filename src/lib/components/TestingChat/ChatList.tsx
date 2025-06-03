import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetTestingResponse, ListTestingsResponse } from '@/@types/api-types';
import { cn } from '@/lib/utils';
import { PulsatingDot } from '@/lib/components/Chat/PulsatingDot';
import { Badge } from '@/components/ui/badge';

interface ChatListProps {
  showChatList: boolean;
  fetchTestingsIsLoading: boolean;
  testings: GetTestingResponse[];
  bottomNavHeight: number;
  navbarHeight: number;
  refetch: (status?: string[]) => Promise<ListTestingsResponse | undefined>;
  handleChatSelect: (testing: GetTestingResponse) => void;
}

export default function ChatList({
  showChatList,
  fetchTestingsIsLoading,
  testings,
  refetch,
  bottomNavHeight,
  navbarHeight,
  handleChatSelect,
}: ChatListProps) {
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    if (fetchTestingsIsLoading) {
      return;
    }

    if (!showAll) {
      refetch(['InProgress', 'Declined', 'Approved', 'Aborted']).then(() => {
        setShowAll(true);
      });
    } else {
      refetch(['InProgress']).then(() => {
        setShowAll(false);
      });
    }
  };

  return (
    <div
      className={cn('bg-white w-full md:w-1/3 overflow-y-auto', {
        block: showChatList,
        'hidden md:block': !showChatList,
      })}
      style={{
        height: `calc(100svh - ${bottomNavHeight}px - ${navbarHeight}px)`,
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
          <div className="flex">
            <Badge variant={'secondary'} onClick={() => handleShowAll()} className="cursor-pointer">
              {fetchTestingsIsLoading ? (
                <LoadingSpinnerComponent className="w-2 h-2 text-black" />
              ) : null}
              {!showAll ? 'All Chats' : 'In Progress Only'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-y-auto">
          {fetchTestingsIsLoading ? <LoadingSpinnerComponent /> : null}
          {testings.length === 0 && !fetchTestingsIsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Chats Yet</h3>
              <p className="text-text-primary mb-4">
                Chats will be displayed here if you have applied for a tester call and have been
                accepted.
              </p>
              <Link rel={'nofollow'} href="/%5Blang%5D/app/secure/test">
                <Button>Show Tester Calls</Button>
              </Link>
            </div>
          ) : null}
          <div className="space-y-2">
            {testings.map((testing) => (
              <div
                key={testing.id}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg mb-2"
                onClick={() => handleChatSelect(testing)}
              >
                <Avatar className="w-12 h-12 mr-3">
                  <AvatarImage src={testing.product.imageUrls?.[0]} />
                  <AvatarFallback>
                    {testing.product.title.at(0)}
                    {testing.product.title.at(1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="font-semibold truncate max-w-full sm:max-w-[12rem] md:max-w-[10rem] lg:max-w-[14rem]">
                    {testing.product.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate max-w-full sm:max-w-[12rem] md:max-w-[10rem] lg:max-w-[14rem]">
                    {testing.lastComment}
                  </p>
                </div>
                {testing.lastCommentIsUnread ? <PulsatingDot size={'sm'} /> : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
