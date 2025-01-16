import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReviewCard from '@/lib/components/ReviewCard';
import { useGetTestingByProductId, useListTestingReviewComments } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ReviewMessagesProps {
  productId: string;
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pattern Reviews</h2>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <ReviewCard key={comment.id} comment={comment} testing={testing} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
