'use client';

import React, { useEffect, useState } from 'react';
import { GetChatMessageResponse, GetChatResponse } from '@/@types/api-types';
import { useElementHeight } from '@/lib/core/useElementHeight';
import ChatList from '@/lib/components/Chat/ChatList';
import ChatHistory from '@/lib/components/Chat/ChatHistory';
import { useRouter, useSearchParams } from 'next/navigation';
import { useListChatMessages, useListChats } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function ChatScreen() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [changedChat, setChangedChat] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [messages, setMessages] = useState<GetChatMessageResponse[]>([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const bottomNavHeight = useElementHeight('bottom-navigation');
  const navbarHeight = useElementHeight('navbar');

  const router = useRouter();
  const searchParams = useSearchParams();

  const { fetch: fetchChats, data: chats, isLoading: fetchChatsIsLoading } = useListChats();
  const {
    fetch: fetchChatMessages,
    isLoading: chatMessagesIsLoading,
    hasNextPage: chatMessagesHasNextPage,
  } = useListChatMessages({});

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchChats(userId).then(() => {
      setChatsLoaded(true);
    });
  }, [userId, searchParams]);

  useEffect(() => {
    const chatIdFromQuery = searchParams.get('chatId');
    setChatId(chatIdFromQuery);

    if (chatsLoaded && chatIdFromQuery) {
      setShowChatList(false);
    } else if (chatsLoaded) {
      setShowChatList(true);
    }
  }, [chatsLoaded, chats, searchParams]);

  const handleChatSelect = (chat: GetChatResponse) => {
    router.push(`/app/secure/chats?chatId=${chat.id}`);
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <ChatList
        showChatList={showChatList}
        fetchChatsIsLoading={fetchChatsIsLoading}
        chats={chats}
        bottomNavHeight={bottomNavHeight}
        navbarHeight={navbarHeight}
        handleChatSelect={handleChatSelect}
      />

      <ChatHistory
        chats={chats}
        selectedChatId={chatId}
        showChatList={showChatList}
        bottomNavHeight={bottomNavHeight}
        navbarHeight={navbarHeight}
        changedChat={changedChat}
        messages={messages}
        fetchChatMessages={fetchChatMessages}
        chatMessagesHasNextPage={chatMessagesHasNextPage}
        chatMessagesIsLoading={chatMessagesIsLoading}
        setChangedChat={setChangedChat}
        setMessages={setMessages}
      />
    </div>
  );
}
