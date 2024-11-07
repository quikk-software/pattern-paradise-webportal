import React from 'react';
import { ChatAppComponent } from '@/components/chat-app';

export default function TestChatsPage({ params }: { params: { testingId: string } }) {
  return <ChatAppComponent testingId={params.testingId} />;
}
