import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  DownloadIcon,
  MessageCircle,
  PaperclipIcon,
  SendIcon,
  StarIcon,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoBoxComponent } from '@/components/info-box';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { buildUserName } from '@/lib/features/chat/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dayjs, { TIME_FORMAT } from '@/lib/core/dayjs';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { GetTestingCommentResponse, GetTestingResponse } from '@/@types/api-types';
import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import { handleImageUpload } from '@/lib/features/common/utils';
import {
  useCreateTestingComment,
  useListTesterApplications,
  useReadAllTestingComments,
} from '@/lib/api/testing';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import { useRouter } from 'next/navigation';
import useTestingWebSocket from '@/lib/hooks/useTestingWebSocket';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DynamicTextarea } from '@/components/dynamic-textarea';
import DownloadPatternsDrawer from '@/lib/components/DownloadPatternsDrawer';
import NewMessages from '@/lib/components/NewMessages';
import ManageTesterDrawers from '@/lib/components/ManageTestersDrawer';
import ReplyMessage from '@/lib/components/ReplyMessage';
import { useReleaseProduct } from '@/lib/api';
import ReleasePatternSuccessDrawer from '@/lib/components/ReleasePatternSuccessDrawer';
import RequestStatus from '@/lib/components/RequestStatus';

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
  testings: GetTestingResponse[];
  selectedTestingId: string | null;
  selectedProductIdByTesting: string | null;
  showChatList: boolean;
  bottomNavHeight: number;
  navbarHeight: number;
  changedChat: boolean;
  selectedTestingStatus: string | null;
  messages: GetTestingCommentResponse[];
  fetchTestingComments: (
    testingId: string,
    {
      overridePageNumber,
      overridePageSize,
    }: { overridePageNumber?: number; overridePageSize?: number },
  ) => Promise<{ testingComments: GetTestingCommentResponse[] }>;
  testingCommentsHasNextPage: boolean;
  testingCommentsIsLoading: boolean;
  setChangedChat: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<GetTestingCommentResponse[]>>;
  setIsReviewDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatHistory({
  testings,
  selectedTestingId,
  selectedProductIdByTesting,
  showChatList,
  bottomNavHeight,
  navbarHeight,
  messages,
  testingCommentsHasNextPage,
  testingCommentsIsLoading,
  fetchTestingComments,
  selectedTestingStatus,
  changedChat,
  setChangedChat,
  setMessages,
  setIsReviewDrawerOpen,
}: ChatHistoryProps) {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [sendMessageIsLoading, setSendMessageIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isDownloadPatternsDrawerOpen, setIsDownloadPatternsDrawerOpen] = useState(false);
  const [isTestersDrawerOpen, setIsTestersDrawerOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<GetTestingCommentResponse | null>(null);
  const [releaseProductSuccessDrawer, setReleaseProductSuccessDrawer] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const bottomRef = useRef<any>(null);

  const { message: socketMessage } = useTestingWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/testing-comments/subscribe`,
  );

  const { mutate: createTestingComment } = useCreateTestingComment();
  const {
    fetch: downloadPatterns,
    isLoading: downloadPatternsIsLoading,
    data: file,
    downloadProgress,
  } = useDownloadPatternsByProductId();
  const { fetch: fetchTesterApplications, data: testerApplications } = useListTesterApplications({
    pageNumber: 1,
    pageSize: 999,
  });
  const { mutate: readAllTestingComments } = useReadAllTestingComments();
  const {
    mutate: releaseProduct,
    isLoading: releaseProductIsLoading,
    isSuccess: releaseProductIsSuccess,
    isError: releaseProductIsError,
    errorDetail: releaseProductErrorDetail,
  } = useReleaseProduct();

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
    if (!selectedTestingId) {
      return;
    }
    const loadComments = async () => {
      const result = await fetchTestingComments(selectedTestingId, {
        overridePageNumber: 1,
        overridePageSize: 20,
      });
      setMessages(result.testingComments);
    };
    fetchTesterApplications(selectedTestingId, {
      filter: [],
      direction: 'asc',
      sortKey: 'assignedAt',
      status: ['InProgress', 'Approved', 'Declined'],
    });
    loadComments();
  }, [selectedTestingId, setMessages]);

  useEffect(() => {
    if (!selectedTestingId || !socketMessage) {
      return;
    }

    setMessages((msgs) =>
      [...new Map([socketMessage, ...msgs].map((item) => [item.id, item])).values()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  }, [socketMessage, selectedTestingId, setMessages]);

  useEffect(() => {
    if (!file || typeof window === 'undefined') {
      return;
    }

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download = file.name ?? 'testing_patterns.zip';

    document.body.appendChild(link);
    link.click();

    let isCancelled = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };

    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        cleanup();
      }
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [file]);

  const loadMore = async () => {
    if (!selectedTestingId) {
      return;
    }
    const result = await fetchTestingComments(selectedTestingId, {});
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

        const message = await createTestingComment({
          type: 'Standard',
          comment: newMessage.trim(),
          files: urls.map((fu) => ({
            url: fu.url,
            mimeType: fu.mimeType,
          })),
          testingId: selectedTestingId,
          replyToId: replyingTo?.id,
        });
        if (message) {
          setMessages((msgs) =>
            [...new Map([message, ...msgs].map((item) => [item.id, item])).values()].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ),
          );
          setNewMessage('');
          setFiles(null);
          setReplyingTo(null);
        }
      } finally {
        setSendMessageIsLoading(false);
      }
    }
  };

  const handleDownloadPatternClick = (productId: string | null, language: string) => {
    if (!productId) {
      return;
    }
    downloadPatterns(productId, language).then(() => setIsDownloadPatternsDrawerOpen(false));
  };

  const handleReviewClick = async (testingId: string | null) => {
    if (!testingId) {
      return;
    }
    setIsReviewDrawerOpen(true);
  };

  const handleActionPayload = (action: GetTestingCommentResponse['actions'][number]) => {
    if (!action.payload) {
      return;
    }
    // handle link
    if (action.payload?.startsWith('https://') || action.payload.startsWith('/')) {
      router.push(action.payload);
      return;
    }

    switch (action.variant) {
      case 'RELEASE':
        releaseProduct(action.payload).then(() => setReleaseProductSuccessDrawer(true));
        break;
      default:
        break;
    }
  };

  const handleReply = (message: GetTestingCommentResponse) => {
    setReplyingTo(message);
  };

  const handleReadAllTestingComments = () => {
    if (!selectedTestingId) {
      return;
    }
    readAllTestingComments(selectedTestingId).then();
  };

  const currentTesting = testings.find((testing) => testing.id === selectedTestingId);

  const isInProgress = selectedTestingStatus === 'InProgress';
  const isAborted = selectedTestingStatus === 'Aborted';
  const isDeclined = selectedTestingStatus === 'Declined';
  const isApproved = selectedTestingStatus === 'Approved';
  const isInactive = !isInProgress && !isApproved && !isDeclined;
  const isSeller = currentTesting?.creatorId === userId;
  const isTesterOrCreator =
    !!testerApplications.find((testerApplication) => testerApplication.user.id === userId) ||
    testings.find((testing) => testing.id === selectedTestingId)?.creatorId === userId;

  const status = testerApplications.find(
    (testerApplication) => testerApplication.user.id === userId,
  )?.status;

  return (
    <div
      className={cn('bg-white w-full md:w-2/3', {
        'hidden md:block': showChatList,
        block: !showChatList,
      })}
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
            <div className="space-y-2 w-full">
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center justify-start">
                  <Button
                    variant="ghost"
                    size="default"
                    className="md:hidden mr-2"
                    onClick={() => router.push('/app/secure/test/chats')}
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Button>
                  <h2 className="text-2xl font-bold">Chat History</h2>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!currentTesting || !selectedProductIdByTesting || !isTesterOrCreator}
                    onClick={() => {
                      setIsTestersDrawerOpen(true);
                    }}
                  >
                    <Users className="h-6 w-6" />
                  </Button>
                  {status !== 'Created' && !isSeller ? (
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!selectedTestingId}
                      onClick={() => {
                        handleReviewClick(selectedTestingId);
                      }}
                    >
                      <StarIcon className="h-6 w-6" />
                    </Button>
                  ) : null}
                  {currentTesting?.product ? (
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={
                        !selectedProductIdByTesting ||
                        downloadPatternsIsLoading ||
                        !isTesterOrCreator
                      }
                      onClick={() => {
                        setIsDownloadPatternsDrawerOpen(true);
                      }}
                    >
                      <DownloadIcon className="h-6 w-6" />
                    </Button>
                  ) : null}
                </div>
              </div>
              {isApproved ? (
                <InfoBoxComponent severity="success" message={`This testing has been approved.`} />
              ) : null}
              {isAborted ? (
                <InfoBoxComponent severity="warning" message={`This testing has been aborted.`} />
              ) : null}
              {isDeclined ? (
                <InfoBoxComponent severity="error" message={`This testing has been declined.`} />
              ) : null}
            </div>
          </CardContent>
          {/* Chat History (Scroll Area) */}
          <ScrollArea className="flex-grow px-4 overflow-y-auto">
            {testingCommentsHasNextPage && !!selectedTestingId ? (
              <Button
                variant={'outline'}
                className={'w-full mb-4'}
                onClick={() => {
                  loadMore();
                }}
              >
                {testingCommentsIsLoading ? (
                  <LoadingSpinnerComponent size="sm" className="text-black" />
                ) : null}
                Load more
              </Button>
            ) : null}
            {messages
              .slice(0)
              .reverse()
              .map((message) => {
                const currentTesting = testings.find((testing) => testing.id === selectedTestingId);

                const testerUser = currentTesting?.testers?.find(
                  (tester) => tester.id === message.creatorId,
                );

                const isTestingOwner = currentTesting?.creatorId === message.creatorId;
                const sellerUser = isTestingOwner ? currentTesting.creator : undefined;
                const otherName = buildUserName(testerUser) || buildUserName(sellerUser) || 'Other';
                const isCreator = message.creatorId === userId;

                return (
                  <>
                    {message.type === 'System' ? (
                      <div key={message.id} className={`mb-4 mr-auto w-full`}>
                        <div className="flex items-start">
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_URL}/icons/main/256.png`}
                            />
                            <AvatarFallback>PP</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 rounded-lg p-3 bg-primary space-y-2">
                            <div className="flex gap-2 justify-between items-center">
                              <span className="font-semibold text-secondary">Pattern Paradise</span>
                              <span className="text-xs text-secondary">
                                {dayjs(message.createdAt).format(TIME_FORMAT)}
                              </span>
                            </div>
                            <p className={'mt-1 text-left text-secondary'}>{message.message}</p>
                            {message?.actions?.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {message.actions.map((action) => {
                                  if (!isSeller) {
                                    return null;
                                  }

                                  if (
                                    action.variant === 'RELEASE' &&
                                    currentTesting?.product.status === 'Released'
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div key={action.id} className="w-full">
                                      <Button
                                        variant={'secondary'}
                                        onClick={() => {
                                          handleActionPayload(action);
                                        }}
                                        disabled={releaseProductIsLoading}
                                      >
                                        {releaseProductIsLoading ? (
                                          <LoadingSpinnerComponent size="sm" />
                                        ) : null}
                                        {action.description}
                                      </Button>
                                      <RequestStatus
                                        isSuccess={releaseProductIsSuccess}
                                        isError={releaseProductIsError}
                                        errorMessage={releaseProductErrorDetail}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
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
                              href={
                                isTestingOwner
                                  ? `/users/${sellerUser?.id}`
                                  : `/users/${testerUser?.id}`
                              }
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
                                <AvatarImage
                                  src={isTestingOwner ? sellerUser?.imageUrl : testerUser?.imageUrl}
                                />
                                <AvatarFallback>
                                  {isTestingOwner
                                    ? sellerUser?.firstName?.at(0) && sellerUser?.lastName?.at(0)
                                      ? `${sellerUser.firstName.at(0)}${sellerUser.lastName.at(0)}`
                                      : ''
                                    : testerUser?.firstName?.at(0) && testerUser?.lastName?.at(0)
                                      ? `${testerUser.firstName.at(0)}${testerUser.lastName.at(0)}`
                                      : ''}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                            <div
                              className={`flex flex-col flex-1 gap-1 rounded-lg p-3 ${
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
                    )}
                  </>
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
                        testings
                          .find((t) => t.id === selectedTestingId)
                          ?.testers?.find((t) => t.id === replyingTo.creatorId),
                      ) || 'Other'}
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
              callback={handleReadAllTestingComments}
            />
          </div>

          {!!selectedTestingId ? (
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
            </div>
          ) : null}
        </Card>
      )}
      {currentTesting?.product ? (
        <DownloadPatternsDrawer
          isOpen={isDownloadPatternsDrawerOpen}
          setIsOpen={setIsDownloadPatternsDrawerOpen}
          isLoading={downloadPatternsIsLoading}
          product={currentTesting.product}
        />
      ) : null}
      <ReleasePatternSuccessDrawer
        isOpen={releaseProductSuccessDrawer}
        setIsOpen={setReleaseProductSuccessDrawer}
        productId={currentTesting?.productId}
      />
      {currentTesting ? (
        <ManageTesterDrawers
          testing={currentTesting}
          isOpen={isTestersDrawerOpen}
          setIsOpen={setIsTestersDrawerOpen}
        />
      ) : null}
    </div>
  );
}
