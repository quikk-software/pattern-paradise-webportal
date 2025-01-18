import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { GetTestingCommentResponse, GetTestingResponse } from '@/@types/api-types';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  comment: GetTestingCommentResponse;
  testing: GetTestingResponse;
}

export default function ReviewCard({ comment, testing }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tester = testing.testers?.find((t) => t.id === comment.creatorId);

  const toggleExpanded = () => setExpanded(!expanded);

  const initials =
    tester?.firstName && tester?.lastName
      ? `${tester.firstName.at(0)}${tester.lastName.at(0)}`
      : null;

  const isApproved =
    comment.actions.find((action) => action.variant === 'REVIEW')?.payload === 'Approved';

  return (
    <Link href={`/users/${comment.creatorId}`} className="block">
      <Card
        className={cn(
          'w-full',
          isApproved ? 'border-2 border-green-300' : 'border-2 border-red-300',
        )}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex items-start space-x-2 w-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src={tester?.imageUrl} alt={tester?.username} />
                <AvatarFallback>{initials ? initials : ''}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{tester?.username}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
                <p className={`mt-2 ${expanded ? '' : 'line-clamp-3'}`}>{comment.message}</p>
              </div>
              <div>
                {isApproved ? (
                  <ThumbsUp size={20} className="text-green-500" />
                ) : (
                  <ThumbsDown size={20} className="text-red-500" />
                )}
              </div>
            </div>
            {comment.files.length > 0 ? (
              <div
                style={{
                  width: comment.files.length > 1 ? '100%' : '50%',
                }}
              >
                <ProductImageSlider
                  imageUrls={comment.files.map((file) => file.url)}
                  title={testing.product.title}
                  grids={comment.files.length > 1 ? 2 : undefined}
                />
              </div>
            ) : null}
          </div>
        </CardContent>
        {comment.message.length > 150 && (
          <CardFooter className="p-4 pt-0">
            <Button variant="ghost" size="sm" onClick={toggleExpanded}>
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
