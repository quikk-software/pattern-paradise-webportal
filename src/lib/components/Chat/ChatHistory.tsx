import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, MessageCircle, PaperclipIcon, SendIcon, StarIcon } from 'lucide-react';
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
import { useCreateChatMessage } from '@/lib/api';

function getColor(uuid: string) {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 60 + 20;
  const lightness = 70 + 10;

  const rgb = hslToRgb(hue, saturation / 100, lightness / 100);

  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
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
  const [_hasNewSocketMessage, setHasNewSocketMessage] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const bottomRef = useRef<any>(null);

  const { sendMessage, messages: socketMessages } = useChatWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/chat-messages/subscribe`,
  );

  const { mutate: createChatMessage } = useCreateChatMessage();

  useEffect(() => {
    if (messages?.at(0)?.creatorId === userId) {
      setChangedChat(true);
    }
  }, [messages]);

  useEffect(() => {
    if (bottomRef.current && !showChatList && (initialLoad || changedChat) && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
      setInitialLoad(false);
      setHasNewSocketMessage(false);
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
    if (!selectedChatId) {
      return;
    }
    const socketMessagesForThisChat = [
      ...new Map(socketMessages.map((item) => [item.payload.id, item])).values(),
    ]
      .filter((socketMessage) => socketMessage.payload.id === selectedChatId)
      .map((socketMessage) => socketMessage.payload) as GetChatMessageResponse[];

    setMessages((msgs) =>
      [
        ...new Map([...socketMessagesForThisChat, ...msgs].map((item) => [item.id, item])).values(),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  }, [socketMessages, selectedChatId, setMessages]);

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
        });
        if (chatMessage) {
          setNewMessage('');
          setFiles(null);
        }
        sendMessage({ payload: chatMessage, event: 'chatmessagecreated' });
        setHasNewSocketMessage(true);
      } finally {
        setSendMessageIsLoading(false);
      }
    }
  };

  const handleActionPayload = (payload?: string) => {
    if (!payload) {
      return;
    }
    // handle link
    if (payload?.startsWith('https://') || payload.startsWith('/')) {
      router.push(payload);
    }
  };

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
          </CardContent>
          {/* Chat History (Scroll Area) */}
          <ScrollArea className="flex-grow px-4 overflow-y-auto">
            {chatMessagesHasNextPage && !!selectedChatId ? (
              <Button
                variant={'outline'}
                className={'w-full mb-4'}
                onClick={() => {
                  loadMore();
                }}
              >
                {chatMessagesIsLoading ? (
                  <LoadingSpinnerComponent size="sm" className="text-white" />
                ) : null}
                Load more
              </Button>
            ) : null}
            {messages
              .slice(0)
              .reverse()
              .map((message) => {
                const currentChat = chats.find((chat) => chat.id === selectedChatId);

                const chatMessageCreator = currentChat?.participants?.find(
                  (p) => p.id === message.creatorId,
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
                      <Link href={`/users/${chatMessageCreator?.id}`} rel={'nofollow'}>
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
                        className={`flex-1 rounded-lg p-3 max-w-xs`}
                        style={{
                          backgroundColor: getColor(message.creatorId),
                        }}
                      >
                        <div className="flex gap-2 justify-between items-baseline">
                          <span className={`font-semibold`}>{isCreator ? 'You' : otherName}</span>
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
                      </div>
                    </div>
                  </div>
                );
              })}
            {!showChatList ? <div ref={bottomRef} /> : null}
          </ScrollArea>

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
