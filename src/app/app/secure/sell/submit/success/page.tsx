'use client';

import React, { useEffect, useState } from 'react';
import NotFoundPage from '@/app/not-found';
import { useSearchParams } from 'next/navigation';
import PatternUploadSuccess from '@/lib/components/PatternUploadSuccess';

export default function SellSubmitPage() {
  const [productId, setProductId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setProductId(searchParams.get('productId'));
  }, [searchParams]);

  if (!productId) {
    return <NotFoundPage />;
  }

  return <PatternUploadSuccess productId={productId} />;
}
