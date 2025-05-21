import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import React from 'react';
import { ReportUser } from '@/lib/components/ReportUser';

interface ActionButtonsProps {
  showFlag: boolean;
  isMe: boolean;
  userId: string;
}

export function ActionButtons({ showFlag, isMe, userId }: ActionButtonsProps) {
  console.log({ showFlag, isMe, userId });
  return showFlag ? (
    <div className="absolute right-4 top-4 z-10">
      {isMe ? (
        <Link href="/app/secure/auth/me?action=scrollToSettings">
          <Button size={'icon'} variant={'secondary'}>
            <Settings className="h4 w-4" />
            <span className="sr-only">Edit User</span>
          </Button>
        </Link>
      ) : null}
      {!isMe ? <ReportUser userId={userId} /> : null}
    </div>
  ) : null;
}
