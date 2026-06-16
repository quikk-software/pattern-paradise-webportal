import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReviewCard from '@/lib/components/ReviewCard';
import { useGetTestingByProductId, useListTestingReviewComments } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ReviewMessagesProps {
  productId: string;
  isFree: boolean;
}

export default function ReviewMessages({ productId }: ReviewMessagesProps) {
  const {
    fetch: fetchTesting,
    data: testing,
    isLoading: fetchTestingIsLoading,
    isError: fetchTestingIsError,
  } = useGetTestingByProductId();
  const { fetch: fetchReviewComments, data: comments } = useListTestingReviewComments({
    pageNumber: 1,
    pageSize: 4,
  });

  useEffect(() => {
    fetchTesting(productId);
  }, [productId]);

  useEffect(() => {
    if (!testing?.id) {
      return;
    }
    fetchReviewComments(testing.id, {});
  }, [testing?.id]);

  if (fetchTestingIsError) {
    return null;
  }

  if (fetchTestingIsLoading || !testing) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  // Only show the reviews section when there are actual reviews. No reviews means
  // nothing is rendered (no empty card, no warning).
  if (comments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Pattern Reviews</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <ReviewCard key={comment.id} comment={comment} testing={testing} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
