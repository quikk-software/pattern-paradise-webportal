'use client';

import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, Volleyball } from 'lucide-react';
import { GetUserAccountResponse } from '@/@types/api-types';
import { useListProductsByUserId } from '@/lib/api';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import { Badge } from '@/components/ui/badge';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';

interface UserAccountComponentProps {
  user: GetUserAccountResponse;
}

const roleOptions = [
  { id: 'Buyer', label: 'Buyer', icon: ShoppingCart },
  { id: 'Seller', label: 'Seller', icon: User },
  {
    id: 'Tester',
    label: 'Tester',
    icon: Volleyball,
  },
];

export default function UserAccountComponent({ user }: UserAccountComponentProps) {
  const { imageUrl, firstName, lastName, username, instagramRef, tiktokRef, roles } = user;

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
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName?.[0]}
              {lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {firstName} {lastName}
            </CardTitle>
            <p className="text-muted-foreground">@{username}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {instagramRef ? (
              <a
                href={`https://instagram.com/${instagramRef}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge variant="secondary">
                  <InstagramIcon className="w-4 h-4 mr-1" />
                  Instagram
                </Badge>
              </a>
            ) : null}
            {tiktokRef ? (
              <a
                href={`https://tiktok.com/@${tiktokRef}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge variant="secondary">
                  <TikTokIcon className="w-4 h-4 mr-1" />
                  TikTok
                </Badge>
              </a>
            ) : null}
          </div>
          <div className="flex gap-2">
            {roleOptions
              .filter((role) => roles?.includes(role.id))
              .map((role) => (
                <Card key={role.id} className={'ring-1 ring-primary flex-1'}>
                  <CardContent className="flex flex-col items-center text-center p-2">
                    <role.icon className="w-4 h-4 mb-1 text-primary" />
                    <h3 className="font-semibold text-sm">{role.label}</h3>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {user.description ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">About me</CardTitle>
          </CardHeader>
          <CardContent>{user.description}</CardContent>
        </Card>
      ) : null}

      {products.length > 0 ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
