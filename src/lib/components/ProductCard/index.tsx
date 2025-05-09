'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { Store } from '@/lib/redux/store';
import { Clock, Percent, Trash, X } from 'lucide-react';
import { useDeleteProduct } from '@/lib/api';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import ReleasePatternDrawer from '@/lib/components/ReleasePatternDrawer';
import { Badge } from '@/components/ui/badge';
import SaleForm from '@/lib/components/SaleForm';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  isFree: boolean;
  creatorId: string;
  category: string;
  subCategories: string[];
  status?: string;
  unavailable?: boolean;
  isTesterCall?: boolean;
  isProductView?: boolean;
  salePrice?: number;
  salePriceDueDate?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrls,
  isFree,
  creatorId,
  status,
  category,
  subCategories,
  unavailable = false,
  isTesterCall = false,
  isProductView = false,
  salePrice,
  salePriceDueDate,
}: ProductCardProps) {
  const [currentSalePrice, setCurrentSalePrice] = useState<number | undefined>(undefined);
  const [currentSalePriceDueDate, setCurrentSalePriceDueDate] = useState<string | undefined>(
    undefined,
  );
  const [isReleaseProductDrawerOpen, setIsReleaseProductDrawerOpen] = useState(false);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [isDeleteProductDrawerOpen, setIsDeleteProductDrawerOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const { userId } = useSelector((s: Store) => s.auth);
  const { fetch: deleteProduct, isLoading: deleteProductIsLoading } = useDeleteProduct();

  const isCreator = userId === creatorId;
  const isDueDateActive =
    currentSalePrice !== undefined &&
    currentSalePriceDueDate !== undefined &&
    new Date(currentSalePriceDueDate) > new Date();
  const isSaleActive =
    (currentSalePrice !== undefined && currentSalePriceDueDate === undefined) || isDueDateActive;

  const discountPercentage = isSaleActive
    ? Math.round(((price - currentSalePrice!) / price) * 100)
    : 0;

  useEffect(() => {
    setCurrentSalePrice(salePrice);
  }, [salePrice]);

  useEffect(() => {
    setCurrentSalePriceDueDate(salePriceDueDate);
  }, [salePriceDueDate]);

  useEffect(() => {
    if (!currentSalePriceDueDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const dueDate = new Date(currentSalePriceDueDate);

      if (dueDate <= now) {
        setTimeRemaining('Sale ended');
        return;
      }

      const diffMs = dueDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (diffDays > 0) {
        setTimeRemaining(`${diffDays}d ${diffHrs}h left`);
      } else if (diffHrs > 0) {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${diffHrs}h ${diffMins}m left`);
      } else {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${diffMins}m left`);
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [currentSalePriceDueDate]);

  const handleDeleteProductClick = async (productId: string) => {
    await deleteProduct(productId);
    setIsDeleteProductDrawerOpen(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <Card key={id} className="flex flex-col relative">
      {isSaleActive && (
        <div className="absolute -right-2 -top-2 z-10">
          <div className="relative">
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg">
              SALE {discountPercentage}% OFF
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <ProductImageSlider
          imageUrls={imageUrls}
          title={name}
          category={category}
          subCategories={subCategories}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{name}</CardTitle>
      </CardContent>
      <CardFooter className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          {isFree ? (
            <span className="text-lg font-bold">FOR FREE</span>
          ) : isSaleActive ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-500">
                  ${currentSalePrice!.toFixed(2)}
                </span>
                <span className="text-sm line-through text-gray-500">${price.toFixed(2)}</span>
              </div>
              {isDueDateActive ? (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{timeRemaining}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
          )}

          {isTesterCall ? (
            <Link rel={'nofollow'} href={`/app/tester-calls/${id}`}>
              <Button>Show tester call</Button>
            </Link>
          ) : (
            <Link href={`/app/products/${id}`}>
              <Button>Show details</Button>
            </Link>
          )}
        </div>

        {isDueDateActive && (
          <div className="w-full mt-1 bg-red-50 dark:bg-red-950/20 rounded-md p-2 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              {timeRemaining}
            </span>
          </div>
        )}
      </CardFooter>

      {isProductView && isCreator && !unavailable ? (
        <>
          <CardFooter className="w-full flex flex-col gap-6">
            <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
            <div className="flex justify-end items-center gap-2 w-full">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsSaleFormOpen((prev) => !prev);
                }}
                disabled={isFree}
              >
                {isSaleFormOpen ? <X /> : <Percent />}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteProductDrawerOpen(true);
                }}
              >
                <Trash />
              </Button>
            </div>

            {isSaleFormOpen ? (
              <SaleForm
                productId={id}
                isFree={isFree}
                initialSalePrice={
                  currentSalePrice ? String(currentSalePrice).replace('.', ',') : undefined
                }
                initialSalePriceDueDate={currentSalePriceDueDate}
                setNewSalePrice={setCurrentSalePrice}
                setNewSalePriceDueDate={setCurrentSalePriceDueDate}
              />
            ) : null}

            <Link rel={'nofollow'} href={`/app/secure/sell/products/${id}`} className="w-full">
              <Button variant="secondary" className="w-full">
                Update product
              </Button>
            </Link>
            {status === 'Created' || status === 'InProgress' || status === 'Aborted' ? (
              <Button
                onClick={() => {
                  setIsReleaseProductDrawerOpen(true);
                }}
                className="w-full"
              >
                Release Pattern
              </Button>
            ) : null}
          </CardFooter>
          <ReleasePatternDrawer
            isOpen={isReleaseProductDrawerOpen}
            setIsOpen={setIsReleaseProductDrawerOpen}
            productId={id}
          />
          <ConfirmDrawer
            isOpen={isDeleteProductDrawerOpen}
            setIsOpen={setIsDeleteProductDrawerOpen}
            callbackFn={() => {
              handleDeleteProductClick(id).then(() => setIsDeleteProductDrawerOpen(false));
            }}
            isLoading={deleteProductIsLoading}
            description="You cannot restore deleted patterns."
          />
        </>
      ) : null}
    </Card>
  );
}
