'use client';

import { useEffect, useState } from 'react';
import { UserPlus, UserRoundMinus, UserRoundPlus, UserX } from 'lucide-react';
import { useFollowUser, useGetUserById, useUnfollowUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { useValidSession } from '@/hooks/useValidSession';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FollowUserButtonProps {
  initialFollowing?: boolean;
  userId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
  variant?: 'badge' | 'icon-button';
}

export default function FollowUserButton({
  initialFollowing,
  userId,
  onFollowChange,
  className,
  variant = 'badge',
}: FollowUserButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);

  const { data: session } = useValidSession();

  const { fetch: fetchUser, isLoading: fetchUserIsLoading } = useGetUserById();
  const { mutate: followUser, isLoading: followUserIsLoading } = useFollowUser();
  const { mutate: unfollowUser, isLoading: unfollowUserIsLoading } = useUnfollowUser();

  useEffect(() => {
    if (initialFollowing === undefined) {
      fetchUser(userId).then((result) => setIsFollowing(!!result.isFollowing));
      return;
    }
    setIsFollowing(initialFollowing);
  }, [initialFollowing, userId]);

  const handleClick = async () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);

    if (newFollowingState) {
      await followUser(userId);
    } else {
      await unfollowUser(userId);
    }

    if (onFollowChange) {
      onFollowChange(newFollowingState);
    }
  };

  if (session?.user.id === userId || isFollowing === undefined || fetchUserIsLoading) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <a>
        <Badge
          variant="secondary"
          onClick={handleClick}
          className={cn('cursor-pointer flex', className)}
        >
          {isFollowing ? (
            <>
              {unfollowUserIsLoading ? (
                <LoadingSpinnerComponent />
              ) : (
                <UserX className="mr-1 h-4 w-4" />
              )}
              Unfollow
            </>
          ) : (
            <>
              {followUserIsLoading ? (
                <LoadingSpinnerComponent />
              ) : (
                <UserPlus className="mr-1 h-4 w-4" />
              )}
              Follow
            </>
          )}
        </Badge>
      </a>
    );
  }

  if (variant === 'icon-button') {
    return (
      <Button
        variant="secondary"
        size="icon"
        onClick={handleClick}
        className={isFollowing ? '' : 'border-2 border-green-500 hover:border-green-600'}
      >
        {isFollowing ? (
          unfollowUserIsLoading ? (
            <LoadingSpinnerComponent />
          ) : (
            <UserRoundMinus className="h-4 w-4" />
          )
        ) : followUserIsLoading ? (
          <LoadingSpinnerComponent />
        ) : (
          <UserRoundPlus className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return null;
}
