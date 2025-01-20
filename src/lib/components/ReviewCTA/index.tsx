'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReviewDrawer from '@/lib/components/ReviewDrawer';
import { useGetTestingByProductId } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

interface ReviewCTAProps {
  productId: string;
}

export default function ReviewCTA({ productId }: ReviewCTAProps) {
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const { fetch, isLoading, isError, data: testing } = useGetTestingByProductId();

  useEffect(() => {
    fetch(productId);
  }, [productId]);

  if (isError) {
    return null;
  }

  if (isLoading || !testing) {
    return <LoadingSpinnerComponent />;
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Leave a Review</h2>
          <p className="text-sm text-gray-500">Thanks for purchasing this pattern🧡</p>
          <p className="text-sm text-gray-500">
            If you like you can leave a quick review here and help other crochet enthusiasts finding
            their favorite patterns.
          </p>
          <Button variant="secondary" onClick={() => setDrawerIsOpen(true)}>
            <CirclePlus className="w-4 h-4" /> Review
          </Button>
        </CardContent>
      </Card>
      <ReviewDrawer
        drawerIsOpen={drawerIsOpen}
        setDrawerIsOpen={setDrawerIsOpen}
        testingId={testing.id}
        skipRating
      />
    </>
  );
}
