'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag, ChartNoAxesCombined } from 'lucide-react';
import Link from 'next/link';
import { useGetUser, useListProductsByUserId } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ProductCard from '@/lib/components/ProductCard';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { InfoBoxComponent } from '@/components/info-box';
import { useRouter } from 'next/navigation';
import { useGetProductReportsCount } from '@/lib/api/report';
import OpenIncidentsInfoBox from '@/lib/components/OpenIncidentsInfoBox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SellPageComponent() {
  const [loadMore, setLoadMore] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const router = useRouter();

  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: products, isLoading, hasNextPage } = useListProductsByUserId({});
  const { fetch: fetchProductReportsCount, data: productReportsCount } =
    useGetProductReportsCount();
  const { fetch: fetchUser, data: user } = useGetUser();

  useEffect(() => {
    fetch(userId);
    fetchUser(userId);
    fetchProductReportsCount(userId);
  }, [userId]);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    fetch(userId, {
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      q: debouncedSearchTerm || undefined,
    });
    setLoadMore((p) => !p);
  }, [loadMore, userId, selectedStatus, debouncedSearchTerm]);

  useEffect(() => {
    fetch(userId, {
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      q: debouncedSearchTerm || undefined,
      pageNumber: 1,
      pageSize: 20,
    });
  }, [selectedStatus, debouncedSearchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const isSellingDisabled = !user?.paypalMerchantIsActive && !user?.stripeAccountId;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Actions</h1>
        {productReportsCount && productReportsCount > 0 ? (
          <OpenIncidentsInfoBox type="product" count={productReportsCount} />
        ) : null}
        {isSellingDisabled ? (
          <InfoBoxComponent
            message={
              <>
                In order to create and sell patterns, you must either{' '}
                <Link
                  href="/%5Blocale%5D/app/secure/auth/me?action=scrollToPayPal"
                  rel={'nofollow'}
                  className="text-blue-500 underline"
                >
                  connect PayPal
                </Link>{' '}
                or{' '}
                <Link
                  rel={'nofollow'}
                  href="/%5Blocale%5D/app/secure/auth/me?action=scrollToStripe"
                  className="text-blue-500 underline"
                >
                  connect Stripe
                </Link>{' '}
                to your Pattern Paradise account.
              </>
            }
          />
        ) : null}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2"
            disabled={isSellingDisabled}
            onClick={() => router.push('/app/secure/sell/submit')}
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-lg font-semibold">Create Pattern</span>
          </Button>
        </div>
        <Link rel={'nofollow'} href="/%5Blang%5D/app/secure/sell/dashboard" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <ChartNoAxesCombined className="h-8 w-8" />
            <span className="text-lg font-semibold">Show Analytics</span>
          </Button>
        </Link>
        <Link rel={'nofollow'} href="/%5Blang%5D/app/secure/sell/orders" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-lg font-semibold">Show My Orders</span>
          </Button>
        </Link>
        <Link rel={'nofollow'} href="/%5Blang%5D/app/secure/sell/testings" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <PatternParadiseIcon className="h-8 w-8 fill-black" />
            <span className="text-lg font-semibold">My Tester Calls</span>
          </Button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-8">Your Patterns</h2>
      {isLoading ? <LoadingSpinnerComponent /> : null}
      <div className="space-y-4">
        <Input
          placeholder={'Search...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={(value) => setSelectedStatus(value)} defaultValue={selectedStatus}>
          <SelectTrigger aria-label={'Select a status'}>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="InProgress">Test Phase</SelectItem>
            <SelectItem value="Created">Created</SelectItem>
            <SelectItem value="Released">Released</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
            <SelectItem value="Aborted">Aborted</SelectItem>
            <SelectItem value="Hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  isFree={product.isFree}
                  imageUrls={product.imageUrls}
                  creatorId={product.creatorId}
                  status={product.status}
                  unavailable={
                    product.status === 'Deleted' ||
                    product.status === 'Aborted' ||
                    product.status === 'Declined'
                  }
                  isProductView={true}
                  category={product.category}
                  subCategories={product.subCategories}
                  salePrice={product.salePrice}
                  salePriceDueDate={product.salePriceDueDate}
                />
              ))}
            </div>
            <div className="flex">
              {hasNextPage ? (
                <Button
                  variant={'outline'}
                  className={'w-full'}
                  onClick={() => {
                    setLoadMore(true);
                  }}
                >
                  Load more
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {products.length === 0 && !isLoading ? (
        <p>
          No patterns available.
          <Link
            rel={'nofollow'}
            href="/%5Blang%5D/app/secure/sell/submit"
            className="text-blue-500 underline"
          >
            Create a pattern here!
          </Link>
        </p>
      ) : null}
    </div>
  );
}
