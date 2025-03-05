import React, { useEffect, useState } from 'react';
import { GetChatResponse, GetUserAccountResponse } from '@/@types/api-types';
import { Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBlockChat, useUnblockChat } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';

interface BlockChatButtonProps {
  chat?: GetChatResponse;
}

export default function BlockChatButton({ chat }: BlockChatButtonProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const {
    mutate: blockChat,
    isLoading: blockChatIsLoading,
    errorDetail: blockChatErrorDetail,
  } = useBlockChat();
  const {
    mutate: unblockChat,
    isLoading: unblockChatIsLoading,
    errorDetail: unblockChatErrorDetail,
  } = useUnblockChat();

  useEffect(() => {
    setIsBlocked(chat?.participants.some((p) => p.blocked) ?? false);
  }, [chat]);

  const handleBlockChatClick = (correspondence?: GetUserAccountResponse) => {
    if (!chat) {
      return;
    }

    if (!correspondence) {
      return;
    }

    blockChat(chat.id, correspondence.id).then(() => {
      setIsBlocked(true);
      setIsOpen(false);
    });
  };

  const handleUnblockChatClick = (correspondence?: GetUserAccountResponse) => {
    if (!chat) {
      return;
    }

    if (!correspondence) {
      return;
    }

    unblockChat(chat.id, correspondence.id).then(() => {
      setIsBlocked(false);
      setIsOpen(false);
    });
  };

  const correspondence = chat?.participants?.find((p) => p.userId !== userId)?.user;

  if (isBlocked) {
    return (
      <>
        <Button
          variant="outline"
          size="default"
          className="md:hidden mr-2"
          disabled={!chat || unblockChatIsLoading}
          onClick={() => setIsOpen(true)}
        >
          <LockOpen className="h-6 w-6" />
        </Button>
        <ConfirmDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          description={
            'You are about to unblock this chat. Chat participants will be able to send or receive messages.'
          }
          callbackFn={() => handleUnblockChatClick(correspondence)}
          isLoading={unblockChatIsLoading}
          errorDetail={unblockChatErrorDetail}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="default"
        className="md:hidden mr-2"
        disabled={!chat || blockChatIsLoading}
        onClick={() => setIsOpen(true)}
      >
        <Lock className="h-6 w-6" />
      </Button>
      <ConfirmDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        description={
          'You are about to block this chat. Chat participants will no longer send or receive messages.'
        }
        callbackFn={() => handleBlockChatClick(correspondence)}
        isLoading={blockChatIsLoading}
        errorDetail={blockChatErrorDetail}
      />
    </>
  );
}
