'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Review from '../Review';
import { useGetTestingByProductId, useGetTestingComment } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ReviewCard from '@/lib/components/ReviewCard';

interface ReviewCTAProps {
  productId: string;
}

export default function ReviewCTA({ productId }: ReviewCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, isLoading, isError, data: testing } = useGetTestingByProductId();
  const {
    fetch: fetchTestingComment,
    data: testingComment,
    isLoading: fetchTestingCommentIsLoading,
  } = useGetTestingComment();

  useEffect(() => {
    fetch(productId);
  }, [productId]);

  useEffect(() => {
    if (!testing?.id || !userId) {
      return;
    }
    fetchTestingComment(testing.id, userId);
  }, [testing?.id, userId]);

  if (isError) {
    return null;
  }

  if (isLoading || fetchTestingCommentIsLoading || !testing) {
    return <LoadingSpinnerComponent />;
  }

  if (testingComment) {
    return (
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Your Review</h3>
        <ReviewCard comment={testingComment} testing={testing} />
      </div>
    );
  }

  return (
    <>
      {!isOpen ? (
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Leave a Review</h2>
            <p className="text-sm text-gray-500">Thanks for purchasing this pattern🧡</p>
            <p className="text-sm text-gray-500">
              If you like you can leave a quick review here and help other crochet enthusiasts
              finding their favorite patterns.
            </p>
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              <CirclePlus className="w-4 h-4" /> Review
            </Button>
          </CardContent>
        </Card>
      ) : null}
      <Review isOpen={isOpen} testingId={testing.id} skipRating />
    </>
  );
}
