'use client';

import React from 'react';
import { ChatAppComponent } from '@/components/chat-app';
import { useSearchParams } from 'next/navigation';

export default function TestChatsPage() {
  const searchParams = useSearchParams();

  const testingId = searchParams.get('testingId');

  return <ChatAppComponent testingId={testingId ?? undefined} />;
}
