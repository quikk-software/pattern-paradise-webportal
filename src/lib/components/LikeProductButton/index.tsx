import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  useCreateProductLike,
  useDeleteProductLike,
  useGetProductLike,
} from '@/lib/api/product-like';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useValidSession } from '@/hooks/useValidSession';

interface LikeProductButtonProps {
  productId: string;
}

export default function LikeProductButton({ productId }: LikeProductButtonProps) {
  const [hasLike, setHasLike] = useState(false);

  const { status } = useValidSession();

  const { fetch: fetchProductLike, isLoading: fetchProductLikeIsLoading } = useGetProductLike();
  const { mutate: createProductLike, isLoading: createProductLikeIsLoading } =
    useCreateProductLike();
  const { mutate: deleteProductLike, isLoading: deleteProductLikeIsLoading } =
    useDeleteProductLike();

  useEffect(() => {
    fetchProductLike(productId).then(() => setHasLike(true));
  }, [productId]);

  const handleClick = () => {
    if (!hasLike) {
      createProductLike(productId, false).then(() => setHasLike(true));
    } else {
      deleteProductLike(productId).then(() => setHasLike(false));
    }
  };

  const isLoading =
    createProductLikeIsLoading || deleteProductLikeIsLoading || fetchProductLikeIsLoading;
  const isLoggedIn = status === 'authenticated';

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      disabled={isLoading}
      onClick={handleClick}
      style={{
        backgroundColor: hasLike ? '#f43f5e' : 'hsl(var(--secondary))',
        color: hasLike ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
      }}
    >
      {isLoading ? (
        <LoadingSpinnerComponent size="sm" className="text-black" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
    </Button>
  );
}
