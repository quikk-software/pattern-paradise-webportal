'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

interface LikeDislikeButtons {
  likeState: 'Approved' | 'Declined' | null;
  setLikeState: React.Dispatch<React.SetStateAction<'Approved' | 'Declined' | null>>;
}

export function LikeDislikeButtons({ likeState, setLikeState }: LikeDislikeButtons) {
  const handleLike = () => {
    setLikeState((prevState) => (prevState === 'Approved' ? null : 'Approved'));
  };

  const handleDislike = () => {
    setLikeState((prevState) => (prevState === 'Declined' ? null : 'Declined'));
  };

  return (
    <div className="flex space-x-4 justify-center items-center w-full">
      <Button
        variant={likeState === 'Approved' ? 'default' : 'outline'}
        className={`flex items-center space-x-2 ${
          likeState === 'Approved'
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600'
        }`}
        onClick={handleLike}
      >
        <ThumbsUp className="h-5 w-5" />
        <span>Approve</span>
      </Button>
      <Button
        variant={likeState === 'Declined' ? 'default' : 'outline'}
        className={`flex items-center space-x-2 ${
          likeState === 'Declined'
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600'
        }`}
        onClick={handleDislike}
      >
        <ThumbsDown className="h-5 w-5" />
        <span>Decline</span>
      </Button>
    </div>
  );
}
