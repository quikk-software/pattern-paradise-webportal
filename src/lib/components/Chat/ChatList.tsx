import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetTestingResponse } from '@/@types/api-types';

interface ChatListProps {
  showChatList: boolean;
  fetchTestingsIsLoading: boolean;
  testings: GetTestingResponse[];
  bottomNavHeight: number;
  handleChatSelect: (testing: GetTestingResponse) => void;
}

export default function ChatList({
  showChatList,
  fetchTestingsIsLoading,
  testings,
  bottomNavHeight,
  handleChatSelect,
}: ChatListProps) {
  return (
    <div
      className="md:block w-full md:w-1/3 bg-white"
      style={{
        ...(showChatList ? { display: 'block' } : { display: 'hidden' }),
        ...{ height: `calc(100svh - ${bottomNavHeight}px)` },
      }}
    >
      <Card className="h-full overflow-y-auto">
        <CardContent className="p-4 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Chats</h2>
          {fetchTestingsIsLoading ? <LoadingSpinnerComponent /> : null}
          {testings.length === 0 && !fetchTestingsIsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Chats Yet</h3>
              <p className="text-text-primary mb-4">
                Chats will be displayed here if you have applied for a tester call and have been
                accepted.
              </p>
              <Link href="/app/secure/test">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
