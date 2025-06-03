import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, MessageCircle, PaperclipIcon, SendIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { buildUserName } from '@/lib/features/chat/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dayjs, { TIME_FORMAT } from '@/lib/core/dayjs';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { GetChatMessageResponse, GetChatResponse } from '@/@types/api-types';
import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useRouter } from 'next/navigation';
import useChatWebSocket from '@/lib/hooks/useChatWebSocket';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DynamicTextarea } from '@/components/dynamic-textarea';
import { useCreateChatMessage, useReadAllChatMessages } from '@/lib/api';
import logger from '@/lib/core/logger';
import NewMessages from '@/lib/components/NewMessages';
import BlockChatButton from '@/lib/components/Chat/BlockChatButton';
import ReplyMessage from '@/lib/components/ReplyMessage';

function getColor(isCreator: boolean) {
  if (isCreator) {
    return 'bg-primary';
  }
  return 'bg-gray-200';
}

interface ChatHistoryProps {
  chats: GetChatResponse[];
  selectedChatId: string | null;
  showChatList: boolean;
  bottomNavHeight: number;
  navbarHeight: number;
  changedChat: boolean;
  messages: GetChatMessageResponse[];
  fetchChatMessages: (
    chatId: string,
    overridePageNumber?: number,
    overridePageSize?: number,
  ) => Promise<GetChatMessageResponse[]>;
  chatMessagesHasNextPage: boolean;
  chatMessagesIsLoading: boolean;
  setChangedChat: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<GetChatMessageResponse[]>>;
}

export default function ChatHistory({
  chats,
  selectedChatId,
  showChatList,
  bottomNavHeight,
  navbarHeight,
  messages,
  chatMessagesHasNextPage,
  chatMessagesIsLoading,
  fetchChatMessages,
  changedChat,
  setChangedChat,
  setMessages,
}: ChatHistoryProps) {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [sendMessageIsLoading, setSendMessageIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [replyingTo, setReplyingTo] = useState<GetChatMessageResponse | null>(null);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const bottomRef = useRef<any>(null);

  const { message: socketMessage } = useChatWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/chat-messages/subscribe`,
  );

  const { mutate: createChatMessage } = useCreateChatMessage();
  const { mutate: readAllChatMessages } = useReadAllChatMessages();

  useEffect(() => {
    if (messages?.at(0)?.creatorId === userId) {
      setChangedChat(true);
    }
  }, [messages]);

  useEffect(() => {
    if (bottomRef.current && !showChatList && (initialLoad || changedChat) && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
      setInitialLoad(false);
      setChangedChat(false);
    }
  }, [messages, setChangedChat, showChatList, changedChat, initialLoad]);

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }
    const loadMessages = async () => {
      const chatMessages = await fetchChatMessages(selectedChatId, 1, 20);
      setMessages(chatMessages);
    };
    loadMessages();
  }, [selectedChatId, setMessages]);

  useEffect(() => {
    if (!selectedChatId || !socketMessage || socketMessage.chatId !== selectedChatId) {
      return;
    }

    logger.info('Add message from socket to chat:', socketMessage.message);

    setMessages((msgs) =>
      [...new Map([socketMessage, ...msgs].map((item) => [item.id, item])).values()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }, [socketMessage, selectedChatId, setMessages]);

  const loadMore = async () => {
    if (!selectedChatId) {
      return;
    }
    const chatMessages = await fetchChatMessages(selectedChatId);
    setMessages((msgs) => [...msgs, ...chatMessages]);
  };

  const handleSendMessage = async () => {
    if (!selectedChatId) {
      return;
    }
    if (newMessage.trim() || files !== null) {
      setSendMessageIsLoading(true);
      try {
        // @ts-ignore
        const fileArray = Array.from(files ?? []);

        const c = fileArray.map((file) => URL.createObjectURL(file));

        const urls = await handleImageUpload(
          c,
          () => {},
          () => {},
          () => {},
          // TODO: Add progress handler
          () => {},
        );

        const chatMessage = await createChatMessage(selectedChatId, {
          message: newMessage.trim(),
          files: urls.map((fu) => ({
            url: fu.url,
            mimeType: fu.mimeType,
          })),
          replyToId: replyingTo?.id,
        });
        if (chatMessage) {
          setMessages((msgs) =>
            [...new Map([chatMessage, ...msgs].map((item) => [item.id, item])).values()].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ),
          );
          setReplyingTo(null);
          setNewMessage('');
          setFiles(null);
        }
      } finally {
        setSendMessageIsLoading(false);
      }
    }
  };

  const handleReadAllChatMessages = () => {
    if (!selectedChatId) {
      return;
    }
    readAllChatMessages(selectedChatId).then();
  };

  const handleReply = (message: GetChatMessageResponse) => {
    setReplyingTo(message);
  };

  const currentChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <div
      className={cn('bg-white w-full md:w-2/3', {
        'hidden md:block': showChatList,
        block: !showChatList,
      })}
    >
      {!selectedChatId ? (
        <div className="flex flex-col h-full items-center justify-center text-center p-4">
          <MessageCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
          <p className="text-primary max-w-sm">
            Choose a chat from the list on the left to start chatting.
          </p>
        </div>
      ) : (
        <Card
          className="flex flex-col"
          style={{
            height: `calc(100svh - ${bottomNavHeight}px - ${navbarHeight}px)`,
            border: 'none',
            boxShadow: 'none',
          }}
        >
          {/* Top navigation */}
          <CardContent className="p-4 flex-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <Button
                  variant="ghost"
                  size="default"
                  className="md:hidden mr-2"
                  onClick={() => router.push('/app/secure/chats')}
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <h2 className="text-2xl font-bold">Chat History</h2>
              </div>
              <BlockChatButton chat={currentChat} />
            </div>
          </CardContent>
          {/* Chat History (Scroll Area) */}
          <ScrollArea className="flex-grow px-4 overflow-y-auto relative">
            {chatMessagesHasNextPage && !!selectedChatId ? (
              <Button
                variant={'outline'}
                className={'w-full mb-4'}
                onClick={() => {
                  loadMore();
                }}
              >
                {chatMessagesIsLoading ? (
                  <LoadingSpinnerComponent size="sm" className="text-black" />
                ) : null}
                Load more
              </Button>
            ) : null}
            {messages
              .slice(0)
              .reverse()
              .map((message) => {
                const chatMessageCreator = currentChat?.participants?.find(
                  (p) => p.userId === message.creatorId,
                )?.user;
                const otherName = buildUserName(chatMessageCreator) || 'Other';
                const isCreator = message.creatorId === userId;

                return (
                  <div
                    key={message.id}
                    className="mb-4 max-w-[80%] w-fit"
                    style={
                      isCreator
                        ? {
                            marginLeft: 'auto',
                          }
                        : {
                            marginRight: 'auto',
                          }
                    }
                  >
                    <ReplyMessage onSwipe={() => handleReply(message)}>
                      <div
                        className="flex items-start"
                        style={
                          isCreator
                            ? {
                                flexDirection: 'row-reverse',
                              }
                            : {}
                        }
                      >
                        <Link
                          href={`/%5Blocale%5D/users/${chatMessageCreator?.id}`}
                          rel={'nofollow'}
                        >
                          <Avatar
                            className="w-8 h-8"
                            style={
                              isCreator
                                ? {
                                    marginLeft: '0.5rem',
                                  }
                                : {
                                    marginRight: '0.5rem',
                                  }
                            }
                          >
                            <AvatarImage src={chatMessageCreator?.imageUrl} />
                            <AvatarFallback>
                              {chatMessageCreator?.firstName?.at(0) &&
                              chatMessageCreator?.lastName?.at(0)
                                ? `${chatMessageCreator.firstName.at(0)}${chatMessageCreator.lastName.at(0)}`
                                : ''}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div
                          className={`flex flex-col flex-1 gap-1 rounded-lg p-3 max-w-xs ${getColor(isCreator)}`}
                        >
                          {(message.replyTo?.message || message.replyTo?.files.at(0)?.url) &&
                          message.id !== message.replyTo.id ? (
                            <div className="flex flex-row gap-2 mb-1 rounded-md border bg-gray-200 p-1 text-xs">
                              {message.replyTo.files.at(0)?.url ? (
                                <img
                                  src={message.replyTo.files.at(0)?.url}
                                  className="aspect-square object-cover object-center w-12 h-12"
                                />
                              ) : null}
                              {message.replyTo?.message ? (
                                <p className="line-clamp-2 text-gray-600">
                                  {message.replyTo?.message}
                                </p>
                              ) : null}
                            </div>
                          ) : null}

                          <div className="flex flex-col gap-2">
                            {message.files.length > 0
                              ? message.files.map((file) =>
                                  file.mimeType.startsWith('image/') ? (
                                    <a href={file.url} key={file.url} target="_blank">
                                      <CldImage
                                        alt="Pattern Paradise"
                                        src={file.url}
                                        width="340"
                                        height="250"
                                        crop={{
                                          type: 'auto',
                                          source: true,
                                        }}
                                        format="webp"
                                      />
                                    </a>
                                  ) : (
                                    <div
                                      key={file.url}
                                      className="mt-2"
                                      style={
                                        isCreator
                                          ? {
                                              textAlign: 'right',
                                            }
                                          : {
                                              textAlign: 'left',
                                            }
                                      }
                                    >
                                      <a
                                        href={file.url}
                                        className="text-blue-500 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button variant={'ghost'}>📎 Download file</Button>
                                      </a>
                                    </div>
                                  ),
                                )
                              : null}
                          </div>

                          <div className="space-y-1">
                            <div className="flex gap-2 justify-between items-center">
                              <span className={`font-semibold`}>
                                {isCreator ? 'You' : otherName}
                              </span>
                              <span className={`text-xs`}>
                                {dayjs(message.createdAt).format(TIME_FORMAT)}
                              </span>
                            </div>

                            <p
                              className="mt-1 break-words overflow-hidden"
                              style={{
                                textAlign: 'left',
                                whiteSpace: 'pre-line',
                              }}
                            >
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ReplyMessage>
                  </div>
                );
              })}
            {!showChatList ? <div ref={bottomRef} /> : null}
          </ScrollArea>

          {replyingTo ? (
            <div className="sticky bottom-0 left-0 w-full py-1 bg-white flex gap-2 items-center px-4">
              <div className="flex-1">
                <span className="text-xs font-semibold">
                  Replying to{' '}
                  {replyingTo.creatorId === userId
                    ? 'yourself'
                    : buildUserName(
                        currentChat?.participants?.find((p) => p.userId === replyingTo.creatorId)
                          ?.user,
                      )}
                </span>
                <p className="text-sm line-clamp-1">{replyingTo.message}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          ) : null}
          <div className="sticky bottom-0 left-0 w-full py-1 bg-white px-4">
            <NewMessages
              message={socketMessage}
              currentBottomRef={bottomRef}
              callback={handleReadAllChatMessages}
            />
          </div>

          {/* Message Input Area */}
          {!!selectedChatId ? (
            <div className="p-4 flex-none border-t border-gray-200">
              <div className="flex flex-col gap-4">
                {files && (
                  <div className="flex gap-2">
                    {Array.from(files).map((file, index) => (
                      <Image
                        key={`${index}-${file.name}`}
                        alt={file.name}
                        src={URL.createObjectURL(file)}
                        width={70}
                        height={70}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-4">
                  <DynamicTextarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <PaperclipIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                        disabled={sendMessageIsLoading}
                      />
                    </label>
                    <Button onClick={handleSendMessage} disabled={sendMessageIsLoading}>
                      Send
                      {sendMessageIsLoading ? (
                        <LoadingSpinnerComponent size="sm" className="text-white" />
                      ) : (
                        <SendIcon className="w-4 h-4 mr-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
