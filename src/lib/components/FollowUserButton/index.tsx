'use client';

import { useEffect, useState } from 'react';
import { UserPlus, UserX } from 'lucide-react';
import { useFollowUser, useUnfollowUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { useValidSession } from '@/hooks/useValidSession';
import { cn } from '@/lib/utils';

interface FollowUserButtonProps {
  initialFollowing: boolean;
  userId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export default function FollowUserButton({
  initialFollowing,
  userId,
  onFollowChange,
  className,
}: FollowUserButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);

  const { data: session } = useValidSession();

  const { mutate: followUser, isLoading: followUserIsLoading } = useFollowUser();
  const { mutate: unfollowUser, isLoading: unfollowUserIsLoading } = useUnfollowUser();

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

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

  if (session?.user.id === userId || isFollowing === undefined) {
    return null;
  }

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
