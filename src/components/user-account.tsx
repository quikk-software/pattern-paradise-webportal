'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetUserAccountResponse } from '@/@types/api-types';
import { useListProductsByUserId } from '@/lib/api';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
import GoBackButton from '@/lib/components/GoBackButton';
import { Input } from '@/components/ui/input';

interface UserAccountComponentProps {
  user: GetUserAccountResponse;
}

export default function UserAccountComponent({ user }: UserAccountComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const observer = useRef<IntersectionObserver | null>(null);

  const screenSize = useScreenSize();

  const {
    fetch: fetchProducts,
    data: products,
    isLoading: fetchProductsIsLoading,
    hasNextPage: fetchProductsHasNextPage,
  } = useListProductsByUserId({});

  useEffect(() => {
    fetchProducts(user.id, {
      status: 'Released',
    });
  }, [user.id]);

  useEffect(() => {
    fetchProducts(user.id, {
      status: 'Released',
      q: debouncedSearchTerm || undefined,
      pageNumber: 1,
      pageSize: 20,
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const lastProductRef = (node: HTMLElement | null) => {
    if (fetchProductsIsLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && fetchProductsHasNextPage) {
        fetchProducts(user.id, {
          status: 'Released',
          q: debouncedSearchTerm || undefined,
        });
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  return (
    <div className="space-y-8">
      <GoBackButton />

      <UserDetailsCard user={user} showRoles={true} />

      {user.description ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">About me</CardTitle>
          </CardHeader>
          <CardContent>{user.description}</CardContent>
        </Card>
      ) : null}

      {user.galleryImages.length > 0 ? <div className=""></div> : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Associated Patterns</h2>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
        {products.length > 0 ? (
          <>
            <div className="flex flex-col gap-6">
              <WaterfallListing
                products={products}
                listingType={'sell'}
                columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 4}
              />
            </div>
            <div ref={lastProductRef} className="h-10" />
          </>
        ) : null}
      </div>
    </div>
  );
}
