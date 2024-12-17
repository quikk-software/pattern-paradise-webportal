'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetUserAccountResponse } from '@/@types/api-types';
import { useListProductsByUserId } from '@/lib/api';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
import GoBackButton from '@/lib/components/GoBackButton';

interface UserAccountComponentProps {
  user: GetUserAccountResponse;
}

export default function UserAccountComponent({ user }: UserAccountComponentProps) {
  const screenSize = useScreenSize();

  const { fetch: fetchProducts, data: products } = useListProductsByUserId({
    pageNumber: 1,
    pageSize: 4,
  });

  useEffect(() => {
    fetchProducts(user.id, {
      status: 'Released',
    });
  }, [user.id]);

  return (
    <div className="container mx-auto p-6 space-y-8">
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

      {products.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold mb-4">Associated Products</h2>
          <div className="flex flex-col gap-6">
            <WaterfallListing
              products={products}
              listingType={'sell'}
              columns={
                screenSize === 'xs' ||
                screenSize === 'sm' ||
                screenSize === 'md' ||
                screenSize === 'lg'
                  ? 2
                  : products.length < 4
                  ? products.length
                  : 4
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
