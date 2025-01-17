import React from 'react';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';

interface OpenIncidentsInfoBoxProps {
  type: 'user' | 'product';
  count: number;
}

export default function OpenIncidentsInfoBox({ type, count }: OpenIncidentsInfoBoxProps) {
  return (
    <InfoBoxComponent
      severity="warning"
      message={
        <span>
          You have {count} open incidents related to{' '}
          {type === 'user' ? 'your user profile' : 'one or more of your patterns'}.{' '}
          {type === 'user' ? (
            <Link href="/app/secure/auth/me/reports" className="text-blue-500 underline">
              Check your profile incidents here.
            </Link>
          ) : (
            <Link href="/app/secure/sell/reports" className="text-blue-500 underline">
              Check your pattern incidents here.
            </Link>
          )}
        </span>
      }
    />
  );
}
