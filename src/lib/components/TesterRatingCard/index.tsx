'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetTesterApplicationResponse } from '@/@types/api-types';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useRateTester } from '@/lib/api/testing';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TesterRatingCardProps {
  tester: GetTesterApplicationResponse;
  testingId: string;
  alreadyRated: boolean;
}

export default function TesterRatingCard({
  tester,
  testingId,
  alreadyRated,
}: TesterRatingCardProps) {
  const [starRating, setStarRating] = useState(tester.starRating || 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [textRating, setTextRating] = useState(tester.textRating || '');
  const [hideFromShoutOut, setHideFromShoutOut] = useState(tester.isHidden);

  const {
    mutate: rateTester,
    isLoading: rateTesterIsLoading,
    isSuccess: rateTesterIsSuccess,
    isError: rateTesterIsError,
    errorDetail: rateTesterErrorDetail,
  } = useRateTester();

  const handleStarClick = (rating: number) => {
    setStarRating(rating);
  };

  const handleSubmit = () => {
    if (starRating > 0) {
      const rating = {
        starRating,
        textRating: textRating.trim() || undefined,
      };
      rateTester(testingId, {
        userId: tester.user.id,
        starRating: rating.starRating,
        textRating: rating.textRating,
        isHidden: hideFromShoutOut,
      });
    }
  };

  const handleReset = () => {
    setStarRating(0);
    setTextRating('');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase().trim();
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor performance';
      case 2:
        return 'Below average';
      case 3:
        return 'Average performance';
      case 4:
        return 'Good performance';
      case 5:
        return 'Excellent performance';
      default:
        return '';
    }
  };

  if (rateTesterIsSuccess || alreadyRated) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-green-200 bg-green-50/50">
        <CardHeader className="text-center pb-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-green-300">
                <AvatarImage
                  src={tester.user.imageUrl}
                  alt={`${tester.user.firstName} ${tester.user.lastName}`}
                />
                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                  {getInitials(tester.user?.firstName ?? '', tester.user?.lastName ?? '')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">
                {tester.user.firstName} {tester.user.lastName}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                @{tester.user.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Already Rated</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-600">{getRatingText(starRating)}</p>
            </div>

            {textRating && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Feedback</Label>
                <div className="bg-white border rounded-lg p-3 text-sm text-gray-700 italic">
                  &quot;{textRating}&quot;
                </div>
              </div>
            )}

            <div
              className={cn(
                'flex items-center space-x-2 p-3 border rounded-lg',
                hideFromShoutOut ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200',
              )}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={hideFromShoutOut}
                  className={cn(hideFromShoutOut ? 'border-red-500' : 'border-green-500')}
                  disabled
                />
                <span
                  className={cn('text-sm', hideFromShoutOut ? 'text-red-800' : 'text-green-800')}
                >
                  Hidden from tester shout-outs
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage
              src={tester.user.imageUrl}
              alt={`${tester.user.firstName} ${tester.user.lastName}`}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(tester.user?.firstName ?? '', tester.user?.lastName ?? '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {tester.user.firstName} {tester.user.lastName}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              @{tester.user.username}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Rate this tester&apos;s performance</Label>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <Star
                  className={`w-8 h-8 transition-colors duration-200 ${
                    star <= (hoveredStar || starRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {starRating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {starRating === 1 && 'Poor performance'}
              {starRating === 2 && 'Below average'}
              {starRating === 3 && 'Average performance'}
              {starRating === 4 && 'Good performance'}
              {starRating === 5 && 'Excellent performance'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-base font-medium">
            Additional feedback{' '}
            <span className="text-sm font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="feedback"
            placeholder="Share your experience working with this tester..."
            value={textRating}
            onChange={(e) => setTextRating(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hideFromShoutOut"
              checked={hideFromShoutOut}
              onCheckedChange={(checked) => setHideFromShoutOut(checked as boolean)}
            />
            <Label htmlFor="hideFromShoutOut" className="text-sm font-medium cursor-pointer">
              Hide this tester from public shout-outs
            </Label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            When checked, this tester won&apos;t be featured in public acknowledgments or social
            media posts
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            disabled={(starRating === 0 && textRating === '') || rateTesterIsLoading}
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={starRating === 0 || rateTesterIsLoading}
            className="flex-1"
          >
            {rateTesterIsLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white" />
            ) : null}
            Submit Rating
          </Button>
        </div>
        <RequestStatus
          isSuccess={rateTesterIsSuccess}
          isError={rateTesterIsError}
          errorMessage={rateTesterErrorDetail}
        />
      </CardContent>
    </Card>
  );
}
