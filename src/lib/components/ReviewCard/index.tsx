import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const tester = testing.testers?.find((t) => t.id === comment.creatorId);

  const initials =
    tester?.firstName && tester?.lastName
      ? `${tester.firstName.at(0)}${tester.lastName.at(0)}`
      : null;

  const isApproved =
    comment.actions.find((action) => action.variant === 'REVIEW')?.payload === 'Approved';

  return (
    <Card
      className={cn('w-full', isApproved ? 'border-2 border-green-300' : 'border-2 border-red-300')}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex items-start space-x-2 w-full">
            <Link href={`/%5Blocale%5D/users/${comment.creatorId}`} className="block">
              <Avatar className="w-10 h-10">
                <AvatarImage src={tester?.imageUrl} alt={tester?.username} />
                <AvatarFallback>{initials ? initials : ''}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <Link href={`/%5Blocale%5D/users/${comment.creatorId}`}>
                <h4 className="font-semibold">{tester?.username}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </Link>
              <p className="mt-2">{comment.message}</p>
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
                category={testing.product.category}
                subCategories={testing.product.subCategories}
                grids={comment.files.length > 1 ? 2 : undefined}
              />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
