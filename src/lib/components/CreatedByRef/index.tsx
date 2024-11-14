'use client';

import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useGetUserById } from '@/lib/api';
import Link from 'next/link';

interface CreatedByRefProps {
  creatorId: string;
}

export default function CreatedByRef({ creatorId }: CreatedByRefProps) {
  const { fetch, data, isLoading } = useGetUserById();

  useEffect(() => {
    fetch(creatorId);
  }, [creatorId]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center mb-6">
      <User className="h-5 w-5 mr-2" />
      <Link href={`/users/${creatorId}`}>
        <span
          className="text-sm text-gray-500"
          style={{
            textDecorationLine: 'underline',
          }}
        >
          Created by <strong>{data?.username}</strong>
        </span>
      </Link>
    </div>
  );
}
