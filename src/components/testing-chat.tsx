'use client';

import React, { useEffect, useState } from 'react';
import { useListTestingComments, useListTestings } from '@/lib/api/testing';
import { GetTestingCommentResponse, GetTestingResponse } from '@/@types/api-types';
import { useElementHeight } from '@/lib/core/useElementHeight';
import ChatList from '@/lib/components/TestingChat/ChatList';
import ChatHistory from '@/lib/components/TestingChat/ChatHistory';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewDrawer from '@/lib/components/ReviewDrawer';

export function TestingChat() {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [changedChat, setChangedChat] = useState(false);
  const [selectedProductIdByTesting, setSelectedProductIdByTesting] = useState<string | null>(null);
  const [selectedTestingStatus, setSelectedTestingStatus] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<GetTestingCommentResponse[]>([]);
  const [testingsLoaded, setTestingsLoaded] = useState(false);

  const bottomNavHeight = useElementHeight('bottom-navigation');
  const navbarHeight = useElementHeight('navbar');

  const searchParams = useSearchParams();

  const {
    fetch: fetchTestings,
    isLoading: fetchTestingsIsLoading,
    data: testings,
  } = useListTestings({});
  const {
    fetch: fetchTestingComments,
    hasNextPage: testingCommentsHasNextPage,
    isLoading: testingCommentsIsLoading,
  } = useListTestingComments({});

  const router = useRouter();

  useEffect(() => {
    fetchTestings(['InProgress', 'Declined', 'Approved', 'Aborted'], true).then(() =>
      setTestingsLoaded(true),
    );
  }, [searchParams]);

  useEffect(() => {
    const testingIdFromQuery = searchParams.get('testingId');
    setTestingId(testingIdFromQuery);

    if (testingsLoaded && testingIdFromQuery) {
      const selectedTesting = testings.find((testing) => testing.id === testingIdFromQuery);
      setSelectedProductIdByTesting(selectedTesting?.productId ?? null);
      setSelectedTestingStatus(selectedTesting?.status ?? null);
      setShowChatList(false);
    } else if (testingsLoaded) {
      setShowChatList(true);
    }
  }, [testingsLoaded, testings, searchParams]);

  const handleChatSelect = (testing: GetTestingResponse) => {
    router.push(`/app/secure/test/chats?testingId=${testing.id}`);
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <ChatList
        showChatList={showChatList}
        fetchTestingsIsLoading={fetchTestingsIsLoading}
        testings={testings}
        bottomNavHeight={bottomNavHeight}
        refetch={fetchTestings}
        navbarHeight={navbarHeight}
        handleChatSelect={handleChatSelect}
      />

      <ChatHistory
        testings={testings}
        selectedTestingId={testingId}
        selectedProductIdByTesting={selectedProductIdByTesting}
        showChatList={showChatList}
        bottomNavHeight={bottomNavHeight}
        navbarHeight={navbarHeight}
        changedChat={changedChat}
        selectedTestingStatus={selectedTestingStatus}
        messages={messages}
        fetchTestingComments={fetchTestingComments}
        testingCommentsHasNextPage={testingCommentsHasNextPage}
        testingCommentsIsLoading={testingCommentsIsLoading}
        setChangedChat={setChangedChat}
        setMessages={setMessages}
        setIsReviewDrawerOpen={setIsReviewDrawerOpen}
      />

      {!!testingId ? (
        <ReviewDrawer
          drawerIsOpen={isReviewDrawerOpen}
          setDrawerIsOpen={setIsReviewDrawerOpen}
          testingId={testingId}
        />
      ) : null}
    </div>
  );
}
