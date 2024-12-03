'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PaperclipIcon,
  SendIcon,
  ArrowLeftIcon,
  DownloadIcon,
  StarIcon,
  MessageCircle,
  Users,
} from 'lucide-react';
import {
  useCreateTestingComment,
  useListTesterApplications,
  useListTestingComments,
  useListTestings,
} from '@/lib/api/testing';
import { GetTestingCommentResponse, GetTestingResponse } from '@/@types/api-types';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import dayjs, { TIME_FORMAT } from '@/lib/core/dayjs';
import { CldImage } from 'next-cloudinary';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useElementHeight } from '@/lib/core/useElementHeight';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import useWebSocket from '@/lib/hooks/useWebSocket';
import Link from 'next/link';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import { InfoBoxComponent } from '@/components/info-box';
import { useRouter } from 'next/navigation';
import ReviewDrawer from '@/lib/components/ReviewDrawer';
import { buildUserName } from '@/lib/features/chat/utils';

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

interface ChatAppComponentProps {
  testingId?: string;
}

export function ChatAppComponent({ testingId }: ChatAppComponentProps) {
  const [initialLoad, setInitialLoad] = useState(true);
  const [messages, setMessages] = useState<GetTestingCommentResponse[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasNewSocketMessage, setHasNewSocketMessage] = useState(false);
  const [changedChat, setChangedChat] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedTestingId, setSelectedTestingId] = useState<string | null>(null);
  const [selectedProductIdByTesting, setSelectedProductIdByTesting] = useState<string | null>(null);
  const [selectedTestingStatus, setSelectedTestingStatus] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [sendMessageIsLoading, setSendMessageIsLoading] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  const router = useRouter();

  const { userId, accessToken } = useSelector((s: Store) => s.auth);
  const bottomNavHeight = useElementHeight('bottom-navigation');
  const { sendMessage, messages: socketMessages } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/testing-comments/subscribe`,
    accessToken,
  );

  const {
    fetch: fetchTestings,
    isLoading: fetchTestingsIsLoading,
    data: testings,
  } = useListTestings({});
  const {
    fetch: fetchTestingComments,
    hasNextPage: testingCommentsHasNextPage,
    isLoading: testingCommentsIsLoading,
    reset,
  } = useListTestingComments({});
  const { mutate: createTestingComment } = useCreateTestingComment();
  const {
    fetch: downloadPatterns,
    isLoading: downloadPatternsIsLoading,
    data: file,
  } = useDownloadPatternsByProductId();
  const { fetch: fetchTesterApplications, data: testerApplications } = useListTesterApplications(
    {},
  );

  const bottomRef = useRef<any>(null);

  useEffect(() => {
    if (!testingId) {
      return;
    }
    setSelectedTestingId(testingId);
    setShowChatList(false);
  }, [testingId]);

  useEffect(() => {
    if (
      bottomRef.current &&
      !showChatList &&
      (initialLoad || hasNewSocketMessage || changedChat) &&
      messages.length > 0
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
      setInitialLoad(false);
      setHasNewSocketMessage(false);
      setChangedChat(false);
    }
  }, [messages, bottomRef.current, showChatList, hasNewSocketMessage, changedChat]);

  useEffect(() => {
    fetchTestings(['InProgress', 'Aborted', 'Declined', 'Approved']);
  }, []);

  useEffect(() => {
    if (!selectedTestingId) {
      return;
    }
    const loadComments = async () => {
      const result = await fetchTestingComments(selectedTestingId);
      setMessages(result.testingComments);
    };
    fetchTesterApplications(selectedTestingId, {
      filter: [],
      direction: 'asc',
      sortKey: 'assignedAt',
      status: ['InProgress', 'Approved', 'Declined'],
    });
    loadComments();
  }, [selectedTestingId]);

  useEffect(() => {
    const socketMessagesForThisChat = [
      ...new Map(socketMessages.map((item) => [item.payload.id, item])).values(),
    ]
      .filter((socketMessage) => socketMessage.payload.testingId === selectedTestingId)
      .map((socketMessage) => socketMessage.payload);

    setMessages((msgs) =>
      [
        ...new Map([...socketMessagesForThisChat, ...msgs].map((item) => [item.id, item])).values(),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    );
  }, [socketMessages]);

  useEffect(() => {
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download = file.name ?? 'testing_patterns.zip';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);
  }, [file]);

  useEffect(() => {
    if (!testingId) {
      return;
    }
    const selectedTesting = testings.find((testing) => testing.id === selectedTestingId);
    setSelectedProductIdByTesting(selectedTesting?.productId ?? null);
    setSelectedTestingStatus(selectedTesting?.status ?? null);
  }, [testings, testingId]);

  const loadMore = async () => {
    if (!selectedTestingId) {
      return;
    }
    const result = await fetchTestingComments(selectedTestingId);
    setMessages((msgs) => [...msgs, ...result.testingComments]);
  };

  const handleSendMessage = async () => {
    if (!selectedTestingId) {
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

        const result = await createTestingComment({
          type: 'Standard',
          comment: newMessage,
          files: urls.map((fu) => ({
            url: fu.url,
            mimeType: fu.mimeType,
          })),
          testingId: selectedTestingId,
        });
        if (result) {
          setNewMessage('');
          setFiles(null);
        }
        sendMessage({ payload: result, event: 'testingcommentcreated' });
        setHasNewSocketMessage(true);
      } finally {
        setSendMessageIsLoading(false);
      }
    }
  };

  const handleChatSelect = (testing: GetTestingResponse) => {
    setSelectedTestingId(testing.id);
    setSelectedProductIdByTesting(testing.productId);
    setSelectedTestingStatus(testing.status);
    setShowChatList(false);
    setChangedChat(true);
    setMessages([]);
    reset();
  };

  const handleDownloadPatternClick = async (productId: string | null) => {
    if (!productId) {
      return;
    }
    await downloadPatterns(productId);
  };

  const handleReviewClick = async (testingId: string | null) => {
    if (!testingId) {
      return;
    }
    setIsReviewDrawerOpen(true);
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

  const isInactive = selectedTestingStatus !== 'InProgress';
  const isAborted = selectedTestingStatus === 'Aborted';
  const isDeclined = selectedTestingStatus === 'Declined';
  const isTesterOrCreator =
    !!testerApplications.find((testerApplication) => testerApplication.user.id === userId) ||
    testings.find((testing) => testing.id === selectedTestingId)?.creatorId === userId;
  const status = testerApplications.find(
    (testerApplication) => testerApplication.user.id === userId,
  )?.status;

  return (
    <div className="flex w-full">
      {/* Chat List */}
      <div
        className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3 bg-white`}
        style={{ height: `calc(100vh - ${bottomNavHeight}px)` }}
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

      {/* Chat History */}
      <div
        className={`${!showChatList ? 'block' : 'hidden'} md:block flex flex-col bg-white w-full`}
      >
        {!selectedTestingId ? (
          <div className="flex flex-col h-full items-center justify-center text-center p-4">
            <MessageCircle className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
            <p className="text-primary max-w-sm">
              Choose a testing from the list on the left to start chatting.
            </p>
          </div>
        ) : (
          <Card className="flex flex-col" style={{ height: `calc(100vh - ${bottomNavHeight}px)` }}>
            {/* Top navigation */}
            <CardContent className="p-4 flex-none">
              <div className="flex flex-row justify-between mb-4">
                <div className="flex items-center justify-start">
                  <Button
                    variant="ghost"
                    size="default"
                    className="md:hidden mr-2"
                    onClick={() => setShowChatList(true)}
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Button>
                  <h2 className="text-2xl font-bold">Chat History</h2>
                </div>
                <div className="flex items-center justify-end gap-2">
                  {status === 'InProgress' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!selectedTestingId || isInactive}
                      onClick={() => {
                        handleReviewClick(selectedTestingId);
                      }}
                    >
                      <StarIcon className="h-6 w-6" />
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={
                      !selectedProductIdByTesting || downloadPatternsIsLoading || !isTesterOrCreator
                    }
                    onClick={() => {
                      handleDownloadPatternClick(selectedProductIdByTesting);
                    }}
                  >
                    <DownloadIcon className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              {isInactive && !isAborted && !isDeclined ? (
                <InfoBoxComponent
                  severity="info"
                  message={`This testing is currently not active.`}
                />
              ) : null}
              {isAborted ? (
                <InfoBoxComponent severity="warning" message={`This testing has been aborted.`} />
              ) : null}
              {isDeclined ? (
                <InfoBoxComponent severity="warning" message={`This testing has been declined.`} />
              ) : null}
            </CardContent>
            {/* Chat History (Scroll Area) */}
            <ScrollArea className="flex-grow p-4 overflow-y-auto">
              {testingCommentsHasNextPage && selectedTestingId !== null ? (
                <Button
                  variant={'outline'}
                  className={'w-full mb-4'}
                  onClick={() => {
                    loadMore();
                  }}
                >
                  {testingCommentsIsLoading ? (
                    <LoadingSpinnerComponent size="sm" className="text-white" />
                  ) : null}
                  Load more
                </Button>
              ) : null}
              {messages
                .slice(0)
                .reverse()
                .map((message) => {
                  const currentTesting = testings.find(
                    (testing) => testing.id === selectedTestingId,
                  );
                  const user = currentTesting?.testers?.find(
                    (tester) => tester.id === message.creatorId,
                  );
                  const creatorUser =
                    currentTesting?.creatorId === message.creatorId
                      ? currentTesting.creator
                      : undefined;
                  const otherName = buildUserName(user) || buildUserName(creatorUser) || 'Other';
                  const isCreator = message.creatorId === userId;
                  return (
                    <>
                      {message.type === 'System' ? (
                        <div key={message.id} className={`mb-4 mr-auto w-full`}>
                          <div className="flex items-start">
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarImage src={user?.imageUrl} />
                              <AvatarFallback>PP</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 rounded-lg p-3 bg-primary">
                              <div className="flex gap-2 justify-between items-baseline">
                                <span className="font-semibold text-secondary">
                                  Pattern Paradise
                                </span>
                                <span className="text-xs text-secondary">
                                  {dayjs(message.createdAt).format(TIME_FORMAT)}
                                </span>
                              </div>
                              <p className={'mt-1 text-left text-secondary'}>{message.message}</p>
                              {message.actions.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {message.actions.map((action) => (
                                    <div key={action.id} className="w-full">
                                      <Button
                                        variant={
                                          (action.variant as
                                            | 'default'
                                            | 'destructive'
                                            | 'outline'
                                            | 'secondary'
                                            | 'ghost'
                                            | 'link'
                                            | null
                                            | undefined) ?? 'default'
                                        }
                                        onClick={() => {
                                          handleActionPayload(action.payload);
                                        }}
                                      >
                                        {action.description}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={message.id}
                          className={`mb-4 ${isCreator ? 'ml-auto' : 'mr-auto'} max-w-[80%] w-fit`}
                        >
                          <div
                            className={`flex items-start ${isCreator ? 'flex-row-reverse' : ''}`}
                          >
                            <Link
                              href={isCreator ? `/users/${creatorUser?.id}` : `/users/${user?.id}`}
                            >
                              <Avatar className={`w-8 h-8 ${isCreator ? 'ml-2' : 'mr-2'}`}>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>
                                  {user?.firstName?.at(0) && user?.lastName?.at(0)
                                    ? `${user.firstName.at(0)}${user.lastName.at(0)}`
                                    : ''}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                            <div
                              className={`flex-1 rounded-lg p-3 ${
                                message.type === 'Review'
                                  ? 'bg-yellow-100 border-2 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700'
                                  : undefined
                              } rounded-lg p-3 max-w-xs`}
                              style={{
                                backgroundColor:
                                  message.type === 'Review'
                                    ? undefined
                                    : getColor(message.creatorId),
                              }}
                            >
                              {message.type === 'Review' && (
                                <div className="flex items-center mb-1">
                                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-semibold">Review</span>
                                </div>
                              )}
                              <div
                                className={`flex gap-2 justify-between items-baseline ${
                                  isCreator ? 'flex-row-reverse' : ''
                                }`}
                              >
                                <span
                                  className={`font-semibold ${
                                    message.type === 'Review'
                                      ? 'text-gray-800 dark:text-gray-200'
                                      : ''
                                  }`}
                                >
                                  {isCreator ? 'You' : otherName}
                                </span>
                                <span
                                  className={`text-xs ${
                                    message.type === 'Review'
                                      ? 'text-gray-800 dark:text-gray-200'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {dayjs(message.createdAt).format(TIME_FORMAT)}
                                </span>
                              </div>

                              <p
                                className={`mt-1 ${
                                  isCreator ? 'text-right' : 'text-left'
                                } break-words whitespace-normal overflow-hidden`}
                              >
                                {message.message}
                              </p>
                              <div className="flex flex-col gap-2">
                                {message.files.length > 0
                                  ? message.files.map((file) =>
                                      file.mimeType.startsWith('image/') ? (
                                        <a href={file.url} key={file.url} target="_blank">
                                          <CldImage
                                            alt="Pattern paradise"
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
                                          className={`mt-2 ${
                                            isCreator ? 'text-right' : 'text-left'
                                          }`}
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
                      )}
                    </>
                  );
                })}
              {!showChatList ? <div ref={bottomRef} /> : null}
            </ScrollArea>
            {/* Message Input Area */}
            {selectedTestingId !== null ? (
              <div className="p-4 flex-none border-t border-gray-200">
                <div className="flex flex-col gap-4">
                  {files && (
                    <div className="flex gap-2">
                      {Array.from(files).map((file, index) => (
                        <img
                          key={`${index}-${file.name}`}
                          alt={file.name}
                          src={URL.createObjectURL(file)}
                          width={70}
                          height={70}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <PaperclipIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                        disabled={isInactive || sendMessageIsLoading}
                      />
                    </label>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isInactive || sendMessageIsLoading}
                    >
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
            ) : null}
          </Card>
        )}
      </div>
      {selectedTestingId !== null ? (
        <ReviewDrawer
          drawerIsOpen={isReviewDrawerOpen}
          setDrawerIsOpen={setIsReviewDrawerOpen}
          testingId={selectedTestingId}
        />
      ) : null}
    </div>
  );
}
