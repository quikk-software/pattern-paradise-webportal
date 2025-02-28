import React, { useEffect, useState } from 'react';
import { GetChatMessageResponse, GetTestingCommentResponse } from '@/@types/api-types';
import { ArrowDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewMessagesProps {
  message?: GetChatMessageResponse | GetTestingCommentResponse;
  currentBottomRef?: React.MutableRefObject<any>;
  callback?: () => void;
}

export default function NewMessages({ message, currentBottomRef, callback }: NewMessagesProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!message) {
      setShowHint(false);
      return;
    }
    setShowHint(true);
  }, [message]);

  if (!showHint) {
    return null;
  }

  const handleScrollClick = () => {
    if (!currentBottomRef?.current) {
      return;
    }
    callback?.();
    currentBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    setShowHint(false);
  };

  const handleIgnoreClick = () => {
    setShowHint(false);
  };

  return (
    <div className="flex gap-8 items-center justify-between">
      <span className="text-sm">New message(s)</span>
      <div className="flex gap-4 items-center">
        <X size={18} onClick={handleIgnoreClick} />
        <Button onClick={handleScrollClick} variant={'secondary'} size={'sm'}>
          <ArrowDown />
        </Button>
      </div>
    </div>
  );
}
