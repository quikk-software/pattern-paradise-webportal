'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { Store } from '@/lib/redux/store';
import { Clock, Percent, Trash, X, Edit, Tag, FileBox, ArrowRight } from 'lucide-react';
import { useDeleteProduct } from '@/lib/api';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import ReleasePatternDrawer from '@/lib/components/ReleasePatternDrawer';
import { Badge } from '@/components/ui/badge';
import SaleForm from '@/lib/components/SaleForm';
import DraftPatternDrawer from '@/lib/components/DraftPatternDrawer';
import UndraftPatternDrawer from '@/lib/components/UndraftPatternDrawer';
import { cn } from '@/lib/utils';

const getStatusDisplayText = (status?: string) => {
  switch (status) {
    case 'InProgress':
      return 'Test Phase';
    default:
      return status;
  }
};

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  isFree: boolean;
  creatorId: string;
  category: string;
  currency?: string;
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
  currency,
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
  const [isDraftProductDrawerOpen, setIsDraftProductDrawerOpen] = useState(false);
  const [isUndraftProductDrawerOpen, setIsUndraftProductDrawerOpen] = useState(false);
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
    !isFree &&
    ((currentSalePrice !== undefined && currentSalePriceDueDate === undefined) || isDueDateActive);

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

  const getStatusBadge = () => {
    if (!status) return null;

    const statusColors = {
      Draft: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      Created: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      InProgress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Aborted: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Released: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };

    const color =
      statusColors[status as keyof typeof statusColors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

    return (
      <Badge variant="outline" className={cn('font-medium border-0', color)}>
        {getStatusDisplayText(status)}
      </Badge>
    );
  };

  return (
    <Card className="relative flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md group h-full">
      {/* Sale badge */}
      {isSaleActive && (
        <div className="absolute -right-1 -top-1 z-10">
          <div className="relative">
            <div className="absolute -right-8 top-0 bg-red-500 text-white px-10 py-1 rotate-45 shadow-md font-bold text-sm">
              {discountPercentage}% OFF
            </div>
          </div>
        </div>
      )}

      {/* Status badge */}
      {status && isProductView && (
        <div className="absolute left-3 top-3 z-10">{getStatusBadge()}</div>
      )}

      {/* Image slider */}
      <div className="relative overflow-hidden">
        <ProductImageSlider
          imageUrls={imageUrls}
          title={name}
          category={category}
          subCategories={subCategories}
        />

        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-grow p-5">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          {isFree ? (
            <div className="flex items-center">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-0 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                FREE
              </Badge>
            </div>
          ) : isSaleActive ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-500">
                ${currentSalePrice!.toFixed(2)}
              </span>
              <span className="text-sm line-through text-gray-400">${price.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
          )}

          {subCategories && subCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {subCategories.slice(0, 2).map((subCat, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {subCat}
                </Badge>
              ))}
              {subCategories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{subCategories.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Sale countdown */}
        {isDueDateActive && (
          <div className="mt-3 bg-red-50 dark:bg-red-950/20 rounded-md p-2 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1.5 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              {timeRemaining}
            </span>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 pt-0">
        <div className="w-full">
          {isTesterCall ? (
            <Link rel={'nofollow'} href={`/app/tester-calls/${id}`} className="w-full">
              <Button className="w-full gap-2">
                Show tester call <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/app/products/${id}`} className="w-full">
              <Button className="w-full gap-2">
                Show details <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>

      {/* Creator controls */}
      {isProductView && isCreator && !unavailable && (
        <div className="border-t border-border p-5 space-y-4">
          {/* Creator actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaleFormOpen((prev) => !prev)}
              disabled={isFree}
              className="flex-1"
            >
              {isSaleFormOpen ? (
                <>
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </>
              ) : (
                <>
                  <Percent className="w-4 h-4 mr-1.5" /> Set Sale
                </>
              )}
            </Button>

            <Link rel={'nofollow'} href={`/app/secure/sell/products/${id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="w-4 h-4 mr-1.5" /> Edit
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteProductDrawerOpen(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          {/* Sale form */}
          {isSaleFormOpen && (
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <SaleForm
                productId={id}
                isFree={isFree}
                currency={currency}
                initialSalePrice={
                  currentSalePrice ? String(currentSalePrice).replace('.', ',') : undefined
                }
                initialSalePriceDueDate={currentSalePriceDueDate}
                setNewSalePrice={setCurrentSalePrice}
                setNewSalePriceDueDate={setCurrentSalePriceDueDate}
              />
            </div>
          )}

          {/* Status-based actions */}
          {(status === 'Draft' ||
            status === 'Created' ||
            status === 'InProgress' ||
            status === 'Aborted') && (
            <Button
              onClick={() => setIsReleaseProductDrawerOpen(true)}
              className="w-full"
              variant="default"
            >
              <Tag className="w-4 h-4 mr-1.5" /> Release Pattern
            </Button>
          )}

          {status === 'Created' && (
            <Button
              onClick={() => setIsDraftProductDrawerOpen(true)}
              className="w-full"
              variant="secondary"
            >
              <FileBox className="w-4 h-4 mr-1.5" /> Move to Draft
            </Button>
          )}

          {status === 'Draft' && (
            <Button
              onClick={() => setIsUndraftProductDrawerOpen(true)}
              className="w-full"
              variant="secondary"
            >
              <Clock className="w-4 h-4 mr-1.5" /> Start Tester Call
            </Button>
          )}
        </div>
      )}

      {/* Drawers */}
      <ReleasePatternDrawer
        isOpen={isReleaseProductDrawerOpen}
        setIsOpen={setIsReleaseProductDrawerOpen}
        productId={id}
      />
      <DraftPatternDrawer
        isOpen={isDraftProductDrawerOpen}
        setIsOpen={setIsDraftProductDrawerOpen}
        productId={id}
      />
      <UndraftPatternDrawer
        isOpen={isUndraftProductDrawerOpen}
        setIsOpen={setIsUndraftProductDrawerOpen}
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
    </Card>
  );
}
