import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReviewCard from '@/lib/components/ReviewCard';
import { useGetTestingByProductId, useListTestingReviewComments } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';

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

  if (comments.length === 0 && testing.status === 'Approved') {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Pattern Reviews</h2>
        {comments.length === 0 && testing.status !== 'Approved' ? (
          <InfoBoxComponent
            message={
              <>
                This pattern has not yet received any reviews and has not been subjected to a{' '}
                <Link
                  rel={'nofollow'}
                  href="/faq?action=collaborate"
                  className="text-blue-500 underline"
                >
                  Pattern Paradise Test Process
                </Link>
                . The quality of the pattern offered can therefore not be guaranteed and caution is
                advised.
              </>
            }
            severity="error"
          />
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {comments.map((comment) => (
                <ReviewCard key={comment.id} comment={comment} testing={testing} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
